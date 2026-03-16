const { test, expect } = require('@playwright/test');

test.describe('Language Preference Feature', () => {
  const STORAGE_KEY = 'waqtsalat-lang-preference';
  
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('First Visit - Browser Language Detection', () => {
    test('should redirect to Arabic when browser language is Arabic', async ({ page, context }) => {
      // Set browser language to Arabic
      await context.setExtraHTTPHeaders({ 'Accept-Language': 'ar' });
      
      // Visit root URL
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to /ar/
      expect(page.url()).toContain('/ar/');
      
      // Check localStorage was set
      const storedLang = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      expect(storedLang).toBe('ar');
      
      // Check page is in Arabic
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe('ar');
      
      // Check RTL direction
      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');
    });

    test('should redirect to English when browser language is English', async ({ page, context }) => {
      // Set browser language to English
      await context.setExtraHTTPHeaders({ 'Accept-Language': 'en-US' });
      
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to /en/
      expect(page.url()).toContain('/en/');
      
      // Check localStorage was set
      const storedLang = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      expect(storedLang).toBe('en');
      
      // Check page is in English
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe('en');
    });

    test('should redirect to French when browser language is French', async ({ page, context }) => {
      // Set browser language to French
      await context.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR' });
      
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to /fr/
      expect(page.url()).toContain('/fr/');
      
      // Check localStorage was set
      const storedLang = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      expect(storedLang).toBe('fr');
      
      // Check page is in French
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe('fr');
    });

    test('should default to Arabic for unsupported browser languages', async ({ page, context }) => {
      // Set browser language to unsupported (German)
      await context.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE' });
      
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to /ar/ (default)
      expect(page.url()).toContain('/ar/');
      
      // Check localStorage was set to default
      const storedLang = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      expect(storedLang).toBe('ar');
    });
  });

  test.describe('Returning Visit - Stored Preference', () => {
    test('should redirect to stored Arabic preference', async ({ page }) => {
      // Set stored preference to Arabic
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.evaluate((key) => {
        localStorage.setItem(key, 'ar');
      }, STORAGE_KEY);
      
      // Visit English page with Arabic preference stored
      await page.goto('https://waqtsalat.github.io/blog/en/');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to /ar/ based on stored preference
      expect(page.url()).toContain('/ar/');
    });

    test('should redirect to stored English preference', async ({ page }) => {
      // Set stored preference to English
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.evaluate((key) => {
        localStorage.setItem(key, 'en');
      }, STORAGE_KEY);
      
      // Visit Arabic page with English preference stored
      await page.goto('https://waqtsalat.github.io/blog/ar/');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to /en/ based on stored preference
      expect(page.url()).toContain('/en/');
    });

    test('should stay on current page if already on preferred language', async ({ page }) => {
      // Set stored preference to Arabic
      await page.goto('https://waqtsalat.github.io/blog/ar/');
      await page.evaluate((key) => {
        localStorage.setItem(key, 'ar');
      }, STORAGE_KEY);
      
      // Reload the same page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should stay on /ar/ (no redirect)
      expect(page.url()).toBe('https://waqtsalat.github.io/blog/ar/');
    });
  });

  test.describe('Manual Language Switch', () => {
    test('should update stored preference when switching to English', async ({ page }) => {
      // Start with Arabic preference
      await page.goto('https://waqtsalat.github.io/blog/ar/');
      await page.evaluate((key) => {
        localStorage.setItem(key, 'ar');
      }, STORAGE_KEY);
      
      // Click English language link
      await page.click('a[href="/blog/en/"]');
      await page.waitForLoadState('networkidle');
      
      // Should be on English page
      expect(page.url()).toContain('/en/');
      
      // Check localStorage was updated
      const storedLang = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      expect(storedLang).toBe('en');
    });

    test('should update stored preference when switching to French', async ({ page }) => {
      // Start with English preference
      await page.goto('https://waqtsalat.github.io/blog/en/');
      await page.evaluate((key) => {
        localStorage.setItem(key, 'en');
      }, STORAGE_KEY);
      
      // Click French language link
      await page.click('a[href="/blog/fr/"]');
      await page.waitForLoadState('networkidle');
      
      // Should be on French page
      expect(page.url()).toContain('/fr/');
      
      // Check localStorage was updated
      const storedLang = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      expect(storedLang).toBe('fr');
    });

    test('should update stored preference when switching to Arabic', async ({ page }) => {
      // Start with English preference
      await page.goto('https://waqtsalat.github.io/blog/en/');
      await page.evaluate((key) => {
        localStorage.setItem(key, 'en');
      }, STORAGE_KEY);
      
      // Click Arabic language link
      await page.click('a[href="/blog/ar/"]');
      await page.waitForLoadState('networkidle');
      
      // Should be on Arabic page
      expect(page.url()).toContain('/ar/');
      
      // Check localStorage was updated
      const storedLang = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
      expect(storedLang).toBe('ar');
    });
  });

  test.describe('Language Switcher UI', () => {
    test('should display all language options', async ({ page }) => {
      await page.goto('https://waqtsalat.github.io/blog/ar/');
      
      // Check all language links are present
      await expect(page.locator('a[href="/blog/ar/"]')).toBeVisible();
      await expect(page.locator('a[href="/blog/en/"]')).toBeVisible();
      await expect(page.locator('a[href="/blog/fr/"]')).toBeVisible();
    });

    test('should highlight current language', async ({ page }) => {
      await page.goto('https://waqtsalat.github.io/blog/ar/');
      
      // Arabic link should have active class or be marked as current
      const arabicLink = page.locator('a[href="/blog/ar/"]');
      const hasActiveClass = await arabicLink.evaluate(el => 
        el.classList.contains('active') || el.getAttribute('aria-current') === 'true'
      );
      expect(hasActiveClass).toBe(true);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle localStorage not available gracefully', async ({ page }) => {
      // Mock localStorage to throw error
      await page.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: () => { throw new Error('localStorage disabled'); },
            setItem: () => { throw new Error('localStorage disabled'); }
          }
        });
      });
      
      // Should not crash, just use browser language
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.waitForLoadState('networkidle');
      
      // Page should still load
      expect(page.url()).toMatch(/\/(ar|en|fr)\//);
    });

    test('should handle corrupted localStorage data', async ({ page }) => {
      // Set invalid language code in localStorage
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.evaluate((key) => {
        localStorage.setItem(key, 'invalid-lang');
      }, STORAGE_KEY);
      
      // Visit root
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.waitForLoadState('networkidle');
      
      // Should fall back to browser language or default
      const url = page.url();
      expect(url).toMatch(/\/(ar|en|fr)\//);
    });

    test('should preserve URL hash during redirect', async ({ page }) => {
      // Set preference to Arabic
      await page.goto('https://waqtsalat.github.io/blog/');
      await page.evaluate((key) => {
        localStorage.setItem(key, 'ar');
      }, STORAGE_KEY);
      
      // Visit with hash
      await page.goto('https://waqtsalat.github.io/blog/en/#section1');
      await page.waitForLoadState('networkidle');
      
      // Should preserve hash in redirect
      expect(page.url()).toContain('#section1');
    });
  });
});