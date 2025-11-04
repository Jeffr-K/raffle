import { google } from 'googleapis';
import type { UserData } from '@/types';

export async function saveToGoogleSheets(userData: UserData): Promise<boolean> {
  try {
    // Google Sheets API 인증
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 데이터 추가
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          userData.timestamp,
          userData.eventId || '',
          userData.memberId,
          userData.name,
          userData.email,
          userData.phone,
          userData.kakaoFriend,
        ]],
      },
    });

    return true;
  } catch (error) {
    console.error('Google Sheets 저장 실패:', error);
    return false;
  }
}

// 헤더 행 초기화 함수
export async function initializeSheet(): Promise<boolean> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 헤더 행 추가
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A1:G1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          'Timestamp',
          'Event ID',
          'Member ID',
          'Name',
          'Email',
          'Phone',
          'Kakao Friend',
        ]],
      },
    });

    return true;
  } catch (error) {
    console.error('Sheet 초기화 실패:', error);
    return false;
  }
}
