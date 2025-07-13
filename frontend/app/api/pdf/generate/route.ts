import { NextRequest, NextResponse } from 'next/server';

// バックエンドAPIのURL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4004';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('PDF generation request received:', body);

    // バックエンドのPDF生成APIへリクエストを転送
    const response = await fetch(`${BACKEND_API_URL}/api/pdf/generate-pdf`, {
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

    if (!response.ok) {
      console.error('Backend PDF API error:', response.status, response.statusText);
      try {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      } catch (e) {
        return NextResponse.json(
          { error: `Backend error: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }
    }

    // PDFデータを取得
    const pdfBuffer = await response.arrayBuffer();

    // PDFレスポンスを返す
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ai-report-${body.reportId || 'download'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF API proxy error:', error);
    return NextResponse.json(
      { error: 'PDF生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}