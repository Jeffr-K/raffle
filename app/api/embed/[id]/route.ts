import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await context.params;

    // 클라이언트 측에서 localStorage를 사용하므로
    // 여기서는 기본 구조만 반환하고, 실제 데이터는 클라이언트에서 처리
    // 또는 서버 DB를 사용한다면 여기서 조회

    // CORS 헤더 추가 (Cafe24에서 접근 가능하도록)
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 임시로 더미 데이터 반환 (실제로는 DB에서 가져와야 함)
    // 프로덕션에서는 localStorage 대신 DB 사용 권장
    return NextResponse.json(
      {
        id: eventId,
        name: 'Sample Event',
        imageUrl: '/sample-image.jpg',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        kakaoChannelUrl: 'http://pf.kakao.com/_example',
        buttonTop: 0,
      },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
