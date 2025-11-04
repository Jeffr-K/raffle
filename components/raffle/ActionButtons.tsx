'use client';

interface ActionButtonsProps {
  onEnterDraw: () => void;
  onLearnMore: () => void;
  buttonTop?: number;
}

export default function ActionButtons({
  onEnterDraw,
  onLearnMore,
  buttonTop = 0
}: ActionButtonsProps) {
  return (
    <div
      className="flex flex-col gap-3 w-full max-w-xs mx-auto px-4"
      style={{ marginTop: buttonTop > 0 ? `${buttonTop}px` : undefined }}
    >
      <button
        onClick={onEnterDraw}
        className="w-full bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 shadow-md"
      >
        Enter draw
      </button>
      <button
        onClick={onLearnMore}
        className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 shadow-md"
      >
        Learn more
      </button>
    </div>
  );
}
