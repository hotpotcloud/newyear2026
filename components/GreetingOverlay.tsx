import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Greeting } from "../types";

// 定义各种动画变体
const animationVariants: Record<string, Variants> = {
  fadeUp: {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -60, scale: 1.05 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 60, scale: 1.05 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.5 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 150 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -150 },
  },
  slideRight: {
    initial: { opacity: 0, x: -150 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 150 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -15, scale: 0.8 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 15, scale: 0.8 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(20px)", scale: 1.1 },
    animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
    exit: { opacity: 0, filter: "blur(20px)", scale: 0.9 },
  },
  bounce: {
    initial: { opacity: 0, y: -100, scale: 0.8 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    exit: { opacity: 0, y: 100, scale: 0.8 },
  },
};

// 字体样式映射
const fontStyleMap: Record<string, string> = {
  brush: "font-brush", // 草书
  cao: "font-cao", // 狂草
  xing: "font-xing", // 行书
  kai: "font-kai", // 行楷
};

interface GreetingOverlayProps {
  current: Greeting;
}

const GreetingOverlay: React.FC<GreetingOverlayProps> = ({ current }) => {
  const activeVariant =
    animationVariants[current.animation] || animationVariants.fadeUp;
  const fontClass = fontStyleMap[current.fontStyle] || "font-brush";

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none px-4 text-center">
      {/* Top Left Label */}
      <div className="absolute top-8 left-8 text-left opacity-80 scale-75 md:scale-100">
        <p className="font-serif-sc text-sm tracking-widest text-red-100 mb-1 uppercase">
          Happy New Year
        </p>
        <p className="font-serif-sc text-xs text-white/60">
          岁月悠长 · 山河无恙
        </p>
      </div>

      {/* Top Right Label */}
      <div className="absolute top-8 right-8 text-right opacity-80 scale-75 md:scale-100">
        <p className="font-brush text-xl text-yellow-200">二〇二六 · 丙午年</p>
      </div>

      {/* Center Animated Greeting */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          variants={activeVariant}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          {/* 主文字 */}
          <motion.h1
            className={`text-5xl md:text-7xl lg:text-8xl ${fontClass} mb-8`}
            style={{
              color: current.color,
              textShadow: `0 0 40px ${current.glowColor}, 0 0 80px ${current.glowColor}`,
            }}
            animate={{
              textShadow: [
                `0 0 40px ${current.glowColor}, 0 0 80px ${current.glowColor}`,
                `0 0 60px ${current.glowColor}, 0 0 100px ${current.glowColor}`,
                `0 0 40px ${current.glowColor}, 0 0 80px ${current.glowColor}`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {current.text}
          </motion.h1>

          {/* 分隔线 */}
          <motion.div
            className="h-[2px] w-24 mb-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${current.color}, transparent)`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          {/* 出处和角色 */}
          <motion.p
            className="text-xl md:text-2xl font-serif-sc text-white/80 tracking-[0.15em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {current.subText}
            <span className="opacity-40 mx-3">|</span>
            <span style={{ color: current.color }}>{current.artist}</span>
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom UI Decoration */}
      <div className="absolute bottom-12 left-8 text-left max-w-xs scale-75 md:scale-100">
        <div className="mb-4">
          <h2 className="text-3xl md:text-4xl font-brush text-red-600 mb-1 drop-shadow-md">
            新年大吉
          </h2>
          <p className="text-[10px] md:text-xs text-white/40 leading-tight uppercase tracking-widest">
            Celestial Harmony
            <br />
            Lunar Cycle 2026
          </p>
        </div>
        <p className="text-[9px] md:text-[11px] text-white/30 uppercase tracking-tighter leading-relaxed font-sans border-l border-red-900/50 pl-3">
          May the fireworks illuminate your path and the cheers of the new year
          bring endless joy to your heart.
        </p>
      </div>

      <div className="absolute bottom-12 right-8 flex flex-col items-end scale-75 md:scale-100">
        <div className="w-16 h-1 mb-4 bg-gradient-to-l from-red-600 to-transparent" />
        <p className="text-sm text-white/60 font-serif-sc tracking-widest">
          不 负 韶 华
        </p>
        <p className="text-[10px] text-white/20 mt-1 uppercase font-sans">
          Dreams ignite the future
        </p>
      </div>
    </div>
  );
};

export default GreetingOverlay;
