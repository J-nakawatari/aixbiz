import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('診断フォームのXSS対策', async ({ page }) => {
    // 診断セクションまでスクロール
    await page.locator('#diagnosis').scrollIntoViewIfNeeded();
    
    // XSSペイロードを入力
    await page.selectOption('select[name="industry"]', '製造業');
    await page.selectOption('select[name="jobFunction"]', '生産管理');
    await page.fill('textarea[placeholder*="例"]', '<script>alert("XSS")</script>');
    
    // フォーム送信
    await page.click('button:has-text("診断を開始")');
    
    // 新しいウィンドウ/タブを待つ
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('button:has-text("診断を開始")')
    ]);
    
    // レポートページでscriptタグがエスケープされていることを確認
    const content = await newPage.content();
    expect(content).not.toContain('<script>alert("XSS")</script>');
    expect(content).toContain('&lt;script&gt;');
  });

  test('相談フォームのバリデーション', async ({ page }) => {
    // CTAセクションまでスクロール
    await page.locator('#cta').scrollIntoViewIfNeeded();
    
    // 送信ボタンが最初は無効になっていることを確認
    const submitButton = page.locator('button:has-text("AI導入の相談申し込み")');
    await expect(submitButton).toBeDisabled();
    
    // 必須項目を入力
    await page.fill('input[placeholder="株式会社aixbiz"]', 'テスト会社');
    await page.fill('input[placeholder="山田 太郎"]', 'テスト太郎');
    await page.fill('input[placeholder="your-email@example.com"]', 'test@example.com');
    await page.selectOption('select:has-text("業種")', '製造業');
    await page.selectOption('select:has-text("従業員数")', '10-50名');
    
    // チェックボックスを選択
    await page.click('label:has-text("業務効率化が必要")');
    
    // ボタンが有効になることを確認
    await expect(submitButton).toBeEnabled();
    
    // 不正なメールアドレスでバリデーションエラー
    await page.fill('input[placeholder="your-email@example.com"]', 'invalid-email');
    await page.blur('input[placeholder="your-email@example.com"]');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test('PDFダウンロード機能の動作確認', async ({ page, context }) => {
    // 診断を実行
    await page.locator('#diagnosis').scrollIntoViewIfNeeded();
    await page.selectOption('select[name="industry"]', '製造業');
    await page.selectOption('select[name="jobFunction"]', '生産管理');
    await page.fill('textarea[placeholder*="例"]', '業務効率化を図りたい');
    
    // レポート生成
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button:has-text("診断を開始")')
    ]);
    
    // PDFダウンロードボタンの存在確認
    await expect(newPage.locator('button:has-text("PDFでダウンロード")')).toBeVisible();
    
    // ダウンロードイベントを監視
    const downloadPromise = newPage.waitForEvent('download');
    await newPage.click('button:has-text("PDFでダウンロード")');
    const download = await downloadPromise;
    
    // ダウンロードファイル名の確認
    expect(download.suggestedFilename()).toMatch(/AI活用診断レポート.*\.pdf/);
  });

  test('iframe実装のセキュリティ確認', async ({ page, context }) => {
    // 環境変数でiframeモードが有効な場合のみテスト
    const useIframe = process.env.NEXT_PUBLIC_USE_IFRAME_MODE !== 'false';
    test.skip(!useIframe, 'Iframe mode is not enabled');
    
    // 診断実行
    await page.locator('#diagnosis').scrollIntoViewIfNeeded();
    await page.selectOption('select[name="industry"]', '製造業');
    await page.selectOption('select[name="jobFunction"]', '生産管理');
    
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button:has-text("診断を開始")')
    ]);
    
    // iframeの存在とsandbox属性を確認
    const iframe = await newPage.locator('iframe#report-frame');
    await expect(iframe).toBeVisible();
    
    const sandboxAttr = await iframe.getAttribute('sandbox');
    expect(sandboxAttr).toContain('allow-same-origin');
    expect(sandboxAttr).toContain('allow-scripts');
    expect(sandboxAttr).toContain('allow-forms');
  });
});

test.describe('CSRF Protection Tests', () => {
  test('CSRFトークンの動作確認', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // フォーム送信時にCSRFトークンが含まれることを確認
    await page.route('**/api/contact/submit', async (route, request) => {
      const headers = request.headers();
      
      // CSRFトークンヘッダーの存在確認
      if (process.env.ENABLE_CSRF === 'true') {
        expect(headers['x-csrf-token']).toBeTruthy();
      }
      
      await route.continue();
    });
    
    // フォーム入力と送信
    await page.locator('#cta').scrollIntoViewIfNeeded();
    await page.fill('input[placeholder="株式会社aixbiz"]', 'テスト会社');
    await page.fill('input[placeholder="山田 太郎"]', 'テスト太郎');
    await page.fill('input[placeholder="your-email@example.com"]', 'test@example.com');
    await page.selectOption('select:nth-of-type(1)', '製造業');
    await page.selectOption('select:nth-of-type(2)', '10-50名');
    await page.click('label:has-text("業務効率化が必要")');
    
    await page.click('button:has-text("AI導入の相談申し込み")');
  });
});