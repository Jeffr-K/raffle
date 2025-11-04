declare global {
  interface Window {
    Kakao: any;
  }
}

/**
 * Kakao SDK 초기화
 */
export const initKakao = (jsKey: string): void => {
  if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(jsKey);
  }
};

/**
 * 카카오톡 채널 친구 추가
 */
export const addKakaoChannel = (channelPublicId: string): void => {
  if (typeof window !== 'undefined' && window.Kakao) {
    window.Kakao.Channel.addChannel({
      channelPublicId: channelPublicId,
    });
  }
};

/**
 * 카카오톡 채널 URL에서 채널 ID 추출
 * @param url - 예: http://pf.kakao.com/_xabcdef
 * @returns 채널 ID (예: _xabcdef) 또는 null
 */
export const extractChannelId = (url: string): string | null => {
  const match = url.match(/_[a-zA-Z0-9]+/);
  return match ? match[0] : null;
};

/**
 * Kakao SDK 로드 완료 여부 확인
 */
export const isKakaoLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.Kakao !== 'undefined';
};
