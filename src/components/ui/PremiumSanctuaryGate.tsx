// Premium Sanctuary Feature Gate - Investment-Based Access Control
// Gentle guidance toward sanctuary expansion, never blocking with shame

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PremiumSanctuaryGateProps {
  children: React.ReactNode;
  feature: string;
  description: string;
  isPremium?: boolean;
  showUpgrade?: boolean;
  sanctuaryMessage?: string;
}

export function PremiumSanctuaryGate({
  children,
  feature,
  description,
  isPremium = false,
  showUpgrade = true,
  sanctuaryMessage
}: PremiumSanctuaryGateProps) {
  // If user has premium access, show the feature
  if (isPremium) {
    return <>{children}</>;
  }

  // If not showing upgrade prompt, just hide the feature
  if (!showUpgrade) {
    return null;
  }

  // Show sanctuary invitation for feature expansion
  return (
    <Card variant="gentle" className="relative overflow-hidden">
      {/* Subtle sanctuary glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-100/30 to-transparent pointer-events-none" />
      
      <CardHeader className="text-center relative">
        <div className="w-12 h-12 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>\n        </div>\n        \n        <CardTitle level=\"h3\" className=\"text-sanctuary-gray-800\">\n          {feature} Sanctuary Enhancement\n        </CardTitle>\n        \n        <CardDescription className=\"text-sanctuary-gray-600 leading-relaxed\">\n          {description}\n        </CardDescription>\n      </CardHeader>\n      \n      <CardContent className=\"text-center\">\n        {sanctuaryMessage && (\n          <div className=\"bg-sage-50 rounded-lg p-4 mb-6\">\n            <p className=\"text-sm text-sanctuary-gray-700 leading-relaxed italic\">\n              \"{sanctuaryMessage}\"\n            </p>\n          </div>\n        )}\n        \n        <div className=\"space-y-3 mb-6\">\n          <div className=\"flex items-center justify-center space-x-2 text-sm text-sanctuary-gray-600\">\n            <svg className=\"w-4 h-4 text-sage-500\" fill=\"currentColor\" viewBox=\"0 0 20 20\">\n              <path fillRule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule=\"evenodd\" />\n            </svg>\n            <span>Enhanced emotional wisdom mapping</span>\n          </div>\n          \n          <div className=\"flex items-center justify-center space-x-2 text-sm text-sanctuary-gray-600\">\n            <svg className=\"w-4 h-4 text-sage-500\" fill=\"currentColor\" viewBox=\"0 0 20 20\">\n              <path fillRule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule=\"evenodd\" />\n            </svg>\n            <span>Unlimited Khepera wisdom conversations</span>\n          </div>\n          \n          <div className=\"flex items-center justify-center space-x-2 text-sm text-sanctuary-gray-600\">\n            <svg className=\"w-4 h-4 text-sage-500\" fill=\"currentColor\" viewBox=\"0 0 20 20\">\n              <path fillRule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule=\"evenodd\" />\n            </svg>\n            <span>Advanced healing achievement garden</span>\n          </div>\n        </div>\n        \n        <div className=\"flex flex-col sm:flex-row gap-3\">\n          <Button \n            variant=\"primary\" \n            className=\"flex-1\"\n            onClick={() => window.location.href = '/pricing'}\n          >\n            Expand Your Sanctuary\n          </Button>\n          \n          <Button \n            variant=\"secondary\" \n            className=\"flex-1\"\n            onClick={() => window.location.href = '/pricing#sanctuary-wisdom'}\n          >\n            Learn More\n          </Button>\n        </div>\n        \n        <p className=\"text-xs text-sanctuary-gray-500 mt-4\">\n          Essential Sanctuary remains complete and powerful • Investment optional\n        </p>\n      </CardContent>\n    </Card>\n  );\n}\n\n// Inline Premium Feature Teaser\nexport function InlinePremiumTeaser({ feature, ctaText = \"Unlock Premium\" }: { feature: string; ctaText?: string }) {\n  return (\n    <div className=\"border border-sage-200 rounded-lg p-4 bg-sage-50/50 text-center\">\n      <div className=\"flex items-center justify-center space-x-2 mb-2\">\n        <div className=\"w-6 h-6 bg-sage-400 rounded-full flex items-center justify-center\">\n          <svg className=\"w-3 h-3 text-white\" fill=\"currentColor\" viewBox=\"0 0 20 20\">\n            <path d=\"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z\" />\n          </svg>\n        </div>\n        <span className=\"text-sm font-medium text-sanctuary-gray-700\">{feature}</span>\n      </div>\n      \n      <Button \n        variant=\"secondary\" \n        size=\"sm\"\n        onClick={() => window.location.href = '/pricing'}\n      >\n        {ctaText}\n      </Button>\n    </div>\n  );\n}\n\n// Premium Badge Component\nexport function PremiumSanctuaryBadge({ className = '' }: { className?: string }) {\n  return (\n    <div className={`inline-flex items-center space-x-1 bg-gradient-to-r from-sage-400 to-sage-500 text-white px-2 py-1 rounded-full text-xs font-medium ${className}`}>\n      <svg className=\"w-3 h-3\" fill=\"currentColor\" viewBox=\"0 0 20 20\">\n        <path d=\"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z\" />\n      </svg>\n      <span>Premium Sanctuary</span>\n    </div>\n  );\n}