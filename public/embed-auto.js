// 자동 로드 스크립트 - 페이지 로드 시 .dpromotion-area를 찾아서 자동으로 처리
(function () {
  "use strict";
  console.log("Raffle embed-auto.js script started execution.");

  function initRaffle(raffleDiv) {
    // 이미 처리된 요소는 건너뛰기
    if (raffleDiv.getAttribute("data-raffle-loaded") === "true") {
      return;
    }
    raffleDiv.setAttribute("data-raffle-loaded", "true");

    const eventId = raffleDiv.getAttribute("data-id");
    if (!eventId) {
      console.warn("Raffle: data-id attribute not found");
      return;
    }

    // localStorage에서 이벤트 데이터 가져오기
    const eventKey = `event_${eventId}`;
    const eventDataStr = localStorage.getItem(eventKey);

    if (!eventDataStr) {
      console.error("Raffle: Event data not found for", eventId);
      raffleDiv.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #999;">이벤트 데이터를 찾을 수 없습니다.</div>';
      return;
    }

    const eventData = JSON.parse(eventDataStr);

    // 스타일 추가
    if (!document.getElementById("raffle-styles")) {
      const style = document.createElement("style");
      style.id = "raffle-styles";
      style.textContent = `
        .raffle-container { max-width: 430px; margin: 0 auto; position: relative; background: #CCCCCC; font-family: Arial, sans-serif; }
        .raffle-image { width: 100%; height: auto; display: block; }
        .raffle-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .raffle-timer { font-size: 24px; font-weight: bold; color: white; background: rgba(0, 0, 0, 0.5); padding: 10px 20px; border-radius: 8px; margin-bottom: 20px; }
        .raffle-buttons { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 320px; padding: 0 20px; }
        .raffle-btn { width: 100%; padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .raffle-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .raffle-btn-primary { background: white; color: black; }
        .raffle-btn-primary:hover { background: #f0f0f0; }
        .raffle-btn-secondary { background: black; color: white; }
        .raffle-btn-secondary:hover { background: #333; }
        .raffle-notice { background: white; padding: 20px; font-size: 14px; color: #666; }
        .raffle-notice h3 { margin: 0 0 10px 0; font-size: 16px; color: #333; font-weight: bold; }
        .raffle-notice ul { margin: 10px 0; padding-left: 20px; }
        .raffle-notice li { margin: 5px 0; }
        .raffle-modal { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 10000; align-items: center; justify-content: center; padding: 20px; }
        .raffle-modal.active { display: flex; }
        .raffle-modal-content { background: white; padding: 30px; border-radius: 12px; max-width: 400px; width: 100%; text-align: center; animation: fadeIn 0.2s; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .raffle-modal h2 { margin: 0 0 15px 0; font-size: 20px; }
        .raffle-modal p { margin: 0 0 20px 0; color: #666; line-height: 1.5; }
        .raffle-modal-btn { padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin: 5px; }
        .raffle-modal-btn-primary { background: black; color: white; }
        .raffle-modal-btn-secondary { background: white; color: black; border: 1px solid black; }
      `;
      document.head.appendChild(style);
    }

    // HTML 렌더링
    raffleDiv.innerHTML = `
      <div class="raffle-container">
        <div style="position: relative;">
          <img src="${eventData.imageUrl}" alt="${eventData.name}" class="raffle-image">
          <div class="raffle-overlay" style="margin-top: ${eventData.buttonTop || 0}px;">
            <div class="raffle-timer" id="raffle-timer-${eventId}">로딩 중...</div>
            <div class="raffle-buttons">
              <button class="raffle-btn raffle-btn-primary" onclick="window.__raffle_${eventId}_enter()">Enter draw</button>
              <button class="raffle-btn raffle-btn-secondary" onclick="window.__raffle_${eventId}_learn()">Learn more</button>
            </div>
          </div>
        </div>
        <div class="raffle-notice">
          <h3>Notice</h3>
          <ul>
            <li>응모 기간: ${new Date(eventData.startDate).toLocaleDateString()} ~ ${new Date(eventData.endDate).toLocaleDateString()}</li>
            <li>당첨자 발표: 이벤트 종료 후 개별 연락</li>
            <li>중복 응모는 불가능합니다</li>
            <li>카카오톡 채널 친구 추가가 필요합니다</li>
          </ul>
        </div>
      </div>
      <div id="raffle-modal-${eventId}" class="raffle-modal" onclick="if(event.target === this) this.classList.remove('active')">
        <div class="raffle-modal-content"></div>
      </div>
    `;

    // 카운트다운 타이머
    function updateTimer() {
      const timer = document.getElementById(`raffle-timer-${eventId}`);
      if (!timer) return;

      const now = Date.now();
      const end = new Date(eventData.endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        timer.textContent = "이벤트가 종료되었습니다";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      timer.textContent = `${days}D:${String(hours).padStart(2, "0")}H:${String(minutes).padStart(2, "0")}M:${String(seconds).padStart(2, "0")}S`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // 모달 표시 함수
    function showModal(title, message, buttons) {
      const modal = document.getElementById(`raffle-modal-${eventId}`);
      const content = modal.querySelector(".raffle-modal-content");

      let buttonsHtml = "";
      buttons.forEach((btn) => {
        buttonsHtml += `<button class="raffle-modal-btn raffle-modal-btn-${btn.type}" onclick="${btn.onclick}">${btn.text}</button>`;
      });

      content.innerHTML = `<h2>${title}</h2><p>${message}</p><div>${buttonsHtml}</div>`;
      modal.classList.add("active");
    }

    // Enter draw 핸들러
    window[`__raffle_${eventId}_enter`] = function () {
      const isLoggedIn =
        typeof window.CAFE24 !== "undefined" &&
        window.CAFE24 &&
        window.CAFE24.MEMBER_ID;

      if (!isLoggedIn) {
        showModal(
          "로그인이 필요합니다",
          "래플 이벤트에 응모하려면 먼저 로그인을 해주세요.",
          [
            {
              text: "로그인하기",
              type: "primary",
              onclick:
                "window.location.href='/member/login.html?return_url=' + encodeURIComponent(location.href)",
            },
          ],
        );
        return;
      }

      const memberId = window.CAFE24.MEMBER_ID;
      const hasEntered =
        localStorage.getItem(`raffle_${eventId}_${memberId}`) === "true";

      if (hasEntered) {
        showModal(
          "이미 응모하셨습니다",
          "이미 이 래플 이벤트에 응모하셨습니다.<br>당첨자 발표를 기다려주세요!",
          [
            {
              text: "확인",
              type: "primary",
              onclick: `document.getElementById('raffle-modal-${eventId}').classList.remove('active')`,
            },
          ],
        );
        return;
      }

      showModal(
        "카카오톡 채널 친구 추가",
        "래플 이벤트 참여를 위해 카카오톡 채널 친구 추가가 필요합니다.",
        [
          {
            text: "친구 추가하고 응모하기",
            type: "primary",
            onclick: `window.__raffle_${eventId}_submit()`,
          },
          {
            text: "취소",
            type: "secondary",
            onclick: `document.getElementById('raffle-modal-${eventId}').classList.remove('active')`,
          },
        ],
      );
    };

    // 응모 제출
    window[`__raffle_${eventId}_submit`] = async function () {
      const memberId = window.CAFE24.MEMBER_ID;
      const memberName = window.CAFE24.MEMBER_NAME || "";
      const memberEmail = window.CAFE24.MEMBER_EMAIL || "";
      const memberPhone = window.CAFE24.MEMBER_PHONE || "";

      try {
        const scripts = document.getElementsByTagName("script");
        let domain = "";
        for (let i = 0; i < scripts.length; i++) {
          if (
            scripts[i].src &&
            (scripts[i].src.includes("/embed.js") ||
              scripts[i].src.includes("/embed-auto.js"))
          ) {
            domain = new URL(scripts[i].src).origin;
            break;
          }
        }

        const response = await fetch(`${domain}/api/sheets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            eventId: eventId,
            memberId: memberId,
            name: memberName,
            email: memberEmail,
            phone: memberPhone,
            kakaoFriend: "Y",
          }),
        });

        if (response.ok) {
          localStorage.setItem(`raffle_${eventId}_${memberId}`, "true");
          showModal(
            "응모 완료!",
            "래플 이벤트 응모가 완료되었습니다.<br>당첨자 발표를 기다려주세요!",
            [
              {
                text: "확인",
                type: "primary",
                onclick: `document.getElementById('raffle-modal-${eventId}').classList.remove('active')`,
              },
            ],
          );
        } else {
          throw new Error("Failed to submit");
        }
      } catch (error) {
        showModal(
          "오류 발생",
          "응모 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
          [
            {
              text: "확인",
              type: "primary",
              onclick: `document.getElementById('raffle-modal-${eventId}').classList.remove('active')`,
            },
          ],
        );
      }
    };

    // Learn more 핸들러
    window[`__raffle_${eventId}_learn`] = function () {
      showModal(eventData.name, "상품 상세 정보를 확인하세요.", [
        {
          text: "확인",
          type: "primary",
          onclick: `document.getElementById('raffle-modal-${eventId}').classList.remove('active')`,
        },
      ]);
    };

    console.log("Raffle loaded:", eventId);
  }

  // 페이지의 모든 .dpromotion-area 요소 초기화
  function initAll() {
    const raffleDivs = document.querySelectorAll(".dpromotion-area");
    raffleDivs.forEach(initRaffle);
  }

  // DOM 로드 완료 시 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // MutationObserver로 동적으로 추가된 요소도 감지
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          if (node.classList && node.classList.contains("dpromotion-area")) {
            initRaffle(node);
          }
          const children =
            node.querySelectorAll && node.querySelectorAll(".dpromotion-area");
          if (children) {
            children.forEach(initRaffle);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
