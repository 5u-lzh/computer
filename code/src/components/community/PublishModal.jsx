import React, { useState } from 'react';
import NeonButton from '../common/NeonButton';

export default function PublishModal({ isOpen, onClose, onPublish, currentBuild }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [publishing, setPublishing] = useState(false);

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (!name.trim()) return;
    setPublishing(true);
    try {
      await onPublish({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      onClose();
    } catch (e) {
      alert('发布失败：' + e.message);
    } finally {
      setPublishing(false);
    }
  };

  const partCount = Object.entries(currentBuild || {}).filter(
    ([k, v]) => !['poweredOn', 'savedName'].includes(k) && v
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-surface-container-low/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] w-full max-w-lg mx-4 shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary font-semibold">发布到社区</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant/50 mt-1">
              分享你的装机方案给其他玩家
            </p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant/30 hover:text-on-surface-variant/60 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* 配置概况 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/[0.04]">
            <span className="material-symbols-outlined text-primary text-lg">dns</span>
            <div className="flex-1">
              <div className="font-label-sm text-label-sm text-on-surface-variant/60">当前配置</div>
              <div className="font-headline-sm text-headline-sm text-primary text-sm">{partCount} 个配件已选</div>
            </div>
          </div>

          {/* 名称 */}
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant/60 block mb-1.5">配置名称 *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：我的梦幻旗舰机"
              className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/40 transition-colors"
              maxLength={40}
              autoFocus
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant/60 block mb-1.5">描述（选填）</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="写点装机心得、性能表现..."
              className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/40 transition-colors resize-none"
              rows={3}
              maxLength={200}
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-white/[0.06]">
          <NeonButton variant="ghost" size="sm" onClick={onClose}>取消</NeonButton>
          <NeonButton
            variant="primary"
            size="sm"
            icon="public"
            onClick={handlePublish}
            disabled={!name.trim() || publishing}
          >
            {publishing ? '发布中...' : '发布'}
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
