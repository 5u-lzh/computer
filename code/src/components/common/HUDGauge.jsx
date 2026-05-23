import React from 'react';

export default function HUDGauge({
  label,
  value,
  max = 100,
  unit = '',
  color = 'primary',
  className = '',
  showPercent = true,
  pulse = false,
}) {
  const percent = Math.min((value / max) * 100, 100);
  const colorClass = color === 'ice'
    ? 'bg-secondary-fixed-dim shadow-[0_0_6px_rgba(0,219,231,0.4)]'
    : color === 'pink'
      ? 'bg-tertiary-container shadow-[0_0_6px_rgba(255,80,110,0.4)]'
      : 'bg-primary shadow-[0_0_6px_rgba(208,188,255,0.4)]';

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-label-sm text-label-sm text-on-surface-variant/60 uppercase tracking-wider">{label}</span>
        <span className="font-label-sm text-label-sm text-secondary-fixed-dim/80 tabular-nums font-mono">
          {value}{unit}
          {showPercent && (
            <span className="text-on-surface-variant/40 ml-0.5">
              ({Math.round(percent)}%)
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 bg-surface-container-highest/80 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass} ${pulse ? 'animate-pulse' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
