import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4004';

export async function GET(request: NextRequest) {
  try {
    // バックエンドからCSRFトークンを取得
    const response = await fetch(`${BACKEND_URL}/api/csrf/token`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to get CSRF token' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // レスポンスにクッキーを設定
    const res = NextResponse.json(data);
    
    // バックエンドから受け取ったSet-Cookieヘッダーを転送
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.headers.set('set-cookie', setCookie);
    }

    return res;
  } catch (error) {
    console.error('CSRF token proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}