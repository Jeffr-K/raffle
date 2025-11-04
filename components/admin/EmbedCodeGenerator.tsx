"use client";

import { useState, useEffect } from "react";

interface EmbedCodeGeneratorProps {
  eventId: string;
}

export default function EmbedCodeGenerator({
  eventId,
}: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [domain, setDomain] = useState("");

  // 클라이언트에서 실제 도메인 가져오기
  useEffect(() => {
    const actualDomain =
      process.env.NEXT_PUBLIC_DOMAIN || window.location.origin;
    setDomain(actualDomain);
  }, []);

  const embedCode = domain
    ? `<div class="dpromotion-area" data-id="${eventId}"></div>
<script src="${domain}/embed.js"></script>`
    : "로딩 중...";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-bold">임베딩 코드</h3>

      <div className="bg-white p-4 rounded border border-gray-300 font-mono text-sm overflow-x-auto">
        <pre>{embedCode}</pre>
      </div>

      <button
        onClick={handleCopy}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
          copied
            ? "bg-green-600 text-white"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {copied ? "복사 완료!" : "코드 복사하기"}
      </button>

      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-semibold">사용 방법:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>위의 코드를 복사하세요</li>
          <li>Cafe24 관리자 페이지에서 게시판 글 작성으로 이동하세요</li>
          <li>HTML 편집 모드로 전환하세요</li>
          <li>복사한 코드를 붙여넣으세요</li>
          <li>저장하고 게시하세요</li>
        </ol>
      </div>
    </div>
  );
}
