export interface Greeting {
  id: number;
  text: string;
  subText: string;
  artist: string;
  // 样式配置
  color: string; // 主文字颜色
  glowColor: string; // 发光颜色
  fontStyle: "brush" | "cao" | "xing" | "kai"; // 字体风格：草书、狂草、行书、行楷
  // 动画配置
  animation:
    | "fadeUp"
    | "fadeDown"
    | "scaleIn"
    | "slideLeft"
    | "slideRight"
    | "rotate"
    | "blur"
    | "bounce";
}

export interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  size: number;
}
