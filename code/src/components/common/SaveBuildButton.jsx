import React, { useState, useEffect, useCallback } from 'react';
import { useBuild } from '../../context/BuildContext';
import { getCollections, saveCollection } from '../../utils/storage';
import { getPart } from '../../utils/compatibility';

export default function SaveBuildButton({ score = 0, className = '' }) {
  const { build } = useBuild();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // 检查当前配置是否已被收藏
  const checkSaved = useCallback(() => {
    const collections = getCollections();
    const buildKey = JSON.stringify(build, (_, v) => v === null ? undefined : v);
    return collections.some(c => {
      const cKey = JSON.stringify(c.build, (_, v) => v === null ? undefined : v);
      return cKey === buildKey;
    });
  }, [build]);

  useEffect(() => {
    setSaved(checkSaved());
  }, [checkSaved]);

  // 计算总价
  const calcTotalPrice = () => {
    let total = 0;
    for (const [category, id] of Object.entries(build)) {
      if (category === 'poweredOn' || category === 'savedName' || !id) continue;
      const part = getPart(category, id);
      if (part?.price) total += part.price;
    }
    return total;
  };

  const handleSave = () => {
    if (saving) return;
    setSaving(true);

    const totalPrice = calcTotalPrice();

    saveCollection({
      name: build.savedName || `配置 ${new Date().toLocaleString('zh-CN')}`,
      build,
      price: totalPrice,
      score,
    });

    setSaved(true);
    setSaving(false);
  };

  const hasParts = Object.entries(build).some(
    ([k, v]) => !['poweredOn', 'savedName'].includes(k) && v
  );

  if (!hasParts) return null;

  return (
    <button
      onClick={handleSave}
      disabled={saved}
      className={`inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all duration-200 select-none
        ${saved
          ? 'bg-secondary/15 text-secondary border border-secondary/30 cursor-default shadow-[0_0_10px_rgba(0,219,231,0.15)]'
          : 'bg-transparent border border-primary/40 text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(208,188,255,0.3)] hover:scale-105 active:scale-95'
        }
        text-sm px-4 py-2 ${className}`}
    >
      <span className="material-symbols-outlined text-[inherit]">
        {saved ? 'bookmark' : 'bookmark_add'}
      </span>
      {saved ? '已收藏' : saving ? '收藏中...' : '收藏配置'}
    </button>
  );
}
