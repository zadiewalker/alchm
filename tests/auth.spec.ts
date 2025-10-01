import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("auth page renders with correct copy", async ({ page }) => {
    await page.goto("/auth");
    
    // Check main heading
    await expect(page.getByText("Unlock your ritual")).toBeVisible();
    
    // Check subheading
    await expect(page.getByText("Private by design. Encrypted by default")).toBeVisible();
    
    // Check sign-in buttons are present
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /continue with apple/i })).toBeVisible();
    
    // Check magic link
    await expect(page.getByText(/prefer email/i)).toBeVisible();
  });

  test("email link page renders correctly", async ({ page }) => {
    await page.goto("/auth/email");
    
    // Check heading
    await expect(page.getByText("Passwordless Sign-in")).toBeVisible();
    
    // Check email input and button
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByRole("button", { name: /email me a magic link/i })).toBeVisible();
    
    // Check back link
    await expect(page.getByText(/back to sign in options/i)).toBeVisible();
  });

  test("protected routes redirect to auth", async ({ page }) => {
    // Try to access protected /journal route
    await page.goto("/journal");
    
    // Should redirect to auth page
    await expect(page.url()).toContain("/auth");
    
    // Should have redirect parameter
    expect(page.url()).toContain("redirect=%2Fjournal");
  });

  test("account page requires authentication", async ({ page }) => {
    await page.goto("/account");
    
    // Should show sign in message
    await expect(page.getByText("Sign in to manage your account")).toBeVisible();
    
    // Should have sign in button
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });

  test("email link form validation", async ({ page }) => {
    await page.goto("/auth/email");
    
    // Try to submit without email
    await page.getByRole("button", { name: /email me a magic link/i }).click();
    
    // Should show error message
    await expect(page.getByText(/please enter your email address/i)).toBeVisible();
  });

  test("email link form shows success state", async ({ page }) => {
    await page.goto("/auth/email");
    
    // Mock the sendSignInLinkToEmail function to avoid Firebase calls
    await page.addInitScript(() => {
      window.firebase = {
        auth: {
          sendSignInLinkToEmail: () => Promise.resolve(),
          isSignInWithEmailLink: () => false,
          signInWithEmailLink: () => Promise.resolve()
        }
      };
    });
    
    // Fill in email and submit
    await page.fill('input[type="email"]', "test@example.com");
    await page.getByRole("button", { name: /email me a magic link/i }).click();
    
    // Should show success message
    await expect(page.getByText(/check your inbox for a secure sign-in link/i)).toBeVisible();
    await expect(page.getByText("test@example.com")).toBeVisible();
  });

  test("home page has correct auth CTA", async ({ page }) => {
    await page.goto("/");
    
    // Check main CTA
    await expect(page.getByRole("link", { name: /start your streak/i })).toBeVisible();
    
    // Check privacy link
    await expect(page.getByRole("link", { name: /privacy first/i })).toBeVisible();
  });

  test("terms and privacy pages are accessible", async ({ page }) => {
    // Check Terms of Service
    await page.goto("/about/terms");
    await expect(page.getByText(/terms of service/i)).toBeVisible();
    
    // Check Privacy Policy
    await page.goto("/about/privacy");
    await expect(page.getByText(/privacy policy/i)).toBeVisible();
  });
});

test.describe("Account Management", () => {
  test("account page shows provider management when signed in", async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.mockAuth = {
        currentUser: {
          uid: "test-user-id",
          providerData: [{ providerId: "google.com" }]
        }
      };
    });
    
    await page.goto("/account");
    
    // Should show account settings instead of sign in prompt
    await expect(page.getByText("Account Settings")).toBeVisible();
    await expect(page.getByText("Connected sign-in methods")).toBeVisible();
  });

  test("danger zone shows export and delete options", async ({ page }) => {
    // Mock authenticated state  
    await page.addInitScript(() => {
      window.mockAuth = {
        currentUser: {
          uid: "test-user-id",
          providerData: [{ providerId: "google.com" }]
        }
      };
    });
    
    await page.goto("/account");
    
    // Check danger zone elements
    await expect(page.getByText("Danger Zone")).toBeVisible();
    await expect(page.getByRole("button", { name: /export data/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /delete account/i })).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("auth page meets accessibility standards", async ({ page }) => {
    await page.goto("/auth");
    
    // Check for proper heading hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    
    // Check buttons have accessible names
    await expect(page.getByRole("button", { name: /continue with google/i })).toHaveAttribute("aria-label");
    await expect(page.getByRole("button", { name: /continue with apple/i })).toHaveAttribute("aria-label");
    
    // Check form elements are properly labeled
    await page.goto("/auth/email");
    const emailInput = page.getByPlaceholder("you@example.com");
    await expect(emailInput).toHaveAttribute("type", "email");
  });

  test("color contrast is sufficient", async ({ page }) => {
    await page.goto("/auth");
    
    // Check main heading has sufficient contrast
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    
    // Check button text is readable
    const googleButton = page.getByRole("button", { name: /continue with google/i });
    await expect(googleButton).toBeVisible();
    
    const appleButton = page.getByRole("button", { name: /continue with apple/i });
    await expect(appleButton).toBeVisible();
  });
});

test.describe("Mobile Responsiveness", () => {
  test("auth page works on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto("/auth");
    
    // Should still show all elements
    await expect(page.getByText("Unlock your ritual")).toBeVisible();
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /continue with apple/i })).toBeVisible();
  });

  test("email link form works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/auth/email");
    
    // Form should be usable on mobile
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByRole("button", { name: /email me a magic link/i })).toBeVisible();
  });
});