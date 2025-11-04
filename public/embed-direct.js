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

  // 2. 스크립트가 로드된 URL에서 도메인 추출
  const scripts = document.getElementsByTagName("script");
  let scriptSrc = "";
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.includes("/embed")) {
      scriptSrc = scripts[i].src;
      break;
    }
  }

  const domain = scriptSrc ? new URL(scriptSrc).origin : "";

  if (!domain) {
    console.error("Raffle: Could not determine domain");
    return;
  }

  // 3. 이벤트 데이터 가져오기
  fetch(`${domain}/api/embed/${eventId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Event not found");
      }
      return response.json();
    })
    .then((eventData) => {
      // 4. HTML 직접 삽입
      renderRaffle(raffleDiv, eventData, domain);
    })
    .catch((error) => {
      console.error("Raffle: Failed to load event", error);
      raffleDiv.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #999;">이벤트를 불러올 수 없습니다.</div>';
    });

  function renderRaffle(container, eventData, domain) {
    // 스타일 추가
    if (!document.getElementById("raffle-styles")) {
      const style = document.createElement("style");
      style.id = "raffle-styles";
      style.textContent = `
        .raffle-container {
          max-width: 430px;
          margin: 0 auto;
          position: relative;
          background: #CCCCCC;
        }
        .raffle-image {
          width: 100%;
          height: auto;
          display: block;
        }
        .raffle-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .raffle-timer {
          font-size: 24px;
          font-weight: bold;
          color: white;
          background: rgba(0, 0, 0, 0.5);
          padding: 10px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .raffle-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 320px;
          padding: 0 20px;
        }
        .raffle-btn {
          width: 100%;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .raffle-btn:hover {
          transform: translateY(-2px);
        }
        .raffle-btn-primary {
          background: white;
          color: black;
        }
        .raffle-btn-secondary {
          background: black;
          color: white;
        }
        .raffle-notice {
          background: white;
          padding: 20px;
          font-size: 14px;
          color: #666;
        }
        .raffle-notice h3 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #333;
        }
        .raffle-notice ul {
          margin: 0;
          padding-left: 20px;
        }
        .raffle-notice li {
          margin: 5px 0;
        }
      `;
      document.head.appendChild(style);
    }

    // HTML 생성
    const html = `
      <div class="raffle-container">
        <div style="position: relative;">
          <img src="${eventData.imageUrl}" alt="${eventData.name}" class="raffle-image">
          <div class="raffle-overlay" style="margin-top: ${eventData.buttonTop}px;">
            <div class="raffle-timer" id="raffle-timer-${eventId}">
              카운트다운 로딩 중...
            </div>
            <div class="raffle-buttons">
              <button class="raffle-btn raffle-btn-primary" onclick="window.raffleEnterDraw('${eventId}', '${domain}')">
                Enter draw
              </button>
              <button class="raffle-btn raffle-btn-secondary" onclick="window.raffleLearnMore('${eventId}')">
                Learn more
              </button>
            </div>
          </div>
        </div>
        <div class="raffle-notice">
          <h3>Notice</h3>
          <ul>
            <li>응모 기간: 이벤트 종료 시까지</li>
            <li>당첨자 발표: 이벤트 종료 후 개별 연락</li>
            <li>중복 응모는 불가능합니다</li>
            <li>카카오톡 채널 친구 추가가 필요합니다</li>
          </ul>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // 타이머 시작
    startCountdown(eventId, eventData.endDate);
  }

  function startCountdown(eventId, endDate) {
    const timerEl = document.getElementById(`raffle-timer-${eventId}`);
    if (!timerEl) return;

    function update() {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        timerEl.textContent = "이벤트가 종료되었습니다";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      timerEl.textContent = `${days}D:${String(hours).padStart(2, "0")}H:${String(
        minutes
      ).padStart(2, "0")}M:${String(seconds).padStart(2, "0")}S`;
    }

    update();
    setInterval(update, 1000);
  }

  // 전역 함수 등록
  window.raffleEnterDraw = function (eventId, domain) {
    alert("Enter draw 기능 (추후 구현)");
    // iframe 모달이나 팝업으로 처리
  };

  window.raffleLearnMore = function (eventId) {
    alert("Learn more 기능 (추후 구현)");
  };

  console.log("Raffle embed script loaded successfully for event:", eventId);
})();
