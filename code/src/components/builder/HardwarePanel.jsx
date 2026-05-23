import React, { useState } from 'react';
import PartCard from './PartCard';
import { getPartsByCategory, getCategoryLabel, getCategoryIcon } from '../../utils/compatibility';
import { useBuild } from '../../context/BuildContext';

const CATEGORIES = ['cpu', 'gpu', 'memory', 'motherboard', 'storage', 'psu', 'cooler', 'case'];

export default function HardwarePanel() {
  const { build, selectPart, clearPart } = useBuild();
  const [activeCategory, setActiveCategory] = useState('cpu');

  const parts = getPartsByCategory(activeCategory);
  const selectedId = build[activeCategory];

  return (
    <div className="flex flex-col h-full">
      {/* 分类标签 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all
                ${isActive
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_8px_rgba(208,188,255,0.15)]'
                  : 'bg-surface-container-high/60 text-on-surface-variant border border-white/5 hover:border-white/20'
                }
              `}
            >
              <span className="material-symbols-outlined text-xs">{getCategoryIcon(cat)}</span>
              <span>{getCategoryLabel(cat)}</span>
            </button>
          );
        })}
      </div>

      {/* 选中提示 */}
      {selectedId && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 mb-3">
          <span className="text-xs text-primary">
            已选择: {parts.find(p => p.id === selectedId)?.name}
          </span>
          <button
            onClick={() => clearPart(activeCategory)}
            className="text-tertiary-container hover:text-tertiary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* 硬件列表 */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {parts.map((part) => (
          <PartCard
            key={part.id}
            part={part}
            category={activeCategory}
            selected={part.id === selectedId}
            onSelect={(id) => selectPart(activeCategory, id)}
          />
        ))}
      </div>
    </div>
  );
}
