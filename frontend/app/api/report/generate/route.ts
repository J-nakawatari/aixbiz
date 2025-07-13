import { NextRequest, NextResponse } from 'next/server';

// バックエンドAPIのURL（環境変数または内部通信）
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4004';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バックエンドAPIへリクエストを転送
    const response = await fetch(`${BACKEND_API_URL}/api/report/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // クライアントのIPアドレスを転送（レート制限用）
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || 
                           request.headers.get('x-real-ip') || 
                           '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // バックエンドのレスポンスをそのまま返す
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}