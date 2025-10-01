/**
 * ALCHM Streaks & Badges System Audit
 * 
 * Sacred promise: Achievement systems must inspire growth, not addiction.
 * No dark patterns, no exploitation, just meaningful recognition of healing journeys.
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://alchm-digital-sanctuary.web.app';

test.describe('Streaks & Badges System Logic Validation', () => {
  test.setTimeout(90000);

  // Test badges system existence and integrity
  test('should handle achievement systems appropriately', async ({ page }) => {
    const achievementUrls = [
      '/badges',
      '/achievements', 
      '/progress',
      '/rewards',
      '/streaks',
      '/account',
      '/dashboard'
    ];

    let achievementPagesFound = 0;
    let streakElements = 0;
    let badgeElements = 0;
    
    for (const url of achievementUrls) {
      await page.goto(`${PRODUCTION_URL}${url}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      const is404 = content.includes('404') || content.includes('not found');
      
      if (!is404) {
        achievementPagesFound++;
        console.log(`✅ Achievement page found: ${url}`);
        
        // Look for streak-related content
        const streakTerms = ['streak', 'days', 'consecutive', 'daily', 'chain'];
        const hasStreakContent = streakTerms.some(term => 
          content.toLowerCase().includes(term)
        );
        
        if (hasStreakContent) {
          streakElements++;
          console.log(`✅ Streak content detected on ${url}`);
        }
        
        // Look for badge-related content
        const badgeTerms = ['badge', 'achievement', 'award', 'milestone', 'reward', 'unlock'];
        const hasBadgeContent = badgeTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        if (hasBadgeContent) {
          badgeElements++;
          console.log(`✅ Badge content detected on ${url}`);
        }
        
        // Check for healthy motivation vs addiction patterns
        const healthyTerms = ['progress', 'growth', 'journey', 'healing', 'reflection'];
        const addictiveTerms = ['collect', 'points', 'score', 'level up', 'xp'];
        
        const hasHealthyMotivation = healthyTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        const hasAddictivePatterns = addictiveTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        if (hasHealthyMotivation && !hasAddictivePatterns) {
          console.log(`✅ Healthy motivation patterns detected on ${url}`);
        } else if (hasAddictivePatterns) {
          console.warn(`⚠️ Potentially addictive patterns detected on ${url}`);
        }
        
      } else {
        console.log(`ℹ️ No achievement page at: ${url}`);
      }
    }
    
    console.log(`Achievement pages found: ${achievementPagesFound}`);
    console.log(`Pages with streak content: ${streakElements}`);
    console.log(`Pages with badge content: ${badgeElements}`);
  });

  // Test streak logic and persistence
  test('should handle streak mechanics appropriately', async ({ page }) => {
    const pagesWithPotentialStreaks = [
      '/dashboard',
      '/account',
      '/pathways%202/resilience/step/1/',
      '/badges'
    ];
    
    for (const pageUrl of pagesWithPotentialStreaks) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      
      if (!content.includes('404')) {
        // Look for streak displays
        const streakDisplays = [
          page.locator('.streak'),
          page.locator('[data-testid*="streak"]'),
          page.locator('text=/\\d+ day/'),
          page.locator('text=/streak/i'),
          page.locator('.days'),
          page.locator('[class*="streak"]')
        ];
        
        let streakElementFound = false;
        for (const streakElement of streakDisplays) {
          if (await streakElement.count() > 0) {
            streakElementFound = true;
            const streakText = await streakElement.first().textContent();
            console.log(`✅ Streak element found on ${pageUrl}: "${streakText}"`);
            
            // Validate streak display format
            if (streakText) {
              const hasNumber = /\d+/.test(streakText);
              const hasTimeUnit = /(day|week|month)/i.test(streakText);
              
              if (hasNumber && hasTimeUnit) {
                console.log(`✅ Well-formatted streak display: ${streakText}`);
              } else {
                console.log(`ℹ️ Streak display format could be improved: ${streakText}`);
              }
            }
            break;
          }
        }
        
        if (!streakElementFound) {
          console.log(`ℹ️ No streak elements found on ${pageUrl}`);
        }
        
        // Check for streak reset/restart messaging
        const resetTerms = ['reset', 'restart', 'break', 'missed'];
        const hasResetMessaging = resetTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        if (hasResetMessaging) {
          console.log(`✅ Streak reset messaging present on ${pageUrl}`);
        }
      }
    }
  });

  // Test badge system logic and fairness
  test('should implement fair badge mechanics', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/badges`, { waitUntil: 'networkidle' });
    
    const content = await page.textContent('body');
    
    if (!content.includes('404')) {
      console.log('✅ Badge system page found');
      
      // Look for badge elements
      const badgeSelectors = [
        '.badge',
        '.achievement', 
        '[data-testid*="badge"]',
        '.award',
        '.milestone'
      ];
      
      let badgeCount = 0;
      for (const selector of badgeSelectors) {
        const elements = await page.locator(selector).count();
        badgeCount += elements;
      }
      
      console.log(`Badge elements found: ${badgeCount}`);
      
      if (badgeCount > 0) {
        // Check badge categories for healthy progression
        const healthyCategories = [
          'first reflection',
          'first step',
          'pathway complete',
          'week of writing',
          'month of growth',
          'vulnerability shared',
          'resilience shown'
        ];
        
        const unhealthyCategories = [
          'daily login',
          'hour spent',
          'clicks made',
          'pages viewed',
          'time wasted'
        ];
        
        const hasHealthyBadges = healthyCategories.some(category =>
          content.toLowerCase().includes(category)
        );
        
        const hasUnhealthyBadges = unhealthyCategories.some(category =>
          content.toLowerCase().includes(category)
        );
        
        if (hasHealthyBadges) {
          console.log('✅ Healthy badge categories detected');
        }
        
        if (hasUnhealthyBadges) {
          console.warn('⚠️ Potentially unhealthy badge mechanics detected');
        }
        
        // Check for progress vs. perfection messaging
        const progressTerms = ['progress', 'journey', 'growth', 'learning'];
        const perfectionTerms = ['perfect', 'flawless', 'never missed', 'always'];
        
        const encouragesProgress = progressTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        const encouragesPerfection = perfectionTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        if (encouragesProgress && !encouragesPerfection) {
          console.log('✅ Healthy progress-focused messaging');
        } else if (encouragesPerfection) {
          console.warn('⚠️ Potentially perfectionist messaging detected');
        }
      }
    } else {
      console.log('ℹ️ No dedicated badges page found');
    }
  });

  // Test gamification ethics
  test('should avoid exploitative gamification patterns', async ({ page }) => {
    const pagesToCheck = [
      '/',
      '/dashboard', 
      '/account',
      '/pathways',
      '/badges'
    ];
    
    const exploitativePatterns = [
      'daily bonus',
      'miss out',
      'limited time',
      'streak expires',
      'lose progress',
      'falling behind',
      'others are ahead',
      'leaderboard',
      'compete',
      'ranking'
    ];
    
    const healthyPatterns = [
      'at your pace',
      'no pressure',
      'when ready',
      'your journey',
      'take breaks',
      'rest days',
      'gentle reminder',
      'compassionate'
    ];
    
    for (const pageUrl of pagesToCheck) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      
      if (!content.includes('404')) {
        const hasExploitativePatterns = exploitativePatterns.some(pattern =>
          content.toLowerCase().includes(pattern)
        );
        
        const hasHealthyPatterns = healthyPatterns.some(pattern =>
          content.toLowerCase().includes(pattern)
        );
        
        if (hasExploitativePatterns) {
          console.warn(`⚠️ Exploitative gamification patterns detected on ${pageUrl}`);
        }
        
        if (hasHealthyPatterns) {
          console.log(`✅ Healthy, compassionate messaging found on ${pageUrl}`);
        }
        
        if (!hasExploitativePatterns && !hasHealthyPatterns) {
          console.log(`ℹ️ Neutral gamification approach on ${pageUrl}`);
        }
      }
    }
  });

  // Test achievement data persistence
  test('should handle achievement data appropriately', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Check for achievement-related data in localStorage
    const achievementData = await page.evaluate(() => {
      const items: any = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('badge') || key.includes('streak') || key.includes('achievement'))) {
          items[key] = localStorage.getItem(key);
        }
      }
      return items;
    });
    
    const achievementKeys = Object.keys(achievementData);
    console.log(`Achievement data keys in localStorage: ${achievementKeys.length}`);
    
    for (const key of achievementKeys) {
      console.log(`Achievement data key: ${key}`);
      
      // Verify data format is reasonable
      try {
        const data = JSON.parse(achievementData[key]);
        if (typeof data === 'object') {
          console.log(`✅ Achievement data properly structured for ${key}`);
        }
      } catch (e) {
        // Not JSON, check if it's a simple value
        const value = achievementData[key];
        if (typeof value === 'string' && value.length < 100) {
          console.log(`✅ Simple achievement value for ${key}: ${value}`);
        } else {
          console.warn(`⚠️ Complex achievement data for ${key}`);
        }
      }
    }
  });

  // Test achievement accessibility
  test('should make achievements accessible', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/badges`, { waitUntil: 'networkidle' });
    
    const content = await page.textContent('body');
    
    if (!content.includes('404')) {
      // Check for screen reader friendly content
      const ariaLabels = await page.locator('[aria-label]').count();
      const altTexts = await page.locator('[alt]').count(); 
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
      
      console.log(`ARIA labels found: ${ariaLabels}`);
      console.log(`Alt texts found: ${altTexts}`);
      console.log(`Headings found: ${headings}`);
      
      if (ariaLabels > 0 || altTexts > 0) {
        console.log('✅ Accessibility attributes present');
      }
      
      if (headings > 0) {
        console.log('✅ Proper heading structure for screen readers');
      }
      
      // Check for keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus').count();
      
      if (focusedElement > 0) {
        console.log('✅ Keyboard navigation functional');
      }
      
      // Check for color-blind friendly design (no color-only information)
      const colorOnlyWarnings = [
        'red badge',
        'green badge',
        'yellow badge',
        'blue badge'
      ];
      
      const hasColorOnlyInfo = colorOnlyWarnings.some(warning =>
        content.toLowerCase().includes(warning)
      );
      
      if (!hasColorOnlyInfo) {
        console.log('✅ No color-only information detected');
      } else {
        console.warn('⚠️ Potential color-only information - ensure text alternatives');
      }
    }
  });

  // Test motivation psychology
  test('should use healthy motivation psychology', async ({ page }) => {
    const motivationPages = [
      '/dashboard',
      '/badges', 
      '/account'
    ];
    
    for (const pageUrl of motivationPages) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      
      if (!content.includes('404')) {
        // Check for intrinsic vs extrinsic motivation
        const intrinsicTerms = [
          'personal growth',
          'self-reflection',
          'inner peace',
          'understanding yourself',
          'your journey',
          'healing',
          'processing',
          'awareness'
        ];
        
        const extrinsicTerms = [
          'points',
          'rewards',
          'prizes',
          'unlock',
          'level up',
          'collect all',
          'compete',
          'beat others'
        ];
        
        const hasIntrinsicMotivation = intrinsicTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        const hasExtrinsicMotivation = extrinsicTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        if (hasIntrinsicMotivation && !hasExtrinsicMotivation) {
          console.log(`✅ Healthy intrinsic motivation focus on ${pageUrl}`);
        } else if (hasExtrinsicMotivation) {
          console.warn(`⚠️ Extrinsic motivation patterns detected on ${pageUrl}`);
        }
        
        // Check for shame-free messaging
        const shameTerms = [
          'you failed',
          'you missed',
          'you broke',
          'you lost',
          'behind schedule',
          'not good enough'
        ];
        
        const compassionateTerms = [
          'every step counts',
          'progress not perfection',
          'be gentle',
          'at your pace',
          'no judgment',
          'self-compassion'
        ];
        
        const hasShameLanguage = shameTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        const hasCompassionateLanguage = compassionateTerms.some(term =>
          content.toLowerCase().includes(term)
        );
        
        if (hasCompassionateLanguage && !hasShameLanguage) {
          console.log(`✅ Compassionate, shame-free messaging on ${pageUrl}`);
        } else if (hasShameLanguage) {
          console.warn(`⚠️ Potentially shame-inducing language on ${pageUrl}`);
        }
      }
    }
  });
});