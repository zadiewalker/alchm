/**
 * Trauma-Informed Subscription Manager
 * Provides safe, accessible billing management for vulnerable users
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import PrivacyFirstBilling, { SUBSCRIPTION_TIERS } from '@/lib/billing/privacy-first-billing';

interface SubscriptionData {
  currentTier: 'sanctuary' | 'deep-cut' | 'oracle';
  status: 'active' | 'canceling' | 'cancelled' | 'past_due';
  nextBillingDate?: string;
  gracePeriodEnd?: string;
  crisisProtectionActive?: boolean;
  financialHardshipStatus?: 'none' | 'requested' | 'approved';
}

export default function SubscriptionManager() {
  const { user } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRefundRequest, setShowRefundRequest] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      // Load subscription data from Firebase
      // This would be implemented with actual Firebase calls
      setSubscription({
        currentTier: 'deep-cut',
        status: 'active',
        nextBillingDate: '2024-10-15',
        crisisProtectionActive: false,
        financialHardshipStatus: 'none'
      });
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (reason: string) => {
    if (!user) return;

    setActionLoading(true);
    try {
      const result = await PrivacyFirstBilling.cancelSubscription(user.uid, reason);
      if (result.success) {
        setSubscription(prev => prev ? {
          ...prev,
          status: 'canceling',
          gracePeriodEnd: result.gracePeriodEnd
        } : null);
        setShowCancelConfirm(false);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRefund = async (reason: string, description: string) => {
    if (!user) return;

    setActionLoading(true);
    try {
      const result = await PrivacyFirstBilling.processRefund(
        user.uid,
        reason as any,
        description
      );
      if (result.success) {
        // Show success message
        setShowRefundRequest(false);
      }
    } catch (error) {
      console.error('Error requesting refund:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinancialHardship = async () => {
    if (!user) return;

    setActionLoading(true);
    try {
      const result = await PrivacyFirstBilling.requestFinancialHardship(
        user.uid,
        'Financial difficulty accessing mental health support'
      );
      if (result.status === 'pending') {
        setSubscription(prev => prev ? {
          ...prev,
          financialHardshipStatus: 'requested'
        } : null);
      }
    } catch (error) {
      console.error('Error requesting financial hardship:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">
            No Active Subscription
          </h2>
          <p className="text-gray-600 mb-6">
            You're currently using Sanctuary (Free) - complete with unlimited journaling and core features.
          </p>
          <Button 
            onClick={() => router.push('/pricing')}
            variant="sage"
            size="lg"
          >
            Explore Plans
          </Button>
        </Card>
      </div>
    );
  }

  const currentTierData = SUBSCRIPTION_TIERS.find(t => t.id === subscription.currentTier);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Crisis Protection Notice */}
      {subscription.crisisProtectionActive && (
        <Card className="border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-800 text-sm">⚠</span>
            </div>
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">
                Crisis Protection Active
              </h3>
              <p className="text-yellow-700 text-sm">
                Your billing has been paused while you navigate this difficult time. 
                All features remain available. Take care of yourself - we're here when you're ready.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Current Subscription */}
      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-gray-800 mb-2">
              Your Subscription
            </h1>
            <div className="flex items-center space-x-3">
              <Badge 
                variant={subscription.currentTier === 'oracle' ? 'sage' : 'secondary'}
                className="text-sm"
              >
                {currentTierData?.name} Plan
              </Badge>
              <Badge 
                variant={subscription.status === 'active' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {subscription.status === 'active' ? 'Active' : 
                 subscription.status === 'canceling' ? 'Canceling' : 
                 subscription.status}
              </Badge>
            </div>
          </div>
          
          {subscription.currentTier !== 'sanctuary' && (
            <div className="text-right">
              <div className="text-2xl font-light text-gray-800">
                ${(currentTierData?.price || 0) / 100}/month
              </div>
              {subscription.nextBillingDate && subscription.status === 'active' && (
                <div className="text-sm text-gray-600">
                  Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                </div>
              )}
              {subscription.gracePeriodEnd && (
                <div className="text-sm text-orange-600">
                  Access until: {new Date(subscription.gracePeriodEnd).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Your Current Features</h3>
            <ul className="space-y-2">
              {currentTierData?.features.slice(0, 6).map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-sage-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {currentTierData?.features.length > 6 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Additional Benefits</h3>
              <ul className="space-y-2">
                {currentTierData.features.slice(6).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-sage-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
          {subscription.currentTier !== 'sanctuary' && subscription.status === 'active' && (
            <>
              <Button
                variant="outline"
                onClick={() => router.push('/pricing')}
                disabled={actionLoading}
              >
                Change Plan
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(true)}
                disabled={actionLoading}
              >
                Pause Subscription
              </Button>
            </>
          )}

          {subscription.financialHardshipStatus === 'none' && (
            <Button
              variant="outline"
              onClick={handleFinancialHardship}
              disabled={actionLoading}
              className="text-sage-600 hover:text-sage-700"
            >
              Request Financial Assistance
            </Button>
          )}

          {subscription.financialHardshipStatus === 'requested' && (
            <Badge variant="secondary" className="px-3 py-1">
              Financial assistance requested - reviewing within 48 hours
            </Badge>
          )}

          <Button
            variant="outline"
            onClick={() => setShowRefundRequest(true)}
            disabled={actionLoading}
          >
            Request Refund
          </Button>
        </div>
      </Card>

      {/* Support Resources */}
      <Card className="p-6 bg-sage-50 border-sage-200">
        <h3 className="font-medium text-sage-800 mb-3">Need Support?</h3>
        <div className="space-y-2 text-sm text-sage-700">
          <p>• <strong>Financial Hardship:</strong> We offer sliding scale pricing and free access during difficult times.</p>
          <p>• <strong>Crisis Support:</strong> Your subscription automatically pauses during crisis detection - focus on your wellbeing.</p>
          <p>• <strong>Questions:</strong> Email support@alchm.app for human help with billing concerns.</p>
          <p>• <strong>Immediate Crisis:</strong> Call 988 (Suicide & Crisis Lifeline) if you need immediate support.</p>
        </div>
      </Card>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Pause Your Subscription?
            </h3>
            <p className="text-gray-600 mb-6">
              Your access will continue until your next billing date. You can reactivate anytime.
              No judgment, no penalties - your wellbeing comes first.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
                disabled={actionLoading}
                className="flex-1"
              >
                Keep Subscription
              </Button>
              <Button
                variant="sage"
                onClick={() => handleCancelSubscription('user_requested')}
                disabled={actionLoading}
                className="flex-1"
              >
                {actionLoading ? 'Processing...' : 'Pause Subscription'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Refund Request Modal */}
      {showRefundRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Request Refund
            </h3>
            <p className="text-gray-600 mb-4">
              We process refunds within 24 hours. Select the reason that best fits:
            </p>
            <div className="space-y-2 mb-6">
              <Button
                variant="outline"
                onClick={() => handleRequestRefund('crisis', 'Mental health crisis requiring refund')}
                disabled={actionLoading}
                className="w-full justify-start"
              >
                Mental Health Crisis
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRequestRefund('financial_hardship', 'Financial hardship requiring refund')}
                disabled={actionLoading}
                className="w-full justify-start"
              >
                Financial Hardship
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRequestRefund('technical_issue', 'Technical issues with service')}
                disabled={actionLoading}
                className="w-full justify-start"
              >
                Technical Issues
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRequestRefund('other', 'Other reason for refund')}
                disabled={actionLoading}
                className="w-full justify-start"
              >
                Other Reason
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowRefundRequest(false)}
              disabled={actionLoading}
              className="w-full"
            >
              Cancel
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}