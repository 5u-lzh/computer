import React from 'react';

function Skeleton({ variant = 'text', width, height, className = '', ...rest }) {
  const base = 'shimmer-bg rounded-lg';

  if (variant === 'circle') {
    const size = rest.size || 40;
    return (
      <div
        className={`${base} rounded-full ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'card') {
    return <Skeleton.Card />;
  }

  if (variant === 'rect') {
    return (
      <div
        className={`${base} ${className}`}
        style={{ width: width || 200, height: height || 120 }}
        aria-hidden="true"
      />
    );
  }

  // text variant (default)
  return (
    <div
      className={`${base} ${className}`}
      style={{ width: width || '100%', height: height || 14 }}
      aria-hidden="true"
    />
  );
}

Skeleton.Card = function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-2xl bg-surface-container-low/40 border border-white/[0.06] overflow-hidden ${className}`} aria-hidden="true">
      {/* image area */}
      <div className="h-52 shimmer-bg" />
      {/* content */}
      <div className="p-4 pt-3 space-y-3">
        <div className="h-5 shimmer-bg rounded-lg w-3/4" />
        <div className="space-y-2">
          {[90, 70, 85, 60, 75, 65].map((w, i) => (
            <div key={i} className="h-3 shimmer-bg rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="pt-3 border-t border-white/[0.05]">
          <div className="h-6 shimmer-bg rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
};

Skeleton.Text = function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-3 shimmer-bg rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
};

export default Skeleton;
