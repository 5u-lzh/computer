import React, { useRef, useState } from 'react';

function Ripple({ x, y, size }) {
  return (
    <span
      className="absolute rounded-full pointer-events-none animate-ripple"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        background: 'rgba(255,255,255,0.2)',
      }}
    />
  );
}

export default function NeonButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
}) {
  const btnRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples(r => [...r, { id, x, y, size }]);
      setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 600);
    }
    onClick?.(e);
  };

  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background overflow-hidden relative';

  const variants = {
    primary:
      'bg-primary text-on-primary shadow-[0_0_15px_rgba(208,188,255,0.3)] hover:animate-neon-pulse hover:brightness-110 active:brightness-95 active:scale-[0.97]',
    secondary:
      'bg-transparent border border-secondary/40 text-secondary hover:bg-secondary/10 hover:border-secondary/60 hover:shadow-[0_0_15px_rgba(0,219,231,0.2)] active:scale-[0.97]',
    danger:
      'bg-tertiary-container text-on-tertiary shadow-[0_0_15px_rgba(255,80,110,0.3)] hover:shadow-[0_0_25px_rgba(255,80,110,0.5)] hover:brightness-110 active:brightness-95 active:scale-[0.97]',
    ghost:
      'bg-transparent text-on-surface-variant/60 hover:text-primary hover:bg-white/[0.04] border border-white/[0.06] active:scale-[0.97]',
  };

  const sizes = {
    sm: 'text-label-sm px-3.5 py-2 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 min-h-[44px]',
    lg: 'text-sm px-7 py-3 min-h-[48px]',
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'} ${className}`}
      aria-disabled={disabled}
    >
      {ripples.map(r => <Ripple key={r.id} x={r.x} y={r.y} size={r.size} />)}
      {icon && <span className="material-symbols-outlined text-[inherit] relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
