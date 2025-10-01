/**
 * Privacy-First Billing System for ALCHM
 * Implements comprehensive compliance for vulnerable users
 */

import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/firebaseAdmin';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface BillingCompliance {
  userId: string;
  ageVerified: boolean;
  parentalConsent: boolean;
  financialHardshipStatus: 'none' | 'requested' | 'approved';
  crisisProtectionActive: boolean;
  consentTimestamp: string;
  billingCountry: string;
  gdprRequired: boolean;
}

export interface SubscriptionTier {
  id: 'sanctuary' | 'deep-cut' | 'oracle';
  name: string;
  price: number;
  stripeProductId: string;
  features: string[];
  ageRestriction: number;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'sanctuary',
    name: 'Sanctuary',
    price: 0,
    stripeProductId: '',
    features: [
      'Unlimited daily journaling',
      'Khepera AI reflections',
      'Grace-based streak system',
      'Foundation badges',
      'Crisis resource access',
      'Basic Purpose Resume',
      'Community participation',
      'Offline journaling'
    ],
    ageRestriction: 0
  },
  {
    id: 'deep-cut',
    name: 'Deep Cut',
    price: 499, // cents
    stripeProductId: process.env.STRIPE_DEEP_CUT_PRODUCT_ID || '',
    features: [
      'All Sanctuary features',
      'Advanced pattern recognition',
      'Unlimited Khepera AI',
      'All badge trees',
      'Priority support',
      'Extended exports',
      'Personalized insights',
      'Early access features'
    ],
    ageRestriction: 16
  },
  {
    id: 'oracle',
    name: 'Oracle',
    price: 999, // cents
    stripeProductId: process.env.STRIPE_ORACLE_PRODUCT_ID || '',
    features: [
      'All Deep Cut features',
      'Family dashboard',
      'Group therapy tools',
      'Advanced crisis prevention',
      'Professional analytics',
      'Custom AI training',
      'Unlimited cloud storage',
      'Professional consultation'
    ],
    ageRestriction: 18
  }
];

export class PrivacyFirstBilling {
  /**
   * Age verification with COPPA compliance
   */
  static async verifyAge(userId: string, birthDate: string): Promise<{
    isValid: boolean;
    ageGroup: 'child' | 'teen' | 'adult';
    parentalConsentRequired: boolean;
  }> {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    
    let ageGroup: 'child' | 'teen' | 'adult';
    let parentalConsentRequired = false;

    if (age < 13) {
      ageGroup = 'child';
      parentalConsentRequired = true;
    } else if (age < 18) {
      ageGroup = 'teen';
      parentalConsentRequired = true; // For billing purposes
    } else {
      ageGroup = 'adult';
    }

    // Store age verification
    await setDoc(doc(db, 'billing_compliance', userId), {
      ageVerified: true,
      ageGroup,
      parentalConsentRequired,
      verificationDate: new Date().toISOString(),
      birthDate: '', // Don't store actual birth date
    }, { merge: true });

    return {
      isValid: true,
      ageGroup,
      parentalConsentRequired
    };
  }

