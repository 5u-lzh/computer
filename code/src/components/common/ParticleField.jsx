import { useEffect, useRef } from 'react';

const COLORS = ['#d0bcff', '#00dbe7', '#ff506e'];

function createParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: 1.5 + Math.random() * 1.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.15 + Math.random() * 0.25,
  };
}

export default function ParticleField({ density = 60, className = '' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const reducedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const checkReducedMotion = () => {
      reducedRef.current = document.documentElement.classList.contains('reduce-motion');
    };
    checkReducedMotion();

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { width: w, height: h };
      canvas.width = w;
      canvas.height = h;
      // Re-create particles to fill the new size
      particlesRef.current = Array.from({ length: density }, () => createParticle(w, h));
    };
    resize();

    // Observe reduce-motion changes on <html>
    const mo = new MutationObserver(checkReducedMotion);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    let running = true;

    const loop = () => {
      if (!running) return;
      animRef.current = requestAnimationFrame(loop);

      if (reducedRef.current) return;

      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with 50px buffer
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    loop();

    window.addEventListener('resize', resize);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      mo.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
