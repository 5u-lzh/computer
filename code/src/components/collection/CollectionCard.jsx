import React from 'react';
import NeonButton from '../common/NeonButton';
import StatusChip from '../common/StatusChip';
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

export default function CollectionCard({ item, onDelete }) {
  const navigate = useNavigate();
  const { loadBuild } = useBuild();

  const handleEdit = () => {
    loadBuild(item.build);
    navigate('/builder');
  };

  const handlePowerUp = () => {
    loadBuild(item.build);
    navigate('/benchmark');
  };

  const parts = Object.entries(item.build || {}).filter(
    ([k]) => k !== 'poweredOn' && k !== 'savedName'
  );

  return (
    <div className="relative group bg-surface-container-low/40 backdrop-blur-md rounded-2xl border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-1 overflow-hidden cyber-card">
      {/* 顶部装饰条 */}
      <div className="h-0.5 bg-gradient-to-r from-primary/40 via-secondary-fixed-dim/40 to-primary/40 opacity-50" />

      <div className="p-5">
        {/* 顶部标签行 */}
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1 mr-3">
            <h3 className="font-headline-md text-headline-md text-primary font-semibold truncate">{item.name}</h3>
            <div className="font-label-sm text-label-sm text-on-surface-variant/40 mt-1">
              创建于 {new Date(item.createdAt).toLocaleDateString('zh-CN')}
            </div>
          </div>
          <StatusChip variant="primary" icon="stars">
            {item.score ? `${(item.score / 10000).toFixed(0)}万` : 'N/A'}
          </StatusChip>
        </div>

        {/* 配置列表 */}
        <div className="space-y-1.5 mb-4">
          {parts.slice(0, 6).map(([category, partId]) => {
            if (!partId) return null;
            return (
              <div key={category} className="flex items-center gap-2.5 group/item">
                <span className="material-symbols-outlined text-on-surface-variant/30 text-sm w-4 flex-shrink-0 group-hover/item:text-primary/60 transition-colors duration-200">
                  {categoryIcons[category] || 'settings'}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant/50 truncate group-hover/item:text-on-surface-variant/70 transition-colors duration-200">
                  {partId}
                </span>
              </div>
            );
          })}
          {parts.length > 6 && (
            <div className="text-[10px] text-on-surface-variant/30 pl-7">
              +{parts.length - 6} 更多配件
            </div>
          )}
        </div>

        {/* 总价 */}
        <div className="font-headline-md text-headline-md text-secondary-fixed-dim drop-shadow-[0_0_5px_rgba(0,219,231,0.15)] mb-4 tabular-nums">
          ¥{(item.price || 0).toLocaleString()}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-4 border-t border-white/[0.05]">
          <NeonButton variant="primary" size="sm" icon="bolt" onClick={handlePowerUp}>
            通电看RGB
          </NeonButton>
          <NeonButton variant="ghost" size="sm" icon="edit" onClick={handleEdit}>
            重新改换
          </NeonButton>
          <NeonButton
            variant="ghost"
            size="sm"
            icon="delete"
            className="!text-tertiary-container/60 hover:!text-tertiary"
            onClick={() => onDelete(item.id)}
          >
            分解
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