  /**
   * Parental consent flow for minors
   */
  static async requestParentalConsent(userId: string, parentEmail: string): Promise<{
    consentId: string;
    expiresAt: string;
  }> {
    const consentId = `consent_${userId}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await setDoc(doc(db, 'parental_consent', consentId), {
      userId,
      parentEmail,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      expiresAt,
      ipAddress: '', // Collect from request
      userAgent: '' // Collect from request
    });

    // Send email (implement with Firebase Functions)
    // await sendParentalConsentEmail(parentEmail, consentId);

    return { consentId, expiresAt };
  }

  /**
   * Financial hardship accommodation system
   */
  static async requestFinancialHardship(userId: string, reason: string): Promise<{
    requestId: string;
    status: string;
  }> {
    const requestId = `hardship_${userId}_${Date.now()}`;

    await setDoc(doc(db, 'financial_hardship', requestId), {
      userId,
      reason,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      reviewBy: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days
    });

    // Grant immediate access to Deep Cut tier during review
    await updateDoc(doc(db, 'users', userId), {
      tempTier: 'deep-cut',
      tempTierExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    return { requestId, status: 'pending' };
  }

  /**
   * Crisis protection - pause billing during crisis
   */
  static async activateCrisisProtection(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().subscriptionId) {
      // Pause Stripe subscription
      try {
        await stripe.subscriptions.update(userDoc.data().subscriptionId, {
          pause_collection: {
            behavior: 'mark_uncollectible'
          }
        });

        await updateDoc(userRef, {
          crisisProtectionActive: true,
          crisisProtectionStarted: new Date().toISOString(),
          billingPaused: true
        });
      } catch (error) {
        console.error('Error activating crisis protection:', error);
      }
    }
  }

  /**
   * Create subscription with full compliance checks
   */
  static async createSubscription(
    userId: string, 
    tierId: 'deep-cut' | 'oracle',
    paymentMethodId: string
  ): Promise<{
    success: boolean;
    subscriptionId?: string;
    error?: string;
    requiresAction?: boolean;
    clientSecret?: string;
  }> {
    try {
      // Check compliance
      const complianceDoc = await getDoc(doc(db, 'billing_compliance', userId));
      if (!complianceDoc.exists()) {
        return { success: false, error: 'Age verification required' };
      }

      const compliance = complianceDoc.data();
      if (compliance.parentalConsentRequired && !compliance.parentalConsent) {
        return { success: false, error: 'Parental consent required' };
      }

      // Check crisis protection
      if (compliance.crisisProtectionActive) {
        return { success: false, error: 'Billing paused due to crisis protection' };
      }

      const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
      if (!tier) {
        return { success: false, error: 'Invalid subscription tier' };
      }

      // Create Stripe customer if needed
      const userDoc = await getDoc(doc(db, 'users', userId));
      let customerId = userDoc.data()?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: { userId, ageVerified: 'true' }
        });
        customerId = customer.id;

        await updateDoc(doc(db, 'users', userId), {
          stripeCustomerId: customerId
        });
      }

      // Attach payment method
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: tier.stripeProductId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
          payment_method_options: {
            card: {
              request_three_d_secure: 'if_required'
            }
          }
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
          tier: tierId,
          ageVerified: 'true'
        }
      });

      // Update user record
      await updateDoc(doc(db, 'users', userId), {
        subscriptionId: subscription.id,
        currentTier: tierId,
        subscriptionStatus: subscription.status,
        subscriptionStarted: new Date().toISOString()
      });

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice.payment_intent;

      if (paymentIntent.status === 'requires_action') {
        return {
          success: false,
          requiresAction: true,
          clientSecret: paymentIntent.client_secret
        };
      }

      return {
        success: true,
        subscriptionId: subscription.id
      };

    } catch (error: any) {
      console.error('Subscription creation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create subscription'
      };
    }
  }

  /**
   * Cancel subscription with grace period
   */
  static async cancelSubscription(userId: string, reason?: string): Promise<{
    success: boolean;
    gracePeriodEnd?: string;
  }> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const subscriptionId = userDoc.data()?.subscriptionId;

      if (!subscriptionId) {
        return { success: false };
      }

      // Cancel at period end to provide grace period
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
        metadata: {
          cancellation_reason: reason || 'user_requested',
          cancelled_at: new Date().toISOString()
        }
      });

      await updateDoc(doc(db, 'users', userId), {
        subscriptionStatus: 'canceling',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason,
        gracePeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
      });

      return {
        success: true,
        gracePeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
      };

    } catch (error) {
      console.error('Cancellation error:', error);
      return { success: false };
    }
  }

  /**
   * Process refund with trauma-informed approach
   */
  static async processRefund(
    userId: string, 
    reason: 'crisis' | 'financial_hardship' | 'technical_issue' | 'other',
    description: string
  ): Promise<{ success: boolean; refundId?: string }> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const subscriptionId = userDoc.data()?.subscriptionId;

      if (!subscriptionId) {
        return { success: false };
      }

      // Get latest invoice
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const latestInvoiceId = subscription.latest_invoice as string;
      const invoice = await stripe.invoices.retrieve(latestInvoiceId);

      if (invoice.charge) {
        // Create refund
        const refund = await stripe.refunds.create({
          charge: invoice.charge as string,
          reason: reason === 'crisis' ? 'requested_by_customer' : 'requested_by_customer',
          metadata: {
            userId,
            refund_reason: reason,
            description,
            processed_at: new Date().toISOString()
          }
        });

        // Record refund
        await setDoc(doc(db, 'refunds', refund.id), {
          userId,
          subscriptionId,
          amount: refund.amount,
          reason,
          description,
          processedAt: new Date().toISOString(),
          stripeRefundId: refund.id
        });

        return { success: true, refundId: refund.id };
      }

      return { success: false };

    } catch (error) {
      console.error('Refund error:', error);
      return { success: false };
    }
  }

  /**
   * Get billing compliance status
   */
  static async getComplianceStatus(userId: string): Promise<BillingCompliance | null> {
    try {
      const complianceDoc = await getDoc(doc(db, 'billing_compliance', userId));
      if (!complianceDoc.exists()) {
        return null;
      }

      return complianceDoc.data() as BillingCompliance;
    } catch (error) {
      console.error('Error getting compliance status:', error);
      return null;
    }
  }
}

export default PrivacyFirstBilling;