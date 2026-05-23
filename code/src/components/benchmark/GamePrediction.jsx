import React, { useState } from 'react';

const GAME_IMAGES = {
  '赛博朋克 2077': '/images/games/cyberpunk.png',
  '黑神话：悟空': '/images/games/wukong.png',
  '绝地求生': '/images/games/pubg.png',
  'Valorant': '/images/games/valorant.png',
  '艾尔登法环': '/images/games/eldenring.png',
};

const GAMES = [
  { name: '赛博朋克 2077', fhd: 120, qhd: 85, uhd: 45 },
  { name: '黑神话：悟空', fhd: 100, qhd: 70, uhd: 35 },
  { name: '绝地求生', fhd: 200, qhd: 150, uhd: 90 },
  { name: 'Valorant', fhd: 450, qhd: 380, uhd: 250 },
  { name: '艾尔登法环', fhd: 60, qhd: 55, uhd: 30 },
];

function GamePhotoCard({ game, index }) {
  const [loaded, setLoaded] = useState(false);
  const imgSrc = GAME_IMAGES[game.name];
  const fpsEntries = [
    { label: '1080P', value: game.fhd },
    { label: '2K', value: game.qhd },
    { label: '4K', value: game.uhd },
  ];
  const maxFPS = Math.max(game.fhd || 0, game.qhd || 0, game.uhd || 0);

  return (
    <div className="relative group shrink-0 w-[220px] lg:w-[240px] rounded-xl overflow-hidden border border-white/[0.06] transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.06]">
      {/* 游戏照片背景 */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src={imgSrc}
          alt={game.name}
          className="w-full h-full object-cover"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* 加载占位 */}
      {!loaded && <div className="absolute inset-0 shimmer-bg" />}

      {/* 暗黑渐变叠加层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-[#030308]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030308]/30 to-transparent" />

      {/* Hover 光晕 */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.05] to-transparent" />

      {/* 编号 */}
      <div className="absolute top-3 left-3 z-10">
        <span className="font-mono text-[10px] text-white/20 font-bold tracking-widest">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h4 className="font-bold text-sm text-white/90 mb-2 drop-shadow-lg tracking-wide">{game.name}</h4>
        <div className="flex gap-1.5">
          {fpsEntries.map((entry) => {
            const pct = maxFPS > 0 ? (entry.value / maxFPS) * 100 : 0;
            const isHighest = entry.value === maxFPS;
            return (
              <div
                key={entry.label}
                className={`px-2 py-1 rounded-md text-[10px] font-bold border backdrop-blur-sm transition-all duration-300
                  ${isHighest
                    ? 'bg-primary/20 border-primary/30 text-primary shadow-[0_0_6px_rgba(208,188,255,0.12)]'
                    : 'bg-white/[0.04] border-white/[0.06] text-white/50'
                  }`}
              >
                <span className="mr-1 opacity-60">{entry.label}</span>
                <span className="tabular-nums">{entry.value}</span>
                <span className="text-[8px] ml-0.5 opacity-40">FPS</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 尺寸占位 */}
      <div className="w-full" style={{ aspectRatio: '16/9' }} />
    </div>
  );
}

export default function GamePrediction({ fpsData }) {
  const games = fpsData || GAMES;

  return (
    <section className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">sports_esports</span>
          <h3 className="font-headline-md text-headline-md text-primary font-semibold">游戏实测</h3>
        </div>
        <span className="font-label-sm text-[10px] text-on-surface-variant/40 px-2 py-0.5 border border-white/[0.06] rounded-md">GALLERY</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mb-2 scrollbar-thin">
        {games.map((game, i) => (
          <GamePhotoCard key={game.name} game={game} index={i} />
        ))}
      </div>
    </section>
  );
}
