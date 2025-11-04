import type { Cafe24Info } from "@/types";

/**
 * iframe 내에서 parent 페이지와 통신하여 Cafe24 로그인 정보 확인
 */
export const checkCafe24Login = (): Promise<Cafe24Info> => {
  return new Promise((resolve) => {
    // parent에게 로그인 상태 요청
    window.parent.postMessage({ type: "getCafe24Info" }, "*");

    const handler = (e: MessageEvent) => {
      if (e.data.type === "cafe24Info") {
        resolve(e.data.info);
        window.removeEventListener("message", handler);
      }
    };

    window.addEventListener("message", handler);

    // 타임아웃 (3초) - 응답이 없으면 비로그인으로 처리
    setTimeout(() => {
      window.removeEventListener("message", handler);
      resolve({
        isLoggedIn: false,
        memberId: null,
        name: null,
        email: null,
        phone: null,
      });
    }, 3000);
  });
};

/**
 * Cafe24 로그인 페이지로 리다이렉트 (parent 페이지)
 */
export const redirectToLogin = () => {
  if (typeof window !== "undefined" && window.parent) {
    const returnUrl = encodeURIComponent(window.parent.location.href);
    window.parent.location.href = `/member/login.html?return_url=${returnUrl}`;
  }
};

/**
 * Cafe24 회원가입 페이지로 리다이렉트 (parent 페이지)
 */
export const redirectToSignup = () => {
  if (typeof window !== "undefined" && window.parent) {
    const returnUrl = encodeURIComponent(window.parent.location.href);
    window.parent.location.href = `/member/join.html?return_url=${returnUrl}`;
  }
};

/**
 * localStorage에서 중복 응모 확인
 */
export const hasAlreadyEntered = (
  eventId: string,
  memberId: string,
): boolean => {
  if (typeof window === "undefined") return false;
  const key = `raffle_${eventId}_${memberId}`;
  return localStorage.getItem(key) === "true";
};

/**
 * localStorage에 응모 완료 표시
 */
export const markAsEntered = (eventId: string, memberId: string): void => {
  if (typeof window === "undefined") return;
  const key = `raffle_${eventId}_${memberId}`;
  localStorage.setItem(key, "true");
};
