(function () {
  "use strict";

  // 1. data-id 찾기
  const raffleDiv = document.querySelector(".dpromotion-area");
  if (!raffleDiv) {
    console.warn("Raffle: .dpromotion-area element not found");
    return;
  }

  const eventId = raffleDiv.getAttribute("data-id");
  if (!eventId) {
    console.warn("Raffle: data-id attribute not found");
    return;
  }

  // 2. iframe 생성
  const iframe = document.createElement("iframe");
  // 스크립트가 로드된 URL에서 도메인 추출
  const scripts = document.getElementsByTagName("script");
  let scriptSrc = "";
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.includes("/embed.js")) {
      scriptSrc = scripts[i].src;
      break;
    }
  }

  // 스크립트 URL에서 도메인 추출 (예: https://your-domain.vercel.app/embed.js)
  const domain = scriptSrc ? new URL(scriptSrc).origin : window.location.origin;

  iframe.src = `${domain}/embed/${eventId}`;
  iframe.style.width = "100%";
  iframe.style.height = "800px"; // 초기 높이
  iframe.style.border = "none";
  iframe.style.display = "block";
  iframe.setAttribute("scrolling", "no");

  // 3. 삽입
  raffleDiv.appendChild(iframe);

  // 4. 높이 자동 조정 (postMessage 사용)
  window.addEventListener("message", function (e) {
    // iframe에서 온 메시지인지 확인
    if (e.source !== iframe.contentWindow) return;

    if (e.data.type === "resize" && e.data.height) {
      iframe.style.height = e.data.height + "px";
    }

    // iframe에서 Cafe24 정보 요청 시 응답
    if (e.data.type === "getCafe24Info") {
      // Cafe24 전역 객체 확인
      let cafe24Info = {
        isLoggedIn: false,
        memberId: null,
        name: null,
        email: null,
        phone: null,
      };

      // Cafe24 전역 객체가 있는지 확인
      if (typeof window.CAFE24 !== "undefined" && window.CAFE24) {
        cafe24Info = {
          isLoggedIn: !!window.CAFE24.MEMBER_ID,
          memberId: window.CAFE24.MEMBER_ID || null,
          name: window.CAFE24.MEMBER_NAME || null,
          email: window.CAFE24.MEMBER_EMAIL || null,
          phone: window.CAFE24.MEMBER_PHONE || null,
        };
      }

      // iframe에 응답
      iframe.contentWindow.postMessage(
        {
          type: "cafe24Info",
          info: cafe24Info,
        },
        "*",
      );
    }
  });

  console.log("Raffle embed script loaded successfully for event:", eventId);
})();
