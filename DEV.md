# Raffle 서비스 개발 프롬프트

당신은 Next.js 풀스택 개발자입니다. Cafe24 쇼핑몰에 임베딩 가능한 래플(추첨) 이벤트 서비스를 개발해야 합니다.

## 프로젝트 목표
관리자가 이벤트 이미지를 업로드하고 설정하면 임베딩 코드가 생성되며, 이를 Cafe24 게시판에 붙여넣으면 사용자에게 인터랙티브한 래플 이벤트가 표시되는 서비스를 만드세요.

## 기술 스택
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Database: Google Sheets API (응모자 데이터 저장)
- External APIs: Cafe24 Shop API, Kakao Channel API

## 프로젝트 구조
```
raffle-service/
├── app/
│   ├── admin/
│   │   └── page.tsx                 # 관리자 이벤트 생성 페이지
│   ├── api/
│   │   ├── events/[id]/route.ts     # 이벤트 데이터 API
│   │   └── sheets/route.ts          # Google Sheets 저장 API
│   └── embed/
│       └── [id]/page.tsx            # 임베딩용 래플 앱
├── components/
│   ├── admin/
│   │   ├── EventForm.tsx
│   │   ├── ImageUploader.tsx
│   │   └── EmbedCodeGenerator.tsx
│   └── raffle/
│       ├── RaffleApp.tsx
│       ├── CountdownTimer.tsx
│       ├── ActionButtons.tsx
│       └── modals/
│           ├── SignupModal.tsx
│           ├── LoginModal.tsx
│           ├── KakaoVerifyModal.tsx
│           ├── AlreadyEnteredModal.tsx
│           └── CompleteModal.tsx
├── lib/
│   ├── cafe24.ts                    # Cafe24 API 헬퍼
│   ├── kakao.ts                     # Kakao API 헬퍼
│   └── sheets.ts                    # Google Sheets API 헬퍼
└── public/
    └── embed.js                     # Cafe24에 임베딩될 스크립트
```

---

## 개발 요구사항

### 1. 관리자 페이지 (`/admin`)

**기능:**
- 이벤트 생성 폼을 만드세요
- 다음 필드들을 포함하세요:
  - 이벤트명 (text input)
  - 배경 이미지 업로드 (file input, PNG/JPG, 최대 5MB)
  - 종료 일시 (datetime-local input)
  - 카카오톡 채널 URL (text input)
  - 버튼 위치 조정 (number input, px 단위)

**이미지 업로드 처리:**
- 클라이언트에서 이미지를 base64로 변환하여 localStorage에 저장하세요
- 또는 `/api/upload` 엔드포인트를 만들어 서버에 저장하세요

**실시간 미리보기:**
- 업로드한 이미지를 배경으로 표시하세요
- "Enter draw", "Learn more" 버튼을 오버레이하세요
- 카운트다운 타이머를 표시하세요
- 버튼 위치를 실시간으로 조정 가능하게 하세요

**임베딩 코드 생성:**
- 이벤트 생성 시 고유 ID를 생성하세요 (예: nanoid 사용)
- 다음 형식의 임베딩 코드를 생성하세요:
```html
<div class="dpromotion-area" data-id="[GENERATED_ID]"></div>
<script src="https://your-domain.com/embed.js"></script>
```
- 원클릭 복사 버튼을 추가하세요
- 사용 방법 안내를 표시하세요

**데이터 저장:**
- 이벤트 데이터를 localStorage 또는 서버 DB에 저장하세요
- 저장 구조:
```typescript
interface RaffleEvent {
  id: string;
  name: string;
  imageUrl: string; // base64 or upload URL
  endDate: string; // ISO 8601
  kakaoChannelUrl: string;
  buttonTop: number; // px
  createdAt: string;
}
```

---

### 2. 임베딩 스크립트 (`/public/embed.js`)

**역할:**
Cafe24 페이지에 삽입되어 Next.js 래플 앱을 iframe으로 로드합니다.

