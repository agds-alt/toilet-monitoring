// src/presentation/hooks/useTimer.ts
// ============================================
// TIMER HOOK - Duration Tracking
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerReturn {
  duration: number; // in seconds
  isRunning: boolean;
  formattedTime: string;
  startTimer: () => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
}

export function useTimer(autoStart: boolean = false): UseTimerReturn {
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const startTimeRef = useRef<number | null>(null);
  const pausedDurationRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // START TIMER
  // ============================================

  const startTimer = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      pausedDurationRef.current = 0;
      setIsRunning(true);
      setDuration(0);
      console.log('⏱️ Timer started');
    }
  }, [isRunning]);

  // ============================================
  // STOP TIMER
  // ============================================

  const stopTimer = useCallback(() => {
    if (isRunning && startTimeRef.current) {
      const finalDuration = Math.floor(
        (Date.now() - startTimeRef.current + pausedDurationRef.current) / 1000
      );
      setDuration(finalDuration);
      setIsRunning(false);
      startTimeRef.current = null;
      pausedDurationRef.current = 0;
      console.log('⏹️ Timer stopped:', finalDuration, 'seconds');
    }
  }, [isRunning]);

  // ============================================
  // PAUSE TIMER
  // ============================================

  const pauseTimer = useCallback(() => {
    if (isRunning && startTimeRef.current) {
      pausedDurationRef.current += Date.now() - startTimeRef.current;
      setIsRunning(false);
      console.log('⏸️ Timer paused');
    }
  }, [isRunning]);

  // ============================================
  // RESUME TIMER
  // ============================================

  const resumeTimer = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
      console.log('▶️ Timer resumed');
    }
  }, [isRunning]);

  // ============================================
  // RESET TIMER
  // ============================================

  const resetTimer = useCallback(() => {
    setDuration(0);
    setIsRunning(false);
    startTimeRef.current = null;
    pausedDurationRef.current = 0;
    console.log('🔄 Timer reset');
  }, []);

  // ============================================
  // UPDATE DURATION (every second)
  // ============================================

  useEffect(() => {
    if (isRunning && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - startTimeRef.current! + pausedDurationRef.current) / 1000
        );
        setDuration(elapsed);
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning]);

  // ============================================
  // FORMAT TIME (HH:MM:SS)
  // ============================================

  const formattedTime = formatDuration(duration);

  return {
    duration,
    isRunning,
    formattedTime,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
}

// ============================================
// FORMAT DURATION HELPER
// ============================================

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// PARSE DURATION (for display)
// ============================================

export function parseDuration(seconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}