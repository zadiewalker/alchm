import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession, getOrCreateCustomer } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, returnUrl } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Missing user email' },
        { status: 400 }
      );
    }

    // Get customer (should exist if they have a subscription)
    const customer = await getOrCreateCustomer({
      email: userEmail,
    });

    // Create portal session
    const session = await createCustomerPortalSession({
      customerId: customer.id,
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}