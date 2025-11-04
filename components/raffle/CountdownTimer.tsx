"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = new Date(endDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    // 1초마다 업데이트
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft === null) {
        setIsEnded(true);
        clearInterval(timer);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isEnded) {
    return (
      <div className="text-center py-4">
        <p className="text-xl font-bold text-gray-600">
          이벤트가 종료되었습니다
        </p>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="text-center py-4">
        <p className="text-xl font-bold">로딩 중...</p>
      </div>
    );
  }

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center gap-1 text-2xl md:text-3xl font-bold">
        <span>{timeLeft.days}D</span>
        <span>:</span>
        <span>{formatNumber(timeLeft.hours)}H</span>
        <span>:</span>
        <span>{formatNumber(timeLeft.minutes)}M</span>
        <span>:</span>
        <span>{formatNumber(timeLeft.seconds)}S</span>
      </div>
    </div>
  );
}
