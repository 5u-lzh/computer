import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import NeonButton from './NeonButton';
import { useBuild } from '../../context/BuildContext';
import { getPart } from '../../utils/compatibility';

const categoryIcons = {
  cpu: 'memory', gpu: 'videogame_asset', memory: 'storage',
  motherboard: 'developer_board', storage: 'hard_drive',
  psu: 'bolt', cooler: 'ac_unit', case: 'dns',
};
const categoryLabels = {
  cpu: 'CPU 处理器', gpu: '显卡', memory: '内存',
  motherboard: '主板', storage: '存储',
  psu: '电源', cooler: '散热器', case: '机箱',
};

function calcTotalPrice(build) {
  let total = 0;
  for (const [cat, id] of Object.entries(build)) {
    if (['poweredOn', 'savedName'].includes(cat) || !id) continue;
    const part = getPart(cat, id);
    if (part?.price) total += part.price;
  }
  return total;
}

function ShareCard({ build, score, onClose }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const parts = Object.entries(build).filter(
    ([k, v]) => !['poweredOn', 'savedName'].includes(k) && v
  );
  const totalPrice = calcTotalPrice(build);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0e0e0f',
      });
      const link = document.createElement('a');
      link.download = `装机大神-${build.savedName || '配置'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('导出失败', err);
    }
    setDownloading(false);
  }, [build, downloading]);

  const handleCopy = useCallback(async () => {
    if (!cardRef.current || copied) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0e0e0f',
      });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不支持时退化为下载
      handleDownload();
    }
  }, [cardRef, copied, handleDownload]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-surface-container-low rounded-2xl border border-white/[0.08] shadow-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* 卡片预览 */}
        <div className="p-5 pb-0">
          <div
            ref={cardRef}
            className="rounded-xl overflow-hidden"
            style={{ width: '480px', height: '640px' }}
          >
            <div className="w-full h-full bg-[#0e0e0f] flex flex-col relative overflow-hidden">
              {/* 装饰网格 */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(208,188,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(208,188,255,0.3) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* 顶部光晕 */}
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-secondary-fixed-dim/5 blur-3xl" />

              {/* 顶部装饰条 */}
              <div className="relative h-1 bg-gradient-to-r from-primary via-secondary-fixed-dim to-primary" />

              {/* 头部 */}
              <div className="relative px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: '"FILL" 1' }}>memory</span>
                  <span className="text-[10px] font-bold text-primary/60 tracking-[0.3em]">装机大神</span>
                </div>
                <h2 className="text-xl font-bold text-primary" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                  {build.savedName || '我的神机'}
                </h2>
                <div className="text-[11px] text-white/30 mt-1 font-mono tracking-wider">
                  CONFIGURATION • {new Date().toLocaleDateString('zh-CN')}
                </div>
              </div>

              {/* 分隔线 */}
              <div className="relative mx-6 h-px bg-gradient-to-r from-primary/30 via-white/10 to-transparent" />

              {/* 配件列表 */}
              <div className="relative flex-1 px-6 py-4 space-y-2.5 overflow-y-auto">
                {parts.map(([category, id]) => {
                  const part = getPart(category, id);
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary/60 text-sm">
                          {categoryIcons[category] || 'settings'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white/90 font-medium truncate">
                          {part?.name || id}
                        </div>
                        <div className="text-[10px] text-white/30 mt-0.5">{categoryLabels[category]}</div>
                      </div>
                      <div className="text-sm text-secondary-fixed-dim font-semibold tabular-nums flex-shrink-0">
                        ¥{part?.price?.toLocaleString() || '0'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 底部：总分 + 价格 */}
              <div className="relative px-6 py-4 bg-white/[0.02] border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-white/30 font-label-sm tracking-wider mb-1">TOTAL PRICE</div>
                    <div className="text-xl font-bold text-secondary-fixed-dim tabular-nums" style={{ textShadow: '0 0 10px rgba(0,219,231,0.3)' }}>
                      ¥{totalPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/30 font-label-sm tracking-wider mb-1">BENCHMARK</div>
                    <div className="text-lg font-bold text-primary tabular-nums">
                      {score > 0 ? score.toLocaleString() : '---'}
                    </div>
                  </div>
                </div>
                {/* 底部标签 */}
                <div className="mt-3 text-[8px] text-white/10 font-mono tracking-[0.5em] text-center">
                  装机大神
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 p-5 pt-4">
          <NeonButton variant="primary" size="md" icon={downloading ? 'hourglass_top' : 'download'} onClick={handleDownload} disabled={downloading} className="flex-1">
            {downloading ? '生成中...' : '下载图片'}
          </NeonButton>
          <NeonButton variant="secondary" size="md" icon={copied ? 'check' : 'content_copy'} onClick={handleCopy} className="flex-1">
            {copied ? '已复制' : '复制图片'}
          </NeonButton>
          <NeonButton variant="ghost" size="md" icon="close" onClick={onClose}>
            关闭
          </NeonButton>
        </div>
      </div>
    </div>
  );
}

export default function ShareButton({ score = 0, className = '' }) {
  const { build } = useBuild();
  const [showModal, setShowModal] = useState(false);

  const hasParts = Object.entries(build).some(
    ([k, v]) => !['poweredOn', 'savedName'].includes(k) && v
  );

  if (!hasParts) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none
          bg-transparent border border-white/20 text-on-surface-variant/70 hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_12px_rgba(208,188,255,0.15)] active:scale-95
          text-sm px-4 py-2 ${className}`}
        aria-label="分享配置"
      >
        <span className="material-symbols-outlined text-[inherit]">share</span>
        分享
      </button>

      {showModal && (
        <ShareCard
          build={build}
          score={score}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
