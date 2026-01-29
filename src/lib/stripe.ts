import Stripe from 'stripe';
import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

// Initialize Stripe on the server
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Initialize Stripe on the client
let stripePromise: Promise<StripeClient | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Pricing configuration
export const STRIPE_CONFIG = {
  prices: {
    growth: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID || '',
    transformation: process.env.STRIPE_TRANSFORMATION_MONTHLY_PRICE_ID || '',
  },
  products: {
    growth: 'Growth Plan',
    transformation: 'Transformation Plan',
  }
} as const;

// Helper function to create a checkout session
export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {}
}: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    subscription_data: {
      metadata,
    },
  });

  return session;
}

// Helper function to create a customer portal session
export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Helper function to get or create a customer
export async function getOrCreateCustomer({
  email,
  name,
  metadata = {}
}: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  // First, try to find existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer if none found
  const customer = await stripe.customers.create({
    email,
    name,
    metadata,
  });

  return customer;
}

// Helper function to get subscription status
export async function getSubscriptionStatus(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  if (subscriptions.data.length === 0) {
    return null;
  }

  const subscription = subscriptions.data[0];
  const priceId = subscription.items.data[0]?.price.id;
  
  let planType: 'sanctuary' | 'growth' | 'transformation' = 'sanctuary';
  
  if (priceId === STRIPE_CONFIG.prices.growth) {
    planType = 'growth';
  } else if (priceId === STRIPE_CONFIG.prices.transformation) {
    planType = 'transformation';
  }

  return {
    subscription,
    planType,
    status: subscription.status,
    currentPeriodEnd: subscription.current_period_end,
    customerId: subscription.customer as string,
  };
}