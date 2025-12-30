import React, { useEffect, useRef, useCallback } from "react";
import { COLORS } from "../constants";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  size: number;
  flicker?: boolean;
  type?: string;
}

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);

  const createFirework = useCallback((x: number, y: number) => {
    const types = ["burst", "ring", "glitter"];
    const type = types[Math.floor(Math.random() * types.length)];
    const particleCount =
      type === "ring" ? 60 : 80 + Math.floor(Math.random() * 30);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const isGlitter = type === "glitter";

    for (let i = 0; i < particleCount; i++) {
      let vx = 0;
      let vy = 0;
      let speed = 0;

      if (type === "ring") {
        const angle = (i / particleCount) * Math.PI * 2;
        speed = 4 + Math.random() * 2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        const angle = Math.random() * Math.PI * 2;
        speed = 1 + Math.random() * (isGlitter ? 8 : 6);
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      particles.current.push({
        x,
        y,
        vx,
        vy,
        alpha: 1,
        color,
        decay: (isGlitter ? 0.006 : 0.012) + Math.random() * 0.018,
        size: (isGlitter ? 0.5 : 1) + Math.random() * 2,
        flicker: isGlitter,
        type,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const update = () => {
      // 半透明黑色覆盖，产生拖尾效果
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.type === "glitter" ? 0.02 : 0.06; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        // Glitter flickering effect
        if (p.flicker && Math.random() > 0.5) {
          ctx.globalAlpha = p.alpha * 0.3;
        } else {
          ctx.globalAlpha = p.alpha;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Dynamic glow based on type
        if (p.type !== "glitter" || Math.random() > 0.8) {
          ctx.shadowBlur = p.type === "ring" ? 12 : 6;
          ctx.shadowColor = p.color;
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // 控制粒子数量，避免过多
      if (particles.current.length < 800 && Math.random() < 0.05) {
        createFirework(
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.6,
        );
      }

      animationFrameId.current = requestAnimationFrame(update);
    };

    window.addEventListener("resize", resize);
    resize();
    update();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [createFirework]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
};

export default Fireworks;
