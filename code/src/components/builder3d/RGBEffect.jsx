import React, { createContext, useContext, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRGB } from '../../context/RGBContext';

const RGBAnimContext = createContext(null);

const CYCLE_COLORS = ['#d0bcff', '#00dbe7', '#ffb2b8', '#ff506e', '#00ff88', '#ffd700'];

function lerpHex(c1, c2, t) {
  const r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
  const toHex = n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${toHex(r1 + (r2 - r1) * t)}${toHex(g1 + (g2 - g1) * t)}${toHex(b1 + (b2 - b1) * t)}`;
}

/**
 * 将 RGB 上下文中的 mode/brightness 转化为逐帧动画颜色和亮度
 * 必须放在 @react-three/fiber <Canvas> 内部使用
 */
export function RGBAnimProvider({ children }) {
  const { color: baseColor, mode, brightness } = useRGB();
  const [color, setColor] = useState(baseColor);
  const [intensity, setIntensity] = useState(brightness / 100);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const b = brightness / 100;
    let c = baseColor;
    let i = b;

    switch (mode) {
      case 'static':
        c = baseColor;
        i = b;
        break;
      case 'pulse':
        i = b * (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 2.5)));
        c = baseColor;
        break;
      case 'strobe':
        i = Math.sin(t * 12) > 0.3 ? b : b * 0.02;
        c = baseColor;
        break;
      case 'cycle': {
        const speed = 0.4;
        const idx = Math.floor((t * speed) % CYCLE_COLORS.length);
        const nxt = (idx + 1) % CYCLE_COLORS.length;
        c = lerpHex(CYCLE_COLORS[idx], CYCLE_COLORS[nxt], (t * speed) % 1);
        i = b;
        break;
      }
    }

    setColor(c);
    setIntensity(i);
  });

  return (
    <RGBAnimContext.Provider value={{ color, intensity }}>
      {children}
    </RGBAnimContext.Provider>
  );
}

export function useRGBAnim() {
  const ctx = useContext(RGBAnimContext);
  if (!ctx) return { color: '#d0bcff', intensity: 1 };
  return ctx;
}
