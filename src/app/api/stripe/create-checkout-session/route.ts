/**
 * ALCHM Secure Stripe Checkout Session Creator
 * Creates payment sessions with user privacy protection
 * 
 * CRITICAL: Handles financial data for vulnerable users
 * Security and compassionate UX are paramount.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerConfig, getClientConfig } from '@/lib/config';

// Initialize Stripe with secure configuration
function getStripeInstance(): Stripe {
  try {
    const serverConfig = getServerConfig();
    return new Stripe(serverConfig.stripe.secretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    throw new Error('Payment processing configuration error');
  }
}

export async function POST(request: NextRequest) {
  try {
    const serverConfig = getServerConfig();
    const clientConfig = getClientConfig();
    const stripe = getStripeInstance();

    // Parse and validate request body
    const body = await request.json();
    const { price_id, success_url, cancel_url } = body;

    if (!price_id) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Validate price_id against known sanctuary prices
    const validPriceIds = [
      serverConfig.stripe.priceIds.premiumSanctuary,
      serverConfig.stripe.priceIds.oracleSanctuary,
    ];

    if (!validPriceIds.includes(price_id)) {
      console.warn('Invalid price ID attempted:', price_id);
      return NextResponse.json(
        { error: 'Invalid price selection' },
        { status: 400 }
      );
    }

    // Create secure checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      success_url: success_url || `${clientConfig.api.url}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${clientConfig.api.url}/pricing?cancelled=true`,
      
      // Enhanced metadata for user protection
      metadata: {
        platform: 'alchm',
        version: '2.0',
        environment: clientConfig.environment,
        timestamp: new Date().toISOString(),
      },

      // Subscription configuration
      subscription_data: {
        metadata: {
          platform: 'alchm',
          tier: price_id === serverConfig.stripe.priceIds.oracleSanctuary ? 'oracle_sanctuary' : 'premium_sanctuary',
        },
      },

      // Customer creation is automatic for subscription mode

      // Automatic tax calculation (if enabled)
      automatic_tax: { enabled: true },

      // Billing address collection
      billing_address_collection: 'required',

      // Allow promotion codes
      allow_promotion_codes: true,

      // Custom text for mental health context
      custom_text: {
        submit: {
          message: 'Your investment in healing is deeply valued. Support is available if you need assistance.',
        },
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
      message: 'Sanctuary checkout session created successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    
    // Provide compassionate error messaging
    let errorMessage = 'Unable to process sanctuary investment at this time';
    let supportMessage = 'For assistance or sliding scale options, please contact support.';

    if (error instanceof Stripe.errors.StripeError) {
      switch (error.type) {
        case 'StripeInvalidRequestError':
          errorMessage = 'Invalid payment configuration';
          break;
        case 'StripeAPIError':
          errorMessage = 'Payment service temporarily unavailable';
          break;
        case 'StripeConnectionError':
          errorMessage = 'Connection to payment service failed';
          break;
        default:
          errorMessage = 'Payment processing error occurred';
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        support_message: supportMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Security: Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'Use POST to create checkout sessions'
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}