'use client';

import { ChangeEvent } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ onImageUpload, currentImage }: ImageUploaderProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 타입 체크
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      alert('PNG 또는 JPG 파일만 업로드 가능합니다.');
      return;
    }

    // Base64로 변환
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageUpload(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">배경 이미지 업로드</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-black file:text-white
            hover:file:bg-gray-800
            cursor-pointer"
        />
        <span className="text-xs text-gray-500">PNG, JPG 형식, 최대 5MB</span>
      </label>

      {currentImage && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">미리보기</p>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
