'use client';

import BaseModal from './BaseModal';
import { redirectToLogin } from '@/lib/cafe24';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="text-gray-600 mb-6">
          래플 이벤트에 응모하려면 먼저 로그인을 해주세요.
        </p>
        <button
          onClick={redirectToLogin}
          className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
          로그인하기
        </button>
      </div>
    </BaseModal>
  );
}
