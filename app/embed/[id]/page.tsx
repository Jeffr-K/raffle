'use client';

import { use, useEffect, useState } from 'react';
import Script from 'next/script';
import CountdownTimer from '@/components/raffle/CountdownTimer';
import ActionButtons from '@/components/raffle/ActionButtons';
import SignupModal from '@/components/raffle/modals/SignupModal';
import LoginModal from '@/components/raffle/modals/LoginModal';
import KakaoVerifyModal from '@/components/raffle/modals/KakaoVerifyModal';
import AlreadyEnteredModal from '@/components/raffle/modals/AlreadyEnteredModal';
import CompleteModal from '@/components/raffle/modals/CompleteModal';
import { checkCafe24Login, hasAlreadyEntered, markAsEntered } from '@/lib/cafe24';
import { initKakao } from '@/lib/kakao';
import type { RaffleEvent, ModalType } from '@/types';

export default function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const [event, setEvent] = useState<RaffleEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);

  // 이벤트 데이터 로드
  useEffect(() => {
    const loadEvent = () => {
      try {
        const eventData = localStorage.getItem(`event_${eventId}`);
        if (!eventData) {
          setError('이벤트를 찾을 수 없습니다.');
          setLoading(false);
          return;
        }

        const parsedEvent: RaffleEvent = JSON.parse(eventData);
        setEvent(parsedEvent);
        setLoading(false);

        // 종료 여부 확인
        if (new Date(parsedEvent.endDate) < new Date()) {
          setError('이벤트가 종료되었습니다.');
        }
      } catch (err) {
        setError('이벤트 데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  // iframe 높이 자동 조정
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'resize', height }, '*');
    };

    sendHeight();
    window.addEventListener('resize', sendHeight);

    // MutationObserver로 DOM 변경 감지
    const observer = new MutationObserver(sendHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    return () => {
      window.removeEventListener('resize', sendHeight);
      observer.disconnect();
    };
  }, []);

  // Kakao SDK 초기화
  const handleKakaoLoad = () => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (kakaoKey) {
      initKakao(kakaoKey);
    }
  };

  // Enter Draw 버튼 클릭 핸들러
  const handleEnterDraw = async () => {
    if (!event) return;

    // Step 1: 로그인 체크
    const cafe24Info = await checkCafe24Login();

    if (!cafe24Info.isLoggedIn) {
      setModalType('SIGNUP_REQUIRED');
      return;
    }

    // Step 2: 중복 응모 체크
    if (cafe24Info.memberId && hasAlreadyEntered(eventId, cafe24Info.memberId)) {
      setModalType('ALREADY_ENTERED');
      return;
    }

    // Step 3: 카카오톡 채널 친구 확인
    setModalType('KAKAO_VERIFY');
  };

  // 카카오 인증 완료 후 처리
  const handleKakaoVerified = async () => {
    const cafe24Info = await checkCafe24Login();

    if (!cafe24Info.memberId) {
      alert('회원 정보를 가져올 수 없습니다.');
      return;
    }

    // Step 4: Google Sheets 저장
    try {
      const userData = {
        timestamp: new Date().toISOString(),
        eventId: eventId,
        memberId: cafe24Info.memberId,
        name: cafe24Info.name || '',
        email: cafe24Info.email || '',
        phone: cafe24Info.phone || '',
        kakaoFriend: 'Y' as const,
      };

      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // localStorage에 응모 완료 표시
        markAsEntered(eventId, cafe24Info.memberId);

        // 완료 모달 표시
        setModalType('ENTRY_COMPLETE');
      } else {
        alert('응모 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('응모 오류:', err);
      alert('응모 처리 중 오류가 발생했습니다.');
    }
  };

  // Learn More 버튼 클릭 핸들러
  const handleLearnMore = () => {
    // 상품 페이지 또는 상세 정보 페이지로 이동
    // 실제 구현 시 event 데이터에 URL을 추가하거나 별도 처리
    alert('Learn More 페이지로 이동합니다.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">로딩 중...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">{error || '오류가 발생했습니다.'}</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={handleKakaoLoad}
      />

      <div className="relative w-full max-w-[430px] mx-auto bg-raffle-bg min-h-screen">
        {/* 배경 이미지 */}
        <div className="relative">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-auto"
          />

          {/* 오버레이 컨텐츠 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            {/* 브랜드 엠블럼 (좌상단) */}
            <div className="absolute top-4 left-4 text-white font-bold text-sm">
              XAVIER 9
            </div>

            {/* 중앙 컨텐츠 */}
            <div className="w-full space-y-6">
              {/* 카운트다운 타이머 */}
              <CountdownTimer endDate={event.endDate} />

              {/* 액션 버튼들 */}
              <ActionButtons
                onEnterDraw={handleEnterDraw}
                onLearnMore={handleLearnMore}
                buttonTop={event.buttonTop}
              />
            </div>
          </div>
        </div>

        {/* Notice 공지사항 */}
        <div className="bg-white p-6 text-sm text-gray-600">
          <h3 className="font-bold mb-2">Notice</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>응모 기간: 이벤트 종료 시까지</li>
            <li>당첨자 발표: 이벤트 종료 후 개별 연락</li>
            <li>중복 응모는 불가능합니다</li>
            <li>카카오톡 채널 친구 추가가 필요합니다</li>
          </ul>
        </div>

        {/* 모달들 */}
        <SignupModal
          isOpen={modalType === 'SIGNUP_REQUIRED'}
          onClose={() => setModalType(null)}
        />
        <LoginModal
          isOpen={modalType === 'LOGIN_REQUIRED'}
          onClose={() => setModalType(null)}
        />
        <KakaoVerifyModal
          isOpen={modalType === 'KAKAO_VERIFY'}
          onClose={() => setModalType(null)}
          onVerified={handleKakaoVerified}
          kakaoChannelUrl={event.kakaoChannelUrl}
        />
        <AlreadyEnteredModal
          isOpen={modalType === 'ALREADY_ENTERED'}
          onClose={() => setModalType(null)}
        />
        <CompleteModal
          isOpen={modalType === 'ENTRY_COMPLETE'}
          onClose={() => setModalType(null)}
        />
      </div>
    </>
  );
}
