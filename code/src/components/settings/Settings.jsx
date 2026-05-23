import React, { useState, useEffect } from 'react';
import { useRGB } from '../../context/RGBContext';
import NeonButton from '../common/NeonButton';

function SettingSection({ title, icon, children }) {
  return (
    <section className="bg-surface-container-low/40 backdrop-blur-md rounded-xl border border-white/[0.06] p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-sm">{icon}</span>
        <h2 className="font-headline-md text-headline-md text-primary font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0 border-b border-white/[0.04] last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <div className="font-medium text-sm text-on-surface">{label}</div>
        {desc && <div className="font-label-sm text-label-sm text-on-surface-variant/50 mt-0.5">{desc}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
        checked ? 'bg-primary/40' : 'bg-surface-container-highest'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-md ${
          checked ? 'translate-x-5 bg-primary' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { color, mode, brightness, selectPreset, setMode, setBrightness, COLOR_PRESETS, RGB_MODES } = useRGB();

  // 动画偏好
  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('core-build-reduced-motion') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('core-build-reduced-motion', reducedMotion);
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2 uppercase tracking-widest">
          设置
        </h1>
        <p className="text-on-surface-variant/70 font-body-lg">自定义你的装机体验</p>
      </div>

      <div className="space-y-5">
        {/* RGB 灯效 */}
        <SettingSection title="RGB 灯效" icon="palette">
          {/* 默认配色 */}
          <SettingRow label="默认配色" desc="底部灯带和控制面板的默认颜色">
            <div className="flex gap-1.5">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => selectPreset(preset.value)}
                  className={`rounded-full border-2 transition-all duration-200 ${
                    color === preset.value
                      ? 'border-white scale-110 shadow-[0_0_8px_var(--tw-shadow-color)]'
                      : 'border-white/20 hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: preset.value,
                    width: color === preset.value ? '22px' : '18px',
                    height: color === preset.value ? '22px' : '18px',
                    boxShadow: color === preset.value ? `0 0 10px ${preset.value}80` : 'none',
                  }}
                  title={preset.name}
                  aria-label={preset.name}
                />
              ))}
            </div>
          </SettingRow>

          {/* 灯效模式 */}
          <SettingRow label="灯效模式" desc="默认的 RGB 灯光动态效果">
            <div className="flex gap-1">
              {RGB_MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    mode === m.id
                      ? 'bg-secondary/10 text-secondary-fixed-dim border border-secondary/20'
                      : 'text-on-surface-variant/50 hover:text-on-surface-variant border border-transparent'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* 亮度 */}
          <SettingRow label="默认亮度" desc="RGB 灯光的初始亮度 (0-100)">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">brightness_low</span>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-24 h-1 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-secondary-fixed-dim
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary-fixed-dim [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(0,219,231,0.4)]"
                aria-label="亮度"
              />
              <span className="font-label-sm text-label-sm text-secondary-fixed-dim/70 w-8 tabular-nums">{brightness}%</span>
            </div>
          </SettingRow>
        </SettingSection>

        {/* 显示选项 */}
        <SettingSection title="显示选项" icon="visibility">
          <SettingRow
            label="减少动画"
            desc="关闭部分装饰性动画效果，提升性能"
          >
            <Toggle checked={reducedMotion} onChange={setReducedMotion} />
          </SettingRow>
        </SettingSection>

        {/* 关于 */}
        <SettingSection title="关于" icon="info">
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-on-surface-variant/70">应用名称</span>
              <span className="text-sm text-on-surface font-medium">装机大神</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-on-surface-variant/70">版本</span>
              <span className="text-sm text-on-surface font-medium">v1.0.0</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-on-surface-variant/70">技术栈</span>
              <span className="text-sm text-on-surface font-medium">React + Three.js + Tailwind</span>
            </div>
          </div>
        </SettingSection>
      </div>
    </div>
  );
}
