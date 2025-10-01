'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SubscriptionTermsProps {
  className?: string;
}

export default function SubscriptionTerms({ className = '' }: SubscriptionTermsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Subscription Terms & Conditions
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium"
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        <div className="text-xs text-gray-700 space-y-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">• Auto-Renewal:</span> Subscriptions automatically renew monthly
            </div>
            <div>
              <span className="font-medium">• Cancellation:</span> Cancel anytime in account settings
            </div>
            <div>
              <span className="font-medium">• Pricing:</span> Deep Cut $4.99/mo, Oracle $9.99/mo
            </div>
            <div>
              <span className="font-medium">• Payment:</span> Processed securely via Stripe
            </div>
          </div>

          {isExpanded && (
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <div>
                <span className="font-medium">Billing & Payments:</span>
                <ul className="ml-4 mt-1 text-xs text-gray-600">
                  <li>• Subscriptions are billed monthly on the date you subscribe</li>
                  <li>• All payments are processed securely through Stripe</li>
                  <li>• Pricing is in USD and may vary by region due to applicable taxes</li>
                  <li>• Payment method will be charged automatically each billing cycle</li>
                </ul>
              </div>

              <div>
                <span className="font-medium">Cancellation & Refunds:</span>
                <ul className="ml-4 mt-1 text-xs text-gray-600">
                  <li>• Cancel your subscription anytime from your account settings</li>
                  <li>• Cancellation takes effect at the end of your current billing period</li>
                  <li>• No refunds for partial months or unused time</li>
                  <li>• You retain access to premium features until your subscription expires</li>
                </ul>
              </div>

              <div>
                <span className="font-medium">Feature Access:</span>
                <ul className="ml-4 mt-1 text-xs text-gray-600">
                  <li>• Deep Cut: Advanced pathways, enhanced prompts, pattern insights</li>
                  <li>• Oracle: All Deep Cut features plus AI insights and premium guidance</li>
                  <li>• Free tier includes basic journaling and pathway access</li>
                  <li>• Features may be updated or modified with advance notice</li>
                </ul>
              </div>

              <div className="pt-2 flex gap-4 text-xs">
                <Link href="/terms.html" className="text-blue-600 hover:text-blue-700 font-medium">
                  Full Terms of Service →
                </Link>
                <Link href="/privacy.html" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy →
                </Link>
                <a href="mailto:support@alchm.app" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support →
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>
              <strong>Your Privacy:</strong> Subscription data is encrypted and your journal content remains private. We never share your personal writing or insights.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}