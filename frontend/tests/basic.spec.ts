import { test, expect } from '@playwright/test';

test('基本的な動作確認', async ({ page }) => {
  // タイムアウトを短く設定
  test.setTimeout(10000);
  
  try {
    await page.goto('/');
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/AI導入ナビゲーター/);
    
    // メインコンテンツが表示されているか
    const heroSection = page.locator('text=中小企業のための');
    await expect(heroSection).toBeVisible({ timeout: 5000 });
    
    console.log('Basic test passed');
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
});