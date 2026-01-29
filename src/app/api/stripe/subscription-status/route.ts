import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCustomer, getSubscriptionStatus } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Missing user email' },
        { status: 400 }
      );
    }

    // Get customer
    const customer = await getOrCreateCustomer({
      email: userEmail,
    });

    // Get subscription status
    const subscriptionStatus = await getSubscriptionStatus(customer.id);

    return NextResponse.json({
      customerId: customer.id,
      subscription: subscriptionStatus,
      planType: subscriptionStatus?.planType || 'sanctuary',
      isActive: subscriptionStatus?.status === 'active',
    });

  } catch (error) {
    console.error('Error getting subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}