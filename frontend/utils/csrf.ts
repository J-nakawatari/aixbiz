"use client";

// CSRFトークン管理
class CSRFManager {
  private token: string | null = null;

  // トークンの初期化
  async initialize(): Promise<void> {
    // 既存のトークンをクッキーから取得
    const existingToken = this.getTokenFromCookie();
    if (existingToken) {
      this.token = existingToken;
      return;
    }

    // 新しいトークンを生成
    try {
      const response = await fetch('/api/csrf/token', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
      } else {
        console.warn('Failed to initialize CSRF token');
      }
    } catch (error) {
      console.warn('CSRF token initialization error:', error);
    }
  }

  // クッキーからトークンを取得
  private getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf-token') {
        return value;
      }
    }
    return null;
  }

  // トークンを取得
  getToken(): string | null {
    if (!this.token) {
      this.token = this.getTokenFromCookie();
    }
    return this.token;
  }

  // リクエストヘッダーにトークンを追加
  getHeaders(): Record<string, string> {
    const token = this.getToken();
    if (token) {
      return {
        'X-CSRF-Token': token
      };
    }
    return {};
  }

  // フェッチラッパー（CSRFトークン自動付与）
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    // CSRFが無効の場合は通常のfetch
    if (process.env.NEXT_PUBLIC_ENABLE_CSRF === 'false') {
      return fetch(url, options);
    }

    // GETリクエストの場合はトークン不要
    if (!options.method || options.method.toUpperCase() === 'GET') {
      return fetch(url, options);
    }

    // トークンがない場合は初期化
    if (!this.token) {
      await this.initialize();
    }

    // ヘッダーにトークンを追加
    const headers = {
      ...options.headers,
      ...this.getHeaders()
    };

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include' // クッキーを含める
    });
  }
}

// シングルトンインスタンス
export const csrfManager = new CSRFManager();

// 初期化（アプリ起動時に呼び出す）
export const initializeCSRF = async () => {
  if (process.env.NEXT_PUBLIC_ENABLE_CSRF !== 'false') {
    await csrfManager.initialize();
  }
};