import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "./components/Fireworks";
import GreetingOverlay from "./components/GreetingOverlay";
import Countdown from "./components/Countdown";
import BigCountdown from "./components/BigCountdown";
import { GREETINGS } from "./constants";

// 2026年1月1日 00:00:00
const NEW_YEAR_2026 = new Date("2026-01-01T00:00:00");

type AppState = "BIG_COUNTDOWN" | "COUNTDOWN" | "SPLASH" | "MAIN";

const GREETING_DURATION = 4000; // 4 seconds per greeting

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const now = new Date();
    const diff = NEW_YEAR_2026.getTime() - now.getTime();

    if (diff <= 0) {
      return "SPLASH";
    } else if (diff <= 3000) {
      return "COUNTDOWN";
    } else {
      return "BIG_COUNTDOWN";
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 当前祝福语的进度 0-100
  const timerRef = useRef<number | null>(null);

  const totalTime = GREETINGS.length * GREETING_DURATION;

  // 播放计时器
  useEffect(() => {
    if (state !== "MAIN" || !isPlaying) return;

    const startTime = Date.now() - (progress / 100) * GREETING_DURATION;

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / GREETING_DURATION) * 100;

      if (newProgress >= 100) {
        // 切换到下一个祝福语
        setCurrentIndex((prev) => (prev + 1) % GREETINGS.length);
        setProgress(0);
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state, isPlaying, currentIndex]);

  // 大倒计时结束，进入最后3秒倒计时
  const handleLastThreeSeconds = () => {
    setState("COUNTDOWN");
  };

  // 跳过直接进入主页面（测试用）
  const handleSkip = () => {
    setState("SPLASH");
    setTimeout(() => setState("MAIN"), 2500);
  };

  // 3-2-1倒计时结束
  const handleCountdownComplete = () => {
    setState("SPLASH");
    setTimeout(() => setState("MAIN"), 2500);
  };

  // 播放/暂停切换
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // 点击进度条跳转到对应祝福语
  const handleProgressClick = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // 上一个
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GREETINGS.length) % GREETINGS.length);
    setProgress(0);
  };

  // 下一个
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GREETINGS.length);
    setProgress(0);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // 计算总进度
  const totalProgress =
    ((currentIndex * GREETING_DURATION + (progress / 100) * GREETING_DURATION) /
      totalTime) *
    100;

  // 计算当前播放时间
  const currentTime =
    currentIndex * GREETING_DURATION + (progress / 100) * GREETING_DURATION;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0f0515] to-[#000000] z-[-1]"></div>

      <AnimatePresence mode="wait">
        {state === "BIG_COUNTDOWN" && (
          <BigCountdown
            key="big-countdown"
            targetDate={NEW_YEAR_2026}
            onLastThreeSeconds={handleLastThreeSeconds}
            onSkip={handleSkip}
          />
        )}

        {state === "COUNTDOWN" && (
          <Countdown key="countdown" onComplete={handleCountdownComplete} />
        )}

        {state === "SPLASH" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="font-brush text-8xl md:text-[12rem] text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.6)]">
                万事如意
              </h1>
              <p className="mt-8 font-serif-sc text-yellow-500/80 text-xl md:text-2xl tracking-[1.5em] md:tracking-[2em] uppercase">
                Happy New Year
              </p>
            </motion.div>
          </motion.div>
        )}

        {state === "MAIN" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Fireworks />
            <GreetingOverlay current={GREETINGS[currentIndex]} />

            {/* Artistic Vignette */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)] z-20" />

            {/* Progress Indicator */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
              <div className="flex gap-3 items-center px-5 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                {/* 上一个按钮 */}
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-white/70 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                {/* 播放/暂停按钮 */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  {isPlaying ? (
                    <svg
                      className="w-5 h-5 text-white/80 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-white/80 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* 下一个按钮 */}
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-white/70 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>

                {/* 分隔线 */}
                <div className="w-px h-6 bg-white/20" />

                {/* 祝福语进度指示器 */}
                <div className="flex gap-1.5 items-center">
                  {GREETINGS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleProgressClick(index)}
                      className="relative group"
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-red-500 scale-125"
                            : index < currentIndex
                              ? "bg-yellow-500/80"
                              : "bg-white/30 hover:bg-white/50"
                        }`}
                      />
                      {/* 当前播放的进度环 */}
                      {index === currentIndex && (
                        <svg
                          className="absolute -inset-1 w-4 h-4 -rotate-90"
                          viewBox="0 0 16 16"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="6"
                            fill="none"
                            stroke="rgba(239, 68, 68, 0.3)"
                            strokeWidth="2"
                          />
                          <circle
                            cx="8"
                            cy="8"
                            r="6"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2"
                            strokeDasharray={`${(progress / 100) * 37.7} 37.7`}
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {/* 悬停提示 */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 rounded text-[10px] text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {GREETINGS[index].artist}
                      </div>
                    </button>
                  ))}
                </div>

                {/* 分隔线 */}
                <div className="w-px h-6 bg-white/20" />

                {/* 时间和序号 */}
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs text-white/60 font-mono">
                    {formatTime(currentTime)} / {formatTime(totalTime)}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {currentIndex + 1} / {GREETINGS.length}
                  </span>
                </div>
              </div>

              {/* 当前祝福语信息 */}
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">
                {isPlaying ? (
                  <span className="animate-pulse">
                    ♪ {GREETINGS[currentIndex].subText} -{" "}
                    {GREETINGS[currentIndex].artist}
                  </span>
                ) : (
                  <span>已暂停</span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
