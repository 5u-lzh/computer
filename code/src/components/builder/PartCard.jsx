import React from 'react';
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

export default function PartCard({ part, category, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(part.id)}
      className={`
        w-full text-left p-3.5 rounded-xl border transition-all duration-200
        ${selected
          ? 'bg-primary/10 border-primary/30 shadow-[0_0_12px_rgba(208,188,255,0.12)]'
          : 'bg-surface-container/30 border-white/[0.05] hover:border-primary/20 hover:bg-white/[0.03]'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* 图标 */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          selected
            ? 'bg-primary/20 border border-primary/20'
            : 'bg-surface-container-high/60 border border-white/[0.04]'
        }`}>
          <span className={`material-symbols-outlined ${selected ? 'text-primary' : 'text-on-surface-variant/50'}`}>
            {categoryIcons[category] || 'settings'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm truncate ${selected ? 'text-primary' : 'text-on-surface'}`}>
            {part.name}
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant/50 truncate mt-0.5">
            {part.spec}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-secondary-fixed-dim font-medium tabular-nums">
              ¥{part.price.toLocaleString()}
            </span>
            <span className="text-xs text-on-surface-variant/40">{part.power > 0 ? `${part.power}W` : '-'}</span>
            <span className="text-xs text-primary/60">PF {part.pf}</span>
          </div>
        </div>

        {/* 选中标记 */}
        {selected && (
          <span className="material-symbols-outlined text-primary text-sm flex-shrink-0">check_circle</span>
        )}
      </div>

      {/* 简介 */}
      <p className="mt-2.5 text-xs text-on-surface-variant/50 leading-relaxed line-clamp-2">
        {part.desc}
      </p>
    </button>
  );
}