**구현:**
```javascript
(function() {
  'use strict';

  // 1. data-id 찾기
  const raffleDiv = document.querySelector('.dpromotion-area');
  if (!raffleDiv) return;

  const eventId = raffleDiv.getAttribute('data-id');
  if (!eventId) return;

  // 2. iframe 생성
  const iframe = document.createElement('iframe');
  iframe.src = `https://your-domain.com/embed/${eventId}`;
  iframe.style.width = '100%';
  iframe.style.height = '800px'; // 또는 auto-resize
  iframe.style.border = 'none';
  iframe.style.display = 'block';

  // 3. 삽입
  raffleDiv.appendChild(iframe);

  // 4. 높이 자동 조정 (postMessage 사용)
  window.addEventListener('message', (e) => {
    if (e.data.type === 'resize') {
      iframe.style.height = e.data.height + 'px';
    }
  });
})();
```

---

### 3. 래플 임베딩 페이지 (`/embed/[id]/page.tsx`)

**기능:**
iframe 내에서 표시될 래플 이벤트 UI를 구현하세요.

**레이아웃:**
```
┌─────────────────────────────┐
│  Brand Emblem (좌상단)      │
│  "XAVIER 9" 텍스트 (세로)   │
│                             │
│  [배경 이미지]              │
│                             │
│  [15D:02H:00M:08S]          │  ← 카운트다운
│                             │
│  ┌───────────────────┐      │
│  │  Enter draw       │      │  ← 흰색 버튼
│  └───────────────────┘      │
│  ┌───────────────────┐      │
│  │  Learn more       │      │  ← 검정 버튼
│  └───────────────────┘      │
│                             │
│  [Notice 공지사항]          │
└─────────────────────────────┘
```

**데이터 로딩:**
- useParams로 eventId를 가져오세요
- `/api/events/${eventId}`를 호출하여 이벤트 데이터를 로드하세요
- 로딩 중, 에러, 종료 상태를 처리하세요

**카운트다운 타이머:**
- 이벤트 종료 시간까지 실시간 카운트다운을 표시하세요
- 형식: `15D:02H:00M:08S`
- 1초마다 업데이트하세요
- 종료 시 "이벤트가 종료되었습니다" 메시지를 표시하세요

**iframe 높이 자동 조정:**
```typescript
useEffect(() => {
  const sendHeight = () => {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ type: 'resize', height }, '*');
  };

  sendHeight();
  window.addEventListener('resize', sendHeight);
  return () => window.removeEventListener('resize', sendHeight);
}, []);
```

---

### 4. Enter Draw 버튼 클릭 플로우

**Step 1: 로그인 체크**
```typescript
// Cafe24 로그인 확인 (iframe 내에서 parent 페이지의 쿠키 확인)
const checkCafe24Login = () => {
  // parent 페이지와 통신
  window.parent.postMessage({ type: 'checkLogin' }, '*');

  // 응답 대기
  return new Promise((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'loginStatus') {
        resolve(e.data);
        window.removeEventListener('message', handler);
      }
    };
    window.addEventListener('message', handler);
  });
};

// 비로그인 시
if (!isLoggedIn) {
  showModal('SIGNUP_REQUIRED'); // 또는 LOGIN_REQUIRED
  // 모달에서 회원가입/로그인 버튼 → parent 페이지를 리다이렉트
  return;
}
```

**Step 2: 중복 응모 체크**
```typescript
// localStorage 체크
const hasEntered = localStorage.getItem(`raffle_${eventId}_${memberId}`);

if (hasEntered) {
  showModal('ALREADY_ENTERED');
  return;
}
```

**Step 3: 카카오톡 채널 친구 확인**
```typescript
showModal('KAKAO_VERIFY');

// 모달 내용:
// - 카카오톡 채널 친구 추가 필요 안내
// - [친구 추가하기] 버튼 → Kakao.Channel.addChannel()
// - [친구 추가 완료했어요] 체크박스
// - [다음] 버튼 (체크박스 활성화 시 enabled)
```

**Step 4: Google Sheets 저장**
```typescript
const userData = {
  timestamp: new Date().toISOString(),
  memberId: memberInfo.memberId,
  name: memberInfo.name,
  email: memberInfo.email,
  phone: memberInfo.phone,
  kakaoFriend: 'Y'
};

