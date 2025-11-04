import { NextRequest, NextResponse } from 'next/server';
import { saveToGoogleSheets } from '@/lib/sheets';
import type { UserData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const userData: UserData = await request.json();

    // 유효성 검사
    if (!userData.memberId || !userData.name || !userData.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Google Sheets에 저장
    const success = await saveToGoogleSheets(userData);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save to Google Sheets' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
