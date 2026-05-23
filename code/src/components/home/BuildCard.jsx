import React from 'react';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../common/NeonButton';
import StatusChip from '../common/StatusChip';
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

  const accentColor = glowColor === 'ice'
    ? 'rgba(0,219,231,0.25)'
    : glowColor === 'pink'
      ? 'rgba(255,80,110,0.25)'
      : 'rgba(208,188,255,0.25)';

  return (
    <div
      className="relative group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 bg-surface-container-low/40 backdrop-blur-md border border-white/[0.06] hover:border-white/[0.12] cyber-card"
      style={{ boxShadow: `0 0 20px ${accentColor}, 0 4px 20px rgba(0,0,0,0.3)` }}
    >
      {/* 顶部标签 */}
      <div className="absolute top-3 right-3 z-10">
        <StatusChip
          variant={glowColor === 'ice' ? 'ice' : glowColor === 'pink' ? 'error' : 'primary'}
        >
          {build.tier}
        </StatusChip>
      </div>

      {/* 真实主机图片 */}
      <div className="h-52 overflow-hidden relative bg-surface-container">
        <img
          src={IMAGE_MAP[glowColor]}
          alt={build.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* 底部渐隐过渡到卡片背景 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent" />
        {/* 顶部微光 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 内容区 */}
      <div className="p-4 pt-3">
        <h3 className={`font-headline-md text-headline-md mb-3 font-semibold ${
          glowColor === 'ice'
            ? 'text-secondary-fixed-dim'
            : glowColor === 'pink'
              ? 'text-tertiary'
              : 'text-primary'
        }`}>
          {build.name}
        </h3>

        {/* 配件列表 */}
        <div className="space-y-1.5 mb-4">
          {Object.entries(build.parts).map(([category, part]) => (
            <div key={category} className="flex items-center gap-2.5 group/item">
              <span className="material-symbols-outlined text-on-surface-variant/30 text-sm w-4 flex-shrink-0 group-hover/item:text-primary/60 transition-colors duration-200">
                {categoryIcons[category] || 'settings'}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant/60 truncate group-hover/item:text-on-surface-variant/80 transition-colors duration-200">
                {part.name}
              </span>
            </div>
          ))}
        </div>

        {/* 底部：价格 + 按钮 */}
        <div className="flex justify-between items-center pt-3.5 border-t border-white/[0.05]">
          <div>
            <div className="font-headline-md text-headline-md text-secondary-fixed-dim drop-shadow-[0_0_5px_rgba(0,219,231,0.2)] tabular-nums">
              ¥{build.price.toLocaleString()}
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant/40 mt-0.5">
              跑分 {build.score?.toLocaleString() || 'N/A'}
            </div>
          </div>
          <NeonButton variant="primary" size="sm" icon="bolt" onClick={handleClone}>
            一键跃迁
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