// API 호출
const response = await fetch('/api/sheets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});

if (response.ok) {
  // localStorage에 응모 완료 표시
  localStorage.setItem(`raffle_${eventId}_${memberId}`, 'true');

  // 완료 모달
  showModal('ENTRY_COMPLETE');
}
```

---

### 5. API 라우트

#### `/api/events/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;

  // localStorage 또는 DB에서 이벤트 조회
  const eventData = getEventFromStorage(eventId);

  if (!eventData) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(eventData);
}
```

#### `/api/sheets/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  const userData = await request.json();

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
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          userData.timestamp,
          userData.memberId,
          userData.name,
          userData.email,
          userData.phone,
          userData.kakaoFriend
        ]]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Google Sheets 저장 실패:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
```

---

### 6. 모달 컴포넌트

다음 모달들을 구현하세요:

**SignupModal.tsx**
```typescript
// 내용: "응모하려면 회원가입이 필요합니다"
// 버튼: [회원가입하기] [로그인하기]
// 회원가입 버튼 클릭 → parent.location.href로 Cafe24 회원가입 페이지 이동
```

**LoginModal.tsx**
```typescript
// 내용: "응모하려면 로그인이 필요합니다"
// 버튼: [로그인하기]
```

**KakaoVerifyModal.tsx**
```typescript
// 내용: "카카오톡 채널 친구 추가가 필요합니다"
// 버튼: [친구 추가하기]
// 체크박스: [친구 추가를 완료했습니다]
// 버튼: [다음] (체크박스 활성화 시 enabled)
```

**AlreadyEnteredModal.tsx**
```typescript
// 내용: "이미 응모하셨습니다"
// 버튼: [확인]
```

**CompleteModal.tsx**
```typescript
// 내용: "응모 완료! 당첨자 발표를 기다려주세요"
// 버튼: [확인]
```

모든 모달은 중앙 배치, 반투명 검정 배경, 애니메이션 적용하세요.

---

### 7. Cafe24 API 연동 헬퍼 (`/lib/cafe24.ts`)
```typescript
// iframe 내에서 parent 페이지와 통신하여 Cafe24 정보 확인

export const checkCafe24Login = (): Promise<{
  isLoggedIn: boolean;
  memberId: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
}> => {
  return new Promise((resolve) => {
    // parent에게 로그인 상태 요청
    window.parent.postMessage({ type: 'getCafe24Info' }, '*');

    const handler = (e: MessageEvent) => {
      if (e.data.type === 'cafe24Info') {
        resolve(e.data.info);
        window.removeEventListener('message', handler);
      }
    };

    window.addEventListener('message', handler);

    // 타임아웃 (3초)
    setTimeout(() => {
      window.removeEventListener('message', handler);
      resolve({
        isLoggedIn: false,
        memberId: null,
        name: null,
        email: null,
        phone: null
      });
    }, 3000);
  });
};

export const redirectToLogin = () => {
  const returnUrl = encodeURIComponent(window.parent.location.href);
  window.parent.location.href = `/member/login.html?return_url=${returnUrl}`;
};

