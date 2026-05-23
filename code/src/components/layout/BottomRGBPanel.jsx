import React from 'react';
import { useRGB } from '../../context/RGBContext';

const COLOR_SWATCHES = [
  { color: '#d0bcff', label: '紫色' },
  { color: '#00dbe7', label: '冰蓝' },
  { color: '#ffb2b8', label: '粉红' },
  { color: '#ff506e', label: '焰红' },
];

export default function BottomRGBPanel() {
  const { color, mode, brightness, setMode, setColor, setBrightness, RGB_MODES } = useRGB();

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex items-center justify-center px-4 lg:px-8 py-2.5 h-20 bg-surface-container-lowest/70 backdrop-blur-2xl border-t border-secondary/20 shadow-[0_-4px_20px_rgba(0,219,231,0.12)]">
      <div className="flex items-center gap-3 lg:gap-5 flex-wrap justify-center">
        {/* 灯效模式 */}
        <div className="flex items-center gap-1.5">
          <span className="font-label-sm text-[10px] text-secondary-fixed-dim/60 uppercase hidden sm:block mr-0.5 tracking-wider">
            RGB Sync
          </span>
          {RGB_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
                ${mode === m.id
                  ? 'bg-secondary/10 text-secondary-fixed-dim shadow-[0_0_10px_rgba(0,219,231,0.3)]'
                  : 'text-on-surface-variant/50 hover:text-secondary hover:bg-white/[0.03]'
                }
              `}
              aria-label={m.label}
              aria-pressed={mode === m.id}
            >
              <span className="material-symbols-outlined text-lg">{m.icon}</span>
              <span className="font-label-sm text-[9px] mt-0.5 leading-none">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-white/[0.06]" />

        {/* 颜色色块 */}
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-[10px] text-secondary-fixed-dim/60 uppercase hidden sm:block mr-0.5 tracking-wider">
            Color
          </span>
          {COLOR_SWATCHES.map((s) => (
            <button
              key={s.color}
              onClick={() => setColor(s.color)}
              className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                color === s.color
                  ? 'border-white/50 shadow-[0_0_8px_var(--swatch-color)] scale-110'
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{ backgroundColor: s.color, '--swatch-color': s.color }}
              aria-label={s.label}
            />
          ))}
        </div>

        <div className="h-8 w-px bg-white/[0.06]" />

        {/* 亮度 */}
        <div className="flex items-center gap-2 hidden lg:flex">
          <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant/60 mb-0.5 gap-2">
            <span>BRIGHTNESS</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-24 h-1 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-secondary-fixed-dim
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary-fixed-dim [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,219,231,0.4)]
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-secondary-fixed-dim [&::-moz-range-thumb]:border-0"
            aria-label="亮度控制"
          />
          <span className="font-label-sm text-[10px] text-secondary-fixed-dim/70 w-8 tabular-nums">{brightness}%</span>
        </div>
      </div>
    </footer>
  );
}
