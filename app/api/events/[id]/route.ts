import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: any } = await context.params;

    // 서버에서는 localStorage를 사용할 수 없으므로
    // 실제로는 DB나 파일 시스템을 사용해야 함
    // 여기서는 클라이언트에서 fetch할 때 localStorage를 사용하도록 안내

    return NextResponse.json(
      {
        error:
          "This endpoint should be called from client-side with localStorage data",
        message:
          "Event data is stored in localStorage. Access it from the client.",
      },
      { status: 501 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}

// 클라이언트에서 직접 localStorage를 사용하는 것이 더 효율적입니다
// 또는 데이터베이스를 연동하여 서버에서 관리할 수 있습니다
