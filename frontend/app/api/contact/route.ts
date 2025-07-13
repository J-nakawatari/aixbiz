import { NextRequest, NextResponse } from 'next/server';

// 本番環境では内部ポート、開発環境ではローカルポートを使用
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:4004'  // 本番環境での内部接続
  : 'http://localhost:4004'; // 開発環境

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // CSRFトークンを取得
    const csrfResponse = await fetch(`${BACKEND_URL}/api/csrf/token`, {
      method: 'GET',
    });
    
    if (!csrfResponse.ok) {
      console.error('Failed to get CSRF token');
      return NextResponse.json(
        { success: false, message: 'セキュリティトークンの取得に失敗しました' },
        { status: 500 }
      );
    }

    const csrfData = await csrfResponse.json();
    const cookieHeader = csrfResponse.headers.get('set-cookie');

    const response = await fetch(`${BACKEND_URL}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfData.token,
        ...(cookieHeader && { 'Cookie': cookieHeader })
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response from backend:', text);
      return NextResponse.json(
        { success: false, message: 'バックエンドから無効なレスポンスが返されました' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Contact proxy error:', error);
    console.error('Backend URL:', BACKEND_URL);
    return NextResponse.json(
      { success: false, message: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}