import React from 'react';

export default function GlassPanel({
  children,
  className = '',
  glow = false,
  glowColor = 'violet',
  padded = true,
  onClick,
  blur = 'md',
}) {
  const blurClass = blur === 'sm'
    ? 'backdrop-blur-sm'
    : blur === 'lg'
      ? 'backdrop-blur-lg'
      : blur === 'xl'
        ? 'backdrop-blur-xl'
        : 'backdrop-blur-md';

  const glowClass = glow
    ? glowColor === 'ice'
      ? 'neon-ice'
      : glowColor === 'pink'
        ? 'neon-pink'
        : 'neon-violet'
    : 'border-white/[0.06]';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      className={`
        ${blurClass} rounded-xl border bg-surface-container-low/40
        ${glowClass}
        ${padded ? 'p-4 md:p-5' : ''}
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
