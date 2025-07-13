import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

interface PDFGenerationOptions {
  html: string;
  reportId: string;
}

// セキュリティ設定
const PDF_GENERATION_TIMEOUT = 30000; // 30秒のタイムアウト
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB制限
const TEMP_DIR = path.join(os.tmpdir(), 'aixbiz-pdf');

// 一時ディレクトリの作成
async function ensureTempDir() {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
}

// HTMLの安全性チェック
function sanitizeHtml(html: string): string {
  // スクリプトタグの除去
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  let sanitized = html.replace(scriptRegex, '');
  
  // 危険な属性の除去
  const dangerousAttrs = ['onerror', 'onload', 'onclick', 'onmouseover'];
  dangerousAttrs.forEach(attr => {
    const regex = new RegExp(`\\s*${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  return sanitized;
}

export async function generatePDF(options: PDFGenerationOptions): Promise<Buffer> {
  let browser;
  let tempFilePath: string | null = null;
  
  try {
    await ensureTempDir();
    
    // 安全なHTMLに変換
    const safeHtml = sanitizeHtml(options.html);
    
    // Puppeteerの起動（セキュアな設定）
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials'
      ],
      timeout: PDF_GENERATION_TIMEOUT
    });
    
    const page = await browser.newPage();
    
    // タイムアウト設定
    page.setDefaultTimeout(PDF_GENERATION_TIMEOUT);
    
    // JavaScriptを無効化（セキュリティ対策）
    await page.setJavaScriptEnabled(false);
    
    // HTMLを設定
    await page.setContent(safeHtml, {
      waitUntil: 'networkidle0',
      timeout: PDF_GENERATION_TIMEOUT
    });
    
    // フォントの読み込みを確実に待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // PDFオプション
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '5mm',
        right: '10mm',
        bottom: '5mm',
        left: '10mm'
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });
    
    // ファイルサイズチェック
    if (pdfBuffer.length > MAX_PDF_SIZE) {
      throw new Error('生成されたPDFが最大サイズを超えています');
    }
    
    return Buffer.from(pdfBuffer);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('PDF生成中にエラーが発生しました');
  } finally {
    // クリーンアップ
    if (browser) {
      await browser.close();
    }
    
    // 一時ファイルの削除
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error('Temp file cleanup error:', err);
      }
    }
  }
}

// 古い一時ファイルのクリーンアップ（1時間以上前のファイル）
export async function cleanupOldTempFiles() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > ONE_HOUR) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}