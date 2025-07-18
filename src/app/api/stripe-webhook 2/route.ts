import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('✅ Checkout completed:', event.data.object);
        break;
      case 'invoice.payment_succeeded':
        console.log('✅ Payment succeeded:', event.data.object);
        break;
      case 'customer.subscription.deleted':
        console.log('⚠️ Subscription cancelled:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
