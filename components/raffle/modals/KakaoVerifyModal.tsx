'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { addKakaoChannel, extractChannelId } from '@/lib/kakao';

interface KakaoVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  kakaoChannelUrl: string;
}

export default function KakaoVerifyModal({
  isOpen,
  onClose,
  onVerified,
  kakaoChannelUrl
}: KakaoVerifyModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAddChannel = () => {
    const channelId = extractChannelId(kakaoChannelUrl);
    if (channelId) {
      addKakaoChannel(channelId);
    }
  };

  const handleNext = () => {
    if (isChecked) {
      onVerified();
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">카카오톡 채널 친구 추가</h2>
        <p className="text-gray-600 mb-6">
          래플 이벤트 참여를 위해 카카오톡 채널 친구 추가가 필요합니다.
        </p>

        <button
          onClick={handleAddChannel}
          className="w-full bg-yellow-400 text-black py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors mb-4"
        >
          친구 추가하기
        </button>

        <label className="flex items-center justify-center gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-sm">친구 추가를 완료했습니다</span>
        </label>

        <button
          onClick={handleNext}
          disabled={!isChecked}
          className={`w-full py-3 px-6 rounded-lg transition-colors ${
            isChecked
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음
        </button>
      </div>
    </BaseModal>
  );
}
