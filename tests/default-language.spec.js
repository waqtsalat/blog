const { test, expect } = require('@playwright/test');

test.describe('Default Language Tests', () => {
  test('hugo.toml should have Arabic as default language', async () => {
    // Read the hugo.toml file
    const fs = require('fs');
    const path = require('path');
    const hugoConfig = fs.readFileSync(
      path.join(__dirname, '../hugo.toml'), 
      'utf-8'
    );
    
    // Check that defaultContentLanguage is set to "ar"
    expect(hugoConfig).toContain('defaultContentLanguage = "ar"');
    
    // Check that Arabic has weight = 1 (highest priority)
    const arConfig = hugoConfig.match(/\[languages\.ar\][\s\S]*?weight = (\d+)/);
    expect(arConfig).not.toBeNull();
    expect(arConfig[1]).toBe('1');
    
    // Check that English has weight = 2 (secondary)
    const enConfig = hugoConfig.match(/\[languages\.en\][\s\S]*?weight = (\d+)/);
    expect(enConfig).not.toBeNull();
    expect(enConfig[1]).toBe('2');
    
    console.log('✅ Arabic is correctly set as default language with weight=1');
  });
  
  test('Arabic language configuration should have RTL direction', async () => {
    const fs = require('fs');
    const path = require('path');
    const hugoConfig = fs.readFileSync(
      path.join(__dirname, '../hugo.toml'), 
      'utf-8'
    );
    
    // Check that Arabic has RTL direction
    const arSection = hugoConfig.match(/\[languages\.ar\][\s\S]*?(?=\[languages\.|\[menus\]|\[taxonomies\]|\[outputs\]|\[markup\]|\[minify\]|$)/);
    expect(arSection[0]).toContain('languageDirection = "rtl"');
    
    console.log('✅ Arabic language has RTL direction configured');
  });
});
