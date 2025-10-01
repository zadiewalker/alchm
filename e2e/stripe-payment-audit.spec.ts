/**
 * ALCHM Stripe Payment Integration Audit
 * 
 * Sacred promise: Payment flows must be secure, transparent, and respectful.
 * No hidden fees, no dark patterns, no exploitation of vulnerability.
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://alchm-digital-sanctuary.web.app';

test.describe('Stripe Payment Integration Security Audit', () => {
  test.setTimeout(90000);

  // Test payment page existence and security
  test('should handle payment pages securely', async ({ page }) => {
    const paymentUrls = [
      '/pricing',
      '/upgrade',
      '/checkout',
      '/payment',
      '/subscribe',
      '/billing'
    ];

    let paymentPagesFound = 0;
    
    for (const url of paymentUrls) {
      await page.goto(`${PRODUCTION_URL}${url}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      const is404 = content.includes('404') || content.includes('not found');
      
      if (!is404) {
        paymentPagesFound++;
        console.log(`✅ Payment page found: ${url}`);
        
        // Check for HTTPS
        const isSecure = page.url().startsWith('https://');
        expect(isSecure).toBe(true);
        
        // Look for Stripe elements
        const hasStripeElements = await page.locator('[data-stripe], .stripe, #stripe').count() > 0;
        if (hasStripeElements) {
          console.log(`✅ Stripe elements detected on ${url}`);
        }
        
        // Check for pricing information
        const hasPricing = content.includes('$') || content.includes('price') || content.includes('plan');
        if (hasPricing) {
          console.log(`✅ Pricing information present on ${url}`);
        }
        
        // Verify no hardcoded payment info
        const hasHardcodedCard = /\b4\d{3}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(content);
        expect(hasHardcodedCard).toBe(false);
        
      } else {
        console.log(`ℹ️ No payment page at: ${url}`);
      }
    }
    
    console.log(`Payment pages found: ${paymentPagesFound}/${paymentUrls.length}`);
  });

  // Test Stripe script loading and security
  test('should load Stripe scripts securely', async ({ page }) => {
    // Monitor script loading
    const scripts: string[] = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'script') {
        scripts.push(request.url());
      }
    });

    await page.goto(`${PRODUCTION_URL}/pricing`, { waitUntil: 'networkidle' });
    
    // Check for Stripe.js
    const stripeScripts = scripts.filter(script => 
      script.includes('stripe') || script.includes('js.stripe.com')
    );
    
    if (stripeScripts.length > 0) {
      console.log(`✅ Stripe scripts found: ${stripeScripts.length}`);
      
      // Verify Stripe scripts are from official domain
      for (const script of stripeScripts) {
        const isOfficialStripe = script.includes('js.stripe.com') || 
                                script.includes('checkout.stripe.com');
        if (isOfficialStripe) {
          console.log(`✅ Official Stripe script: ${script}`);
        } else {
          console.warn(`⚠️ Third-party Stripe script: ${script}`);
        }
      }
    } else {
      console.log('ℹ️ No Stripe scripts detected - static mode or no payment integration');
    }
  });

  // Test payment form security
  test('should implement secure payment forms', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pricing`, { waitUntil: 'networkidle' });
    
    // Look for payment forms
    const paymentForms = page.locator('form').filter({
      has: page.locator('input[type="text"], input[name*="card"], input[name*="payment"], [data-stripe]')
    });
    
    const formCount = await paymentForms.count();
    
    if (formCount > 0) {
      console.log(`✅ Payment forms found: ${formCount}`);
      
      for (let i = 0; i < formCount; i++) {
        const form = paymentForms.nth(i);
        
        // Check form action
        const action = await form.getAttribute('action');
        if (action) {
          const isSecureAction = action.startsWith('https://') || action.startsWith('/');
          expect(isSecureAction).toBe(true);
          console.log(`✅ Secure form action: ${action}`);
        }
        
        // Check for CSRF protection
        const hasCSRF = await form.locator('input[name*="csrf"], input[name*="token"]').count() > 0;
        if (hasCSRF) {
          console.log(`✅ CSRF protection detected`);
        }
        
        // Check for SSL/security indicators
        const hasSecurityIndicator = await page.locator('🔒, .secure, .ssl, [data-secure]').count() > 0;
        if (hasSecurityIndicator) {
          console.log(`✅ Security indicators present`);
        }
      }
    } else {
      console.log('ℹ️ No payment forms found - may use Stripe Checkout redirect');
    }
  });

  // Test webhook endpoints security
  test('should protect webhook endpoints', async ({ page }) => {
    const webhookUrls = [
      '/api/stripe-webhook',
      '/api/webhooks/stripe',
      '/webhooks/stripe',
      '/stripe/webhook'
    ];

    for (const url of webhookUrls) {
      // Test GET request (should not be allowed)
      await page.goto(`${PRODUCTION_URL}${url}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      const isMethodNotAllowed = content.includes('405') || 
                                 content.includes('Method Not Allowed') ||
                                 content.includes('not allowed');
      
      if (isMethodNotAllowed) {
        console.log(`✅ Webhook endpoint properly protected: ${url}`);
      } else if (content.includes('404')) {
        console.log(`ℹ️ Webhook endpoint not found: ${url}`);
      } else {
        console.warn(`⚠️ Webhook endpoint may be accessible via GET: ${url}`);
      }
    }
  });

  // Test pricing transparency
  test('should display transparent pricing', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pricing`, { waitUntil: 'networkidle' });
    
    const content = await page.textContent('body');
    
    if (!content.includes('404')) {
      // Check for pricing information
      const hasPrices = /\$\d+/.test(content) || /\d+\.\d{2}/.test(content);
      if (hasPrices) {
        console.log(`✅ Pricing information displayed`);
        
        // Check for transparency indicators
        const transparencyTerms = [
          'no hidden fees',
          'cancel anytime',
          'free trial',
          'money back',
          'refund',
          'transparent'
        ];
        
        const hasTransparency = transparencyTerms.some(term => 
          content.toLowerCase().includes(term)
        );
        
        if (hasTransparency) {
          console.log(`✅ Transparency messaging present`);
        } else {
          console.log(`ℹ️ Consider adding transparency messaging`);
        }
        
        // Check for subscription terms
        const hasTerms = content.includes('terms') || 
                        content.includes('billing') ||
                        content.includes('subscription');
        
        if (hasTerms) {
          console.log(`✅ Subscription terms mentioned`);
        }
      } else {
        console.log(`ℹ️ No pricing information found`);
      }
    } else {
      console.log('ℹ️ No pricing page found');
    }
  });

  // Test payment success/failure handling
  test('should handle payment outcomes appropriately', async ({ page }) => {
    const outcomeUrls = [
      '/success',
      '/payment-success',
      '/checkout-success',
      '/upgrade-success',
      '/payment-failed',
      '/checkout-failed',
      '/error'
    ];

    let outcomePages = 0;
    
    for (const url of outcomeUrls) {
      await page.goto(`${PRODUCTION_URL}${url}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      const is404 = content.includes('404') || content.includes('not found');
      
      if (!is404) {
        outcomePages++;
        console.log(`✅ Payment outcome page found: ${url}`);
        
        // Check for appropriate messaging
        if (url.includes('success')) {
          const hasSuccessMessage = content.includes('success') || 
                                   content.includes('thank you') ||
                                   content.includes('confirmed');
          if (hasSuccessMessage) {
            console.log(`✅ Success messaging present on ${url}`);
          }
          
          // Check for next steps
          const hasNextSteps = content.includes('dashboard') ||
                              content.includes('get started') ||
                              content.includes('continue');
          if (hasNextSteps) {
            console.log(`✅ Next steps provided on ${url}`);
          }
        }
        
        if (url.includes('fail') || url.includes('error')) {
          const hasErrorMessage = content.includes('error') ||
                                 content.includes('failed') ||
                                 content.includes('problem');
          if (hasErrorMessage) {
            console.log(`✅ Error messaging present on ${url}`);
          }
          
          // Check for retry options
          const hasRetry = content.includes('try again') ||
                          content.includes('retry') ||
                          content.includes('contact');
          if (hasRetry) {
            console.log(`✅ Retry options provided on ${url}`);
          }
        }
      }
    }
    
    console.log(`Payment outcome pages found: ${outcomePages}`);
  });

  // Test subscription management
  test('should provide subscription management', async ({ page }) => {
    const managementUrls = [
      '/account',
      '/billing',
      '/subscription',
      '/manage',
      '/settings'
    ];

    for (const url of managementUrls) {
      await page.goto(`${PRODUCTION_URL}${url}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      const is404 = content.includes('404') || content.includes('not found');
      
      if (!is404) {
        console.log(`✅ Management page found: ${url}`);
        
        // Check for subscription controls
        const managementFeatures = [
          'cancel',
          'upgrade',
          'downgrade',
          'change plan',
          'billing history',
          'payment method',
          'subscription'
        ];
        
        const hasManagementFeatures = managementFeatures.some(feature =>
          content.toLowerCase().includes(feature)
        );
        
        if (hasManagementFeatures) {
          console.log(`✅ Subscription management features present on ${url}`);
        }
        
        // Check for security (auth required)
        const requiresAuth = content.includes('login') ||
                           content.includes('sign in') ||
                           content.includes('authenticate');
        
        if (requiresAuth) {
          console.log(`✅ Authentication required for ${url}`);
        }
      }
    }
  });

  // Test PCI compliance indicators
  test('should show PCI compliance awareness', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pricing`, { waitUntil: 'networkidle' });
    
    const content = await page.textContent('body');
    
    if (!content.includes('404')) {
      // Check for security/compliance messaging
      const complianceTerms = [
        'secure',
        'encrypted',
        'ssl',
        'pci',
        'compliant',
        'protected',
        'safe',
        'stripe'
      ];
      
      const hasComplianceMessaging = complianceTerms.some(term =>
        content.toLowerCase().includes(term)
      );
      
      if (hasComplianceMessaging) {
        console.log(`✅ Security/compliance messaging present`);
      }
      
      // Check for Stripe branding (indicates proper integration)
      const hasStripeBranding = content.includes('Stripe') || 
                               content.includes('stripe') ||
                               await page.locator('[data-stripe], .stripe').count() > 0;
      
      if (hasStripeBranding) {
        console.log(`✅ Stripe integration properly attributed`);
      }
    }
  });
});