// Premium Sanctuary Stripe Integration - Investment in Healing Journey
// Compassionate payment processing that honors the vulnerability of seeking growth

export interface SanctuaryCheckoutConfig {
  price_id: string;
  success_url?: string;
  cancel_url?: string;
}

export interface SanctuaryCheckoutResponse {
  checkout_url: string;
  session_id: string;
  message: string;
}

export interface SanctuaryError {
  error: string;
  support_message?: string;
}

// Create sanctuary investment session
export async function createSanctuaryCheckout(config: SanctuaryCheckoutConfig): Promise<SanctuaryCheckoutResponse> {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData: SanctuaryError = await response.json();
      throw new Error(errorData.error || 'Failed to create sanctuary investment session');
    }

    return await response.json();
  } catch (error) {
    console.error('Sanctuary checkout error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Unable to process sanctuary investment at this time'
    );
  }
}

// Sanctuary price configurations
export const SANCTUARY_PRICES = {
  premium_monthly: 'price_premium_sanctuary_monthly',
  premium_yearly: 'price_premium_sanctuary_yearly',
} as const;

// Helper to redirect to Stripe Checkout with sanctuary theming
export async function redirectToSanctuaryCheckout(price_id: string, options?: Partial<SanctuaryCheckoutConfig>) {
  try {
    const checkoutConfig: SanctuaryCheckoutConfig = {
      price_id,
      success_url: options?.success_url,
      cancel_url: options?.cancel_url,
    };

    const { checkout_url } = await createSanctuaryCheckout(checkoutConfig);
    
    // Sanctuary-themed redirect with gentle loading state
    if (typeof window !== 'undefined') {
      window.location.href = checkout_url;
    }
  } catch (error) {
    // Compassionate error handling
    const message = error instanceof Error ? error.message : 'Sanctuary investment temporarily unavailable';
    
    // Show user-friendly error with support options
    alert(message + '\n\nFor sliding scale options or assistance, please contact support.');
    console.error('Sanctuary checkout redirect failed:', error);
  }
}

// Legacy function for backwards compatibility
export async function createCheckoutSession() {
  try {
    return await createSanctuaryCheckout({
      price_id: SANCTUARY_PRICES.premium_monthly,
    });
  } catch (error) {
    console.error('Legacy checkout error:', error);
    throw new Error('Failed to initiate sanctuary investment');
  }
}
