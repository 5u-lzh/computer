import React from 'react';

const THEMES = {
  violet: { primary: '#d0bcff', secondary: '#a078ff', accent: '#7c4dff', glow: 'rgba(208,188,255,0.5)', bg1: '#0d0a1a', bg2: '#16102e', board: '#1a1040', highlight: '#b388ff' },
  ice: { primary: '#00dbe7', secondary: '#74f5ff', accent: '#00f1fe', glow: 'rgba(0,219,231,0.5)', bg1: '#0a0d14', bg2: '#0d1a24', board: '#0f1a2e', highlight: '#4dd0e1' },
  pink: { primary: '#ff506e', secondary: '#ffb2b8', accent: '#ff8099', glow: 'rgba(255,80,110,0.5)', bg1: '#1a0a0e', bg2: '#2e1018', board: '#2e0a14', highlight: '#ff6080' },
};

function P({ x1, y1, x2, y2 }) {
  return <polyline points={`${x1},${y1} ${x2},${y2}`} fill="none" stroke="#d0bcff" strokeWidth="0.3" strokeOpacity="0.08" />;
}

export default function CyberpunkPCImage({ theme = 'violet', className = '' }) {
  const c = THEMES[theme] || THEMES.violet;
  const subtext = theme === 'violet' ? '// PHANTOM ARCHITECT //' : theme === 'ice' ? '// CRYO PROTOCOL //' : '// CORE FREQUENCY //';

  const animateProps = { attributeName: 'fillOpacity', values: '0.5;0.9;0.5', dur: '2s', repeatCount: 'indefinite' };
  const animateQuick = { attributeName: 'fillOpacity', values: '0.6;1;0.6', dur: '1.2s', repeatCount: 'indefinite' };

  return (
    <svg viewBox="0 0 800 560" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bg-${theme}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={c.bg2} stopOpacity="1" />
          <stop offset="100%" stopColor={c.bg1} stopOpacity="1" />
        </radialGradient>
        <radialGradient id={`cg-${theme}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={c.glow} stopOpacity="0.15" />
          <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glass-${theme}`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.10" />
          <stop offset="40%" stopColor={c.primary} stopOpacity="0.04" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`strip-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.9" />
          <stop offset="50%" stopColor={c.accent} stopOpacity="1" />
          <stop offset="100%" stopColor={c.secondary} stopOpacity="0.9" />
        </linearGradient>
        <filter id={`glow-${theme}`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="560" fill={`url(#bg-${theme})`} />

      {/* Grid */}
      <g opacity="0.04" stroke={c.primary} strokeWidth="0.5">
        {Array.from({ length: 28 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 20} x2="800" y2={i * 20} />)}
        {Array.from({ length: 40 }, (_, i) => <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="560" />)}
      </g>

      {/* Ambient glow */}
      <ellipse cx="400" cy="300" rx="300" ry="200" fill={`url(#cg-${theme})`} />

      {/* Desk */}
      <rect x="0" y="490" width="800" height="12" rx="3" fill="#121116" stroke="#2a282a" strokeWidth="0.5" />
      <rect x="0" y="490" width="800" height="2" fill={c.primary} opacity="0.06" />

      {/* Main Case */}
      <g transform="translate(160, 50)">
        {/* Case body */}
        <rect x="0" y="0" width="480" height="430" rx="8" fill="#0d0c0f" stroke={c.primary} strokeWidth="1.2" strokeOpacity="0.2" />
        <rect x="8" y="8" width="464" height="414" rx="4" fill="#0a090c" />

        {/* Motherboard tray */}
        <rect x="35" y="40" width="280" height="280" rx="4" fill={c.board} fillOpacity="0.5" stroke={c.primary} strokeWidth="0.5" strokeOpacity="0.15" />

        {/* CPU Socket */}
        <rect x="60" y="70" width="90" height="90" rx="3" fill={c.bg1} stroke={c.primary} strokeWidth="1" strokeOpacity="0.3" />
        <rect x="60" y="70" width="90" height="90" rx="3" fill={c.primary} fillOpacity="0.04" />
        <rect x="72" y="82" width="66" height="66" rx="2" fill={c.primary} fillOpacity="0.06" stroke={c.primary} strokeWidth="0.5" strokeOpacity="0.2" />
        <rect x="78" y="88" width="54" height="54" rx="1" fill={c.primary} fillOpacity="0.08">
          <animate attributeName="fillOpacity" values="0.08;0.18;0.08" dur="3s" repeatCount="indefinite" />
        </rect>
        <text x="105" y="130" textAnchor="middle" fill={c.primary} fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.5">LGA</text>

        {/* AIO tubes */}
        <line x1="75" y1="70" x2="60" y2="25" stroke={c.accent} strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="135" y1="70" x2="145" y2="25" stroke={c.secondary} strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
        <line x1="75" y1="70" x2="60" y2="25" stroke={c.accent} strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
        <line x1="135" y1="70" x2="145" y2="25" stroke={c.secondary} strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />

        {/* Water block */}
        <rect x="65" y="55" width="80" height="15" rx="4" fill={c.bg1} stroke={c.primary} strokeWidth="0.8" strokeOpacity="0.4" />
        <rect x="70" y="57" width="70" height="11" rx="2" fill="#050508" stroke={c.accent} strokeWidth="0.5" strokeOpacity="0.5" />
        {/* LCD pulse */}
        <rect x="72" y="59" width="8" height="7" rx="1" fill={c.accent} opacity="0.8">
          <animate attributeName="width" values="8;20;8" dur="1.5s" repeatCount="indefinite" />
        </rect>
        <rect x="84" y="59" width="12" height="7" rx="1" fill={c.secondary} opacity="0.5">
          <animate attributeName="width" values="12;6;12" dur="1.2s" repeatCount="indefinite" />
        </rect>
        <rect x="100" y="59" width="6" height="7" rx="1" fill={c.primary} opacity="0.6">
          <animate attributeName="width" values="6;14;6" dur="1.8s" repeatCount="indefinite" />
        </rect>
        <rect x="60" y="48" width="90" height="5" rx="2" fill={c.primary} fillOpacity="0.15" />

        {/* RAM */}
        <g transform="translate(155, 75)">
          <rect x="0" y="0" width="8" height="60" rx="1" fill={c.bg1} stroke={c.primary} strokeWidth="0.5" strokeOpacity="0.2" />
          <rect x="0" y="0" width="8" height="60" rx="1" fill={c.primary} fillOpacity="0.05" />
          <rect x="1" y="2" width="6" height="15" rx="1" fill={c.primary} fillOpacity="0.5" filter={`url(#glow-${theme})`}>
            <animate {...animateProps} />
          </rect>
          <rect x="1" y="20" width="6" height="10" rx="0.5" fill={c.primary} fillOpacity="0.15" />
          <rect x="1" y="32" width="6" height="10" rx="0.5" fill={c.primary} fillOpacity="0.15" />
          <rect x="1" y="44" width="6" height="10" rx="0.5" fill={c.primary} fillOpacity="0.15" />
          {/* 2nd stick */}
          <rect x="12" y="5" width="8" height="55" rx="1" fill={c.bg1} stroke={c.secondary} strokeWidth="0.5" strokeOpacity="0.2" />
          <rect x="12" y="5" width="8" height="55" rx="1" fill={c.secondary} fillOpacity="0.03" />
          <rect x="13" y="7" width="6" height="15" rx="1" fill={c.secondary} fillOpacity="0.5" filter={`url(#glow-${theme})`}>
            <animate attributeName="fillOpacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="13" y="25" width="6" height="10" rx="0.5" fill={c.secondary} fillOpacity="0.15" />
          <rect x="13" y="37" width="6" height="10" rx="0.5" fill={c.secondary} fillOpacity="0.15" />
          <rect x="13" y="49" width="6" height="5" rx="0.5" fill={c.secondary} fillOpacity="0.15" />
        </g>

        {/* GPU */}
        <g transform="translate(50, 180)">
          <rect x="0" y="0" width="230" height="55" rx="3" fill="#0f080a" stroke="#ff506e" strokeWidth="1" strokeOpacity="0.4" />
          <rect x="5" y="5" width="220" height="45" rx="2" fill="none" stroke={c.primary} strokeWidth="0.3" strokeOpacity="0.1" />
          {Array.from({ length: 20 }, (_, i) => (
            <line key={i} x1={10 + i * 11} y1="10" x2={10 + i * 11} y2="45" stroke={c.primary} strokeWidth="0.3" strokeOpacity="0.08" />
          ))}
          <text x="115" y="32" textAnchor="middle" fill="#ff506e" fontSize="14" fontWeight="bold" fontFamily="monospace" letterSpacing="4" filter={`url(#glow-${theme})`}>RTX</text>
          <rect x="0" y="52" width="230" height="3" rx="1.5" fill="#ff506e" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </rect>
          <circle cx="40" cy="27" r="14" fill="none" stroke="#ff506e" strokeWidth="0.5" strokeOpacity="0.2" />
          <circle cx="40" cy="27" r="8" fill="none" stroke="#ff506e" strokeWidth="0.5" strokeOpacity="0.3">
            <animateTransform attributeName="transform" type="rotate" from="0 40 27" to="360 40 27" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="190" cy="27" r="14" fill="none" stroke="#ff506e" strokeWidth="0.5" strokeOpacity="0.2" />
          <circle cx="190" cy="27" r="8" fill="none" stroke="#ff506e" strokeWidth="0.5" strokeOpacity="0.3">
            <animateTransform attributeName="transform" type="rotate" from="360 190 27" to="0 190 27" dur="4s" repeatCount="indefinite" />
          </circle>
          <rect x="215" y="18" width="12" height="20" rx="1" fill="#1a1a2e" stroke="#353436" strokeWidth="0.5" />
        </g>

        {/* Bottom fans x3 */}
        {[0, 1, 2].map((i) => {
          const fx = 70 + i * 100;
          const fy = 360;
          return (
            <g key={i}>
              <circle cx={fx} cy={fy} r="38" fill={c.primary} fillOpacity="0.04" />
              <circle cx={fx} cy={fy} r="34" fill="#0a090c" stroke={c.primary} strokeWidth="0.8" strokeOpacity="0.2" />
              <circle cx={fx} cy={fy} r="26" fill="none" stroke={c.primary} strokeWidth="3" strokeOpacity="0.5" filter={`url(#glow-${theme})`}>
                <animate attributeName="strokeOpacity" values="0.5;0.9;0.5" dur="1.8s" begin={`${i * 0.3}`} repeatCount="indefinite" />
              </circle>
              <g>
                <animateTransform attributeName="transform" type="rotate" from={`0 ${fx} ${fy}`} to={`360 ${fx} ${fy}`} dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
                {[0, 1, 2, 3, 4, 5, 6].map((j) => {
                  const angle = j * (360 / 7);
                  const rad = (angle * Math.PI) / 180;
                  return <line key={j} x1={fx} y1={fy} x2={fx + Math.cos(rad) * 22} y2={fy + Math.sin(rad) * 22} stroke={c.primary} strokeWidth="3.5" strokeOpacity="0.25" strokeLinecap="round" />;
                })}
              </g>
              <circle cx={fx} cy={fy} r="5" fill={c.bg1} stroke={c.primary} strokeWidth="0.5" strokeOpacity="0.4" />
              <circle cx={fx} cy={fy} r="2" fill={c.primary} fillOpacity="0.8">
                <animate attributeName="fillOpacity" values="0.8;1;0.8" dur="1s" begin={`${i * 0.5}`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* PSU area */}
        <g transform="translate(330, 60)">
          <rect x="0" y="0" width="130" height="350" rx="3" fill={c.primary} fillOpacity="0.02" stroke={c.primary} strokeWidth="0.5" strokeOpacity="0.08" />
          <rect x="15" y="230" width="100" height="95" rx="3" fill="#0d0c12" stroke={c.secondary} strokeWidth="0.5" strokeOpacity="0.2" />
          <circle cx="65" cy="270" r="25" fill="none" stroke={c.secondary} strokeWidth="0.5" strokeOpacity="0.15" />
          <circle cx="65" cy="270" r="12" fill={c.secondary} fillOpacity="0.04" />
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 65 270" to="360 65 270" dur="5s" repeatCount="indefinite" />
            {[0, 1, 2, 3].map((j) => {
              const rad = (j * 90 * Math.PI) / 180;
              return <line key={j} x1="65" y1="270" x2={65 + Math.cos(rad) * 18} y2={270 + Math.sin(rad) * 18} stroke={c.secondary} strokeWidth="2" strokeOpacity="0.12" strokeLinecap="round" />;
            })}
          </g>
          <rect x="25" y="300" width="80" height="12" rx="1" fill={c.primary} fillOpacity="0.04" />
          <text x="65" y="309" textAnchor="middle" fill={c.primary} fontSize="5" opacity="0.2" fontFamily="monospace">1200W GOLD</text>
          <rect x="55" y="30" width="8" height="180" rx="4" fill={c.primary} fillOpacity="0.04" stroke={c.primary} strokeWidth="0.3" strokeOpacity="0.1" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="52" y={40 + i * 38} width="14" height="4" rx="2" fill={c.primary} fillOpacity="0.12" />
          ))}
        </g>

        {/* Bottom LED strip */}
        <rect x="10" y="420" width="460" height="3" rx="1.5" fill={`url(#strip-${theme})`} filter={`url(#glow-${theme})`}>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" />
        </rect>

        {/* I/O panel */}
        <rect x="320" y="15" width="60" height="18" rx="2" fill="#121116" stroke={c.primary} strokeWidth="0.3" strokeOpacity="0.2" />
        <circle cx="335" cy="24" r="2" fill="#ff506e" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="345" cy="24" r="2" fill={c.primary} opacity="0.4" />
        <rect x="355" y="22" width="12" height="4" rx="1" fill={c.primary} fillOpacity="0.2" />
        <rect x="370" y="22" width="5" height="4" rx="1" fill={c.primary} fillOpacity="0.2" />

        {/* Glass reflection */}
        <rect x="8" y="8" width="464" height="414" rx="4" fill={`url(#glass-${theme})`} />
        <rect x="8" y="8" width="2" height="414" rx="1" fill="white" fillOpacity="0.05" />

        {/* Logo */}
        <text x="460" y="435" textAnchor="end" fill={c.primary} fontSize="7" opacity="0.15" fontFamily="monospace" letterSpacing="3">装机大神</text>
      </g>

      {/* Floating particles */}
      <circle cx="200" cy="80" r="2" fill={c.accent}><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="650" cy="120" r="1.5" fill={c.primary}><animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" /></circle>
      <circle cx="150" cy="450" r="1" fill={c.secondary}><animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" /></circle>
      <circle cx="600" cy="400" r="1.5" fill={c.accent}><animate attributeName="opacity" values="0;0.6;0" dur="5s" repeatCount="indefinite" /></circle>
      <circle cx="700" cy="200" r="1" fill={c.primary}><animate attributeName="opacity" values="0;0.7;0" dur="3.5s" repeatCount="indefinite" /></circle>

      {/* Footer text */}
      <text x="400" y="540" textAnchor="middle" fill={c.primary} fontSize="9" opacity="0.08" fontFamily="monospace" letterSpacing="6">{subtext}</text>
    </svg>
  );
}
