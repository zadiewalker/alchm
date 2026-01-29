import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, getOrCreateCustomer, STRIPE_CONFIG } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planType, userEmail, userName, returnUrl } = body;

    if (!planType || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the price ID based on plan type
    let priceId: string;
    switch (planType) {
      case 'growth':
        priceId = STRIPE_CONFIG.prices.growth;
        break;
      case 'transformation':
        priceId = STRIPE_CONFIG.prices.transformation;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid plan type' },
          { status: 400 }
        );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
        { status: 500 }
      );
    }

    // Get or create customer
    const customer = await getOrCreateCustomer({
      email: userEmail,
      name: userName,
      metadata: {
        source: 'alchm_app',
        planType,
      },
    });

    // Create checkout session
    const session = await createCheckoutSession({
      priceId,
      customerId: customer.id,
      successUrl: `${returnUrl || process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&plan=${planType}`,
      cancelUrl: `${returnUrl || process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: userEmail,
        planType,
        source: 'alchm_checkout',
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}