import React from 'react';
import { getScoreTier } from '../../utils/benchmark';

export default function ScoreGauge({ score, running }) {
  const tier = getScoreTier(score);

  const radius = 150;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / 2000000, 1);
  const offset = circumference * (1 - progress);

  // 装饰粒子
  const particles = [
    { cx: 80, cy: 60, r: 1.5, dur: '3s' },
    { cx: 260, cy: 50, r: 1, dur: '4s' },
    { cx: 300, cy: 200, r: 1.5, dur: '2.5s' },
    { cx: 40, cy: 250, r: 1, dur: '3.5s' },
    { cx: 170, cy: 30, r: 1.2, dur: '4.5s' },
  ];

  return (
    <div className="relative w-[340px] h-[340px] flex items-center justify-center mx-auto">
      {/* 装饰外环 */}
      <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.04] animate-spin-slower" />
      <div className="absolute inset-3 rounded-full border border-white/[0.03]" />
      <div className="absolute inset-6 rounded-full border border-secondary/5" />

      {/* SVG 仪表 */}
      <svg className="absolute inset-5 w-[300px] h-[300px] -rotate-90">
        {/* 底色环 */}
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke="rgba(53, 52, 54, 0.6)"
          strokeWidth="10"
        />
        {/* 分值进度环 */}
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke={tier.color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={running ? offset : score > 0 ? offset : circumference}
          className="transition-all duration-[2000ms] ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${tier.color}80)` }}
        />
        {/* 装饰点 */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const cx = 150 + Math.cos(rad) * 140;
          const cy = 150 + Math.sin(rad) * 140;
          return (
            <circle key={angle} cx={cx} cy={cy} r="2" fill="rgba(0, 219, 231, 0.3)" />
          );
        })}
      </svg>

      {/* 浮动粒子 */}
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill="rgba(208, 188, 255, 0.3)"
          className="absolute"
          style={{
            animation: `fadeIn ${p.dur} ease-in-out infinite`,
            opacity: 0,
          }}
        />
      ))}

      {/* 中心分数 */}
      <div className="z-20 text-center">
        <div className="font-label-sm text-label-sm text-secondary-fixed-dim/60 tracking-[0.25em] uppercase mb-2">
          {running ? '测试中...' : 'Performance Score'}
        </div>
        <div className="font-headline-xl text-headline-xl text-on-background drop-shadow-[0_0_20px_rgba(229,226,227,0.3)] transition-all duration-1000 tabular-nums tracking-tighter">
          {running ? (
            <span className="animate-pulse text-primary">RUNNING</span>
          ) : score > 0 ? (
            score.toLocaleString()
          ) : (
            <span className="text-on-surface-variant/20">---</span>
          )}
        </div>
        {score > 0 && !running && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="material-symbols-outlined text-sm" style={{ color: tier.color }}>{tier.icon}</span>
            <span className="font-label-sm text-label-sm tracking-wider" style={{ color: tier.color }}>{tier.label}</span>
          </div>
        )}
      </div>

      {/* 测试中粒子动画 */}
      {running && (
        <div className="absolute w-3 h-3 bg-white rounded-full blur-[3px] animate-ping" />
      )}
    </div>
  );
}
