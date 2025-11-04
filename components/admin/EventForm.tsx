"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import EmbedCodeGenerator from "./EmbedCodeGenerator";
import type { RaffleEvent } from "@/types";

export default function EventForm() {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    kakaoChannelUrl: "",
    buttonTop: 0,
  });
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [previewButtonTop, setPreviewButtonTop] = useState(0);

  const handleImageUpload = (base64: string) => {
    setFormData({ ...formData, imageUrl: base64 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (
      !formData.name ||
      !formData.imageUrl ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.kakaoChannelUrl
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 날짜 유효성 검사
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("종료 일시는 시작 일시보다 이후여야 합니다.");
      return;
    }

    // 이벤트 ID 생성 (간단한 UUID 대신 timestamp 사용)
    const eventId = `raffle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 이벤트 데이터 생성
    const event: RaffleEvent = {
      id: eventId,
      name: formData.name,
      imageUrl: formData.imageUrl,
      startDate: formData.startDate,
      endDate: formData.endDate,
      kakaoChannelUrl: formData.kakaoChannelUrl,
      buttonTop: formData.buttonTop,
      createdAt: new Date().toISOString(),
    };

    // localStorage에 저장
    localStorage.setItem(`event_${eventId}`, JSON.stringify(event));

    // 모든 이벤트 ID 목록 저장
    const allEvents = JSON.parse(localStorage.getItem("allEvents") || "[]");
    allEvents.push(eventId);
    localStorage.setItem("allEvents", JSON.stringify(allEvents));

    setCreatedEventId(eventId);
    alert("이벤트가 생성되었습니다!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">래플 이벤트 만들기</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 폼 */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이벤트명
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="예: XAVIER 9 RAFFLE"
              />
            </div>

            <ImageUploader
              onImageUpload={handleImageUpload}
              currentImage={formData.imageUrl}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작 일시
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료 일시
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카카오톡 채널 URL
              </label>
              <input
                type="url"
                value={formData.kakaoChannelUrl}
                onChange={(e) =>
                  setFormData({ ...formData, kakaoChannelUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="예: http://pf.kakao.com/_xabcdef"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                버튼 위치 조정 (상단 여백, px)
              </label>
              <input
                type="number"
                value={previewButtonTop}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setPreviewButtonTop(value);
                  setFormData({ ...formData, buttonTop: value });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="0"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              이벤트 생성하기
            </button>
          </form>

          {createdEventId && <EmbedCodeGenerator eventId={createdEventId} />}
        </div>

        {/* 미리보기 */}
        <div className="lg:sticky lg:top-6 h-fit">
          <h2 className="text-xl font-bold mb-4">미리보기</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
            <div className="relative w-full max-w-[430px] mx-auto bg-raffle-bg">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[9/16] flex items-center justify-center text-gray-400">
                  이미지를 업로드하세요
                </div>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="text-center space-y-4"
                  style={{ marginTop: `${previewButtonTop}px` }}
                >
                  {formData.startDate && formData.endDate && (
                    <div className="text-white text-2xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded">
                      카운트다운 타이머
                    </div>
                  )}
                  <div className="space-y-3 px-4">
                    <button className="w-full max-w-xs bg-white text-black py-3 px-6 rounded-lg font-semibold">
                      Enter draw
                    </button>
                    <button className="w-full max-w-xs bg-black text-white py-3 px-6 rounded-lg font-semibold">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
