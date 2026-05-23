import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuild } from '../../context/BuildContext';

const categoryIcons = {
  cpu: 'memory',
  gpu: 'videogame_asset',
  memory: 'storage',
  motherboard: 'developer_board',
  storage: 'hard_drive',
  psu: 'bolt',
  cooler: 'ac_unit',
  case: 'dns',
};

const IMAGE_MAP = {
  violet: '/images/build-violet.png',
  ice: '/images/build-ice.png',
  pink: '/images/build-pink-v2.png',
};

export default function BuildCard({ build, glowColor = 'violet' }) {
  const navigate = useNavigate();
  const { loadBuild } = useBuild();

  const handleClone = () => {
    const buildData = {};
    for (const [category, part] of Object.entries(build.parts)) {
      buildData[category] = part.id;
    }
    loadBuild(buildData);
    navigate('/builder');
  };

  const neonClass = glowColor === 'ice' ? 'neon-ice' : 'neon-violet';

  return (
    <div
      className={`relative group bg-surface-container/60 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 border border-white/[0.06] hover:border-white/[0.12] ${neonClass}`}
    >
      {/* 顶部标签 */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded uppercase border ${
          glowColor === 'ice'
            ? 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim border-secondary-fixed-dim/50'
            : 'bg-primary/20 text-primary border-primary/50'
        }`}>
          {build.tier}
        </span>
      </div>

      {/* 真实主机图片 */}
      <div className="h-64 overflow-hidden relative bg-surface-container">
        <img
          src={IMAGE_MAP[glowColor]}
          alt={build.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* 底部渐隐过渡到卡片背景 */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
      </div>

      {/* 内容区 */}
      <div className="p-5">
        <h3 className={`font-headline-md text-headline-md mb-4 ${
          glowColor === 'ice'
            ? 'text-secondary-fixed-dim'
            : glowColor === 'pink'
              ? 'text-tertiary'
              : 'text-primary'
        }`}>
          {build.name}
        </h3>

        {/* 配件列表 - 只显示前3个核心配件 */}
        <div className="space-y-3 mb-6">
          {Object.entries(build.parts).slice(0, 3).map(([category, part]) => (
            <div key={category} className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-on-surface-variant/40 text-sm w-4 flex-shrink-0">
                {categoryIcons[category] || 'settings'}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant/70 truncate">
                {part.name}
              </span>
            </div>
          ))}
        </div>

        {/* 底部：价格 + 按钮 */}
        <div className="flex justify-between items-center">
          <div className="font-headline-md text-headline-md text-secondary-fixed-dim drop-shadow-[0_0_5px_rgba(0,219,231,0.5)] tabular-nums">
            ¥{build.price.toLocaleString()}
          </div>
          <button
            onClick={handleClone}
            className={`font-bold px-4 py-2 rounded-lg text-sm tracking-wide transition-opacity hover:opacity-80 ${
              glowColor === 'ice'
                ? 'bg-secondary-fixed-dim text-on-secondary-fixed'
                : 'bg-primary text-on-primary'
            }`}
          >
            详情查看
          </button>
        </div>
      </div>
    </div>
  );
}
