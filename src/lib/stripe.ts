// src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Must match the version your installed Stripe types expect
  apiVersion: '2023-10-16',
});
