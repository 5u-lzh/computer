import React from 'react';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../common/NeonButton';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-6">
        <h1 className="font-headline-xl text-headline-xl text-primary animate-text-glitch select-none" style={{ fontSize: 'clamp(80px, 20vw, 160px)', lineHeight: 1 }}>
          404
        </h1>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      </div>

      <div className="font-label-sm text-label-sm text-secondary-fixed-dim tracking-[0.2em] mb-3 animate-glow-pulse select-none">
        SYSTEM ERROR
      </div>

      <p className="text-on-surface-variant/60 body-md max-w-md mb-10">
        THE PAGE YOU&apos;RE LOOKING FOR HAS BEEN LOST IN THE MATRIX
      </p>

      <NeonButton variant="primary" icon="home" onClick={() => navigate('/')}>
        返回首页
      </NeonButton>
    </div>
  );
}
