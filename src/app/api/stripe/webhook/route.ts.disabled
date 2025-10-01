/**
 * ALCHM Secure Stripe Webhook Handler
 * Handles subscription events with proper security validation
 * 
 * CRITICAL: This endpoint processes payment data for vulnerable users
 * All security measures are essential for user protection.
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getServerConfig } from '@/lib/config';

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
    const stripe = getStripeInstance();
    
    // Get the raw body and signature
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        serverConfig.stripe.webhookSecret
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: 'Unable to process payment event'
      },
      { status: 500 }
    );
  }
}

// Subscription event handlers with user data protection
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription created:', subscription.id);
    // TODO: Update user record in Firestore with new subscription
    // Ensure all user data remains encrypted and protected
  } catch (error) {
    console.error('Failed to handle subscription creation:', error);
    throw new Error('Subscription processing failed');
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription updated:', subscription.id);
    // TODO: Update user subscription status in Firestore
  } catch (error) {
    console.error('Failed to handle subscription update:', error);
    throw new Error('Subscription update processing failed');
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription deleted:', subscription.id);
    // TODO: Handle subscription cancellation gracefully
    // Maintain user data access during transition period
  } catch (error) {
    console.error('Failed to handle subscription deletion:', error);
    throw new Error('Subscription cancellation processing failed');
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Invoice payment succeeded:', invoice.id);
    // TODO: Confirm user access to premium features
  } catch (error) {
    console.error('Failed to handle successful payment:', error);
    throw new Error('Payment confirmation processing failed');
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('Invoice payment failed:', invoice.id);
    // TODO: Handle failed payment compassionately
    // Provide grace period and support options
  } catch (error) {
    console.error('Failed to handle failed payment:', error);
    throw new Error('Payment failure processing failed');
  }
}

// Security: Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
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