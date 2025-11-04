'use client';

import BaseModal from './BaseModal';

interface AlreadyEnteredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlreadyEnteredModal({ isOpen, onClose }: AlreadyEnteredModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">이미 응모하셨습니다</h2>
        <p className="text-gray-600 mb-6">
          이미 이 래플 이벤트에 응모하셨습니다.<br />
          당첨자 발표를 기다려주세요!
        </p>
        <button
          onClick={onClose}
          className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}
