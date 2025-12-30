import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BigCountdownProps {
  targetDate: Date;
  onLastThreeSeconds: () => void;
  onSkip?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = targetDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
};

// 单个数字卡片组件
const DigitCard: React.FC<{ digit: string; label: string }> = ({
  digit,
  label,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* 背景光晕 */}
        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-3xl" />

        {/* 卡片主体 */}
        <motion.div
          className="relative w-16 h-20 md:w-24 md:h-32 lg:w-32 lg:h-40 bg-gradient-to-b from-gray-900 to-black rounded-xl border border-red-500/30 flex items-center justify-center overflow-hidden shadow-2xl"
          style={{
            boxShadow:
              "0 0 40px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* 顶部高光 */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />

          {/* 中间分割线 */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/50" />

          {/* 数字 */}
          <AnimatePresence mode="popLayout">
            <motion.span
              key={digit}
              initial={{ y: -80, opacity: 0, rotateX: -90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: 80, opacity: 0, rotateX: 90 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 0.5,
              }}
              className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-red-100 to-red-200 drop-shadow-lg"
              style={{
                textShadow: "0 0 30px rgba(255, 100, 100, 0.5)",
              }}
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 标签 */}
      <span className="mt-2 md:mt-4 text-xs md:text-sm text-red-200/60 uppercase tracking-[0.2em] font-serif-sc">
        {label}
      </span>
    </div>
  );
};

// 时间单位组件（两位数）
const TimeUnit: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => {
  const digits = value.toString().padStart(2, "0").split("");

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1 md:gap-2">
        {digits.map((digit, index) => (
          <DigitCard key={`${label}-${index}`} digit={digit} label="" />
        ))}
      </div>
      <span className="mt-2 md:mt-4 text-xs md:text-sm text-red-200/60 uppercase tracking-[0.2em] font-serif-sc">
        {label}
      </span>
    </div>
  );
};

// 分隔符组件
const Separator: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-3 md:gap-4 px-1 md:px-3 pb-6 md:pb-8">
    <motion.div
      animate={{
        opacity: [1, 0.3, 1],
        scale: [1, 0.8, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500 shadow-lg"
      style={{ boxShadow: "0 0 15px rgba(220, 38, 38, 0.8)" }}
    />
    <motion.div
      animate={{
        opacity: [1, 0.3, 1],
        scale: [1, 0.8, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
      className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500 shadow-lg"
      style={{ boxShadow: "0 0 15px rgba(220, 38, 38, 0.8)" }}
    />
  </div>
);

const BigCountdown: React.FC<BigCountdownProps> = ({
  targetDate,
  onLastThreeSeconds,
  onSkip,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(targetDate),
  );
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      // 当剩余时间小于等于3秒时，触发最后3秒倒计时
      if (newTimeLeft.total <= 3000 && newTimeLeft.total > 0 && !hasTriggered) {
        setHasTriggered(true);
        clearInterval(timer);
        onLastThreeSeconds();
      }

      // 时间到了
      if (newTimeLeft.total <= 0) {
        clearInterval(timer);
        if (!hasTriggered) {
          setHasTriggered(true);
          onLastThreeSeconds();
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [targetDate, onLastThreeSeconds, hasTriggered]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black" />

      {/* 动态光效背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(220, 38, 38, 0.1), transparent, rgba(220, 38, 38, 0.05), transparent)",
          }}
        />
      </div>

      {/* 粒子装饰 */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-500/50 rounded-full"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 标题 */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative mb-8 md:mb-12 text-center"
      >
        <h1 className="font-brush text-4xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-red-400 to-yellow-200 drop-shadow-lg">
          <span onClick={onSkip} className="cursor-default">
            新
          </span>
          年倒计时
        </h1>
        <p className="mt-2 text-sm md:text-base text-red-200/50 tracking-[0.5em] uppercase">
          Countdown to 2026
        </p>
      </motion.div>

      {/* 倒计时主体 */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative flex items-center gap-2 md:gap-4 lg:gap-6 px-4"
      >
        <TimeUnit value={timeLeft.days} label="天" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="时" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="分" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="秒" />
      </motion.div>

      {/* 底部装饰文字 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 md:bottom-12 text-center"
      >
        <p className="text-xs md:text-sm text-white/30 tracking-[0.3em] font-serif-sc">
          马年将至 · 万象更新
        </p>
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-[10px] text-red-500/40 uppercase tracking-widest"
        >
          The Year of the Horse
        </motion.div>
      </motion.div>

      {/* 四角装饰 */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-red-500/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-red-500/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-red-500/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-red-500/30" />
    </motion.div>
  );
};

export default BigCountdown;
