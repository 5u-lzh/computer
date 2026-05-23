import React from 'react';

export default function StatusChip({ children, variant = 'default', className = '', icon, pulse }) {
  const variants = {
    default: 'bg-surface-variant/60 text-on-surface-variant/70 border-white/[0.08]',
    primary: 'bg-primary/15 text-primary border-primary/25',
    ice: 'bg-secondary/10 text-secondary-fixed-dim border-secondary/25',
    success: 'bg-green-500/15 text-green-400 border-green-500/25',
    warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    error: 'bg-tertiary-container/20 text-tertiary border-tertiary-container/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-label-sm text-[10px] px-2.5 py-1 rounded-lg border tracking-wider uppercase ${variants[variant] || variants.default} ${pulse ? 'animate-glow-pulse' : ''} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[inherit] text-[10px]">{icon}</span>}
      {children}
    </span>
  );
}
