'use client';

import BaseModal from './BaseModal';
import { redirectToSignup, redirectToLogin } from '@/lib/cafe24';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">회원가입이 필요합니다</h2>
        <p className="text-gray-600 mb-6">
          래플 이벤트에 응모하려면 먼저 회원가입을 해주세요.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={redirectToSignup}
            className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            회원가입하기
          </button>
          <button
            onClick={redirectToLogin}
            className="w-full bg-white text-black border border-black py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