export const redirectToSignup = () => {
  const returnUrl = encodeURIComponent(window.parent.location.href);
  window.parent.location.href = `/member/join.html?return_url=${returnUrl}`;
};
```

**주의:** iframe 내에서는 parent 페이지의 쿠키에 직접 접근할 수 없습니다.
따라서 embed.js에 Cafe24 정보를 확인하는 로직을 추가하고, postMessage로 iframe에 전달하세요.

**수정된 embed.js:**
```javascript
// embed.js에 추가
window.addEventListener('message', (e) => {
  if (e.data.type === 'getCafe24Info') {
    // Cafe24 전역 객체 확인
    const cafe24Info = {
      isLoggedIn: typeof CAFE24 !== 'undefined' && !!CAFE24.MEMBER_ID,
      memberId: CAFE24?.MEMBER_ID || null,
      name: CAFE24?.MEMBER_NAME || null,
      email: CAFE24?.MEMBER_EMAIL || null,
      phone: CAFE24?.MEMBER_PHONE || null
    };

    iframe.contentWindow.postMessage({
      type: 'cafe24Info',
      info: cafe24Info
    }, '*');
  }
});
```

---

### 8. Kakao Channel API 연동 헬퍼 (`/lib/kakao.ts`)
```typescript
declare global {
  interface Window {
    Kakao: any;
  }
}

export const initKakao = (jsKey: string) => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(jsKey);
  }
};

export const addKakaoChannel = (channelPublicId: string) => {
  if (window.Kakao) {
    window.Kakao.Channel.addChannel({
      channelPublicId: channelPublicId
    });
  }
};

export const extractChannelId = (url: string): string | null => {
  // URL 형식: http://pf.kakao.com/_xabcdef
  const match = url.match(/_[a-zA-Z0-9]+/);
  return match ? match[0] : null;
};
```

**Kakao SDK 로드:**
`/embed/[id]/page.tsx`의 head에 추가하세요:
```typescript
<Script
  src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
  strategy="beforeInteractive"
/>
```

---

### 9. 스타일링

**Tailwind CSS 설정:**
```typescript
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'raffle-bg': '#CCCCCC',
        'raffle-black': '#000000',
        'raffle-white': '#FFFFFF',
      },
    },
  },
};
```

**반응형 디자인:**
- 모바일 (< 768px): 세로 레이아웃, 버튼 full-width
- 데스크톱 (≥ 768px): 참고 이미지 레이아웃
- 최대 너비: 430px (중앙 정렬)

**버튼 스타일:**
- Enter draw: 흰색 배경, 검정 텍스트, hover 시 약간 어두워짐
- Learn more: 검정 배경, 흰색 텍스트, hover 시 약간 밝아짐
- 둘 다 transition 0.3s, hover 시 translateY(-2px)

---

### 10. 환경 변수 설정

`.env.local` 파일을 생성하고 다음을 추가하세요:
```
# Google Sheets API
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_spreadsheet_id

# Kakao API
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_javascript_key

# 기타
NEXT_PUBLIC_DOMAIN=https://your-domain.com
```

---

### 11. 배포 및 빌드

**빌드 명령:**
```bash
npm run build
```

**배포:**
- Vercel, Netlify 등에 배포하세요
- `/public/embed.js`가 `https://your-domain.com/embed.js`로 접근 가능하게 하세요

---

### 12. 테스트 체크리스트

개발 완료 후 다음을 테스트하세요:

**관리자 페이지:**
- [ ] 이미지 업로드 및 미리보기
- [ ] 이벤트 생성 및 저장
- [ ] 임베딩 코드 생성 및 복사

**임베딩 스크립트:**
- [ ] Cafe24 페이지에 삽입 시 정상 로드
- [ ] iframe 높이 자동 조정

**래플 앱:**
- [ ] 배경 이미지 표시
- [ ] 카운트다운 타이머 작동
- [ ] 버튼 클릭 반응
- [ ] 로그인/회원가입 플로우
- [ ] 카카오 채널 친구 추가 플로우
- [ ] 중복 응모 차단
- [ ] Google Sheets 저장

**반응형:**
- [ ] 모바일, 태블릿, 데스크톱에서 정상 표시

---

## 개발 시작

위 요구사항에 따라 Next.js 프로젝트를 생성하고 단계별로 개발을 진행하세요.
모든 컴포넌트는 TypeScript로 작성하고, 타입 안정성을 유지하세요.
에러 처리를 철저히 하고, 사용자에게 명확한 피드백을 제공하세요.

개발을 시작하겠습니까? 어떤 부분부터 시작할지 알려주세요.
