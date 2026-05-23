import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectionCard from './CollectionCard';
import { getCollections, deleteCollection } from '../../utils/storage';
import NeonButton from '../common/NeonButton';
import StaggerEnter from '../common/StaggerEnter';

export default function Collection() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);

  const loadCollections = () => {
    setCollections(getCollections());
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleDelete = (id) => {
    const updated = deleteCollection(id);
    setCollections(updated);
  };

  const handleRefresh = () => {
    loadCollections();
  };

  return (
    <section>
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2 uppercase tracking-widest">
            我的收藏
          </h1>
          <p className="text-on-surface-variant/70 font-body-lg">
            本地星际战利仓
            {collections.length > 0 && (
              <span className="ml-2 text-on-surface-variant/40">
                — 已保存 {collections.length} 个配置
              </span>
            )}
          </p>
        </div>
        {collections.length > 0 && (
          <NeonButton variant="ghost" size="sm" icon="refresh" onClick={handleRefresh}>
            刷新
          </NeonButton>
        )}
      </div>

      {/* 收藏列表 */}
      {collections.length > 0 ? (
        <StaggerEnter baseDelay={80} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((item) => (
            <CollectionCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </StaggerEnter>
      ) : (
        <div className="flex flex-col items-center justify-center py-xl animate-fade-in">
          {/* 空状态图标 */}
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-2xl bg-surface-container-high/50 border border-white/[0.06] flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">favorite</span>
            </div>
            {/* 装饰光晕 */}
            <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl opacity-50" />
          </div>

          <h3 className="font-headline-md text-headline-md text-on-surface-variant/40 mb-2 font-semibold">
            战利仓空空如也
          </h3>
          <p className="text-on-surface-variant/30 font-body-md mb-8 max-w-xs text-center">
            在"我的电脑"完成装机，点亮你的神光同步信仰，保存配置到此处
          </p>
          <div className="flex gap-3">
            <NeonButton variant="primary" icon="memory" onClick={() => navigate('/builder')}>
              前往装机
            </NeonButton>
            <NeonButton variant="ghost" icon="speed" onClick={() => navigate('/benchmark')}>
              查看跑分
            </NeonButton>
          </div>
        </div>
      )}
    </section>
  );
}
