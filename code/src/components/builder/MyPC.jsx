import React, { useState } from 'react';
import PCScene from '../builder3d/PCScene';
import HardwarePanel from './HardwarePanel';
import ManualSteps from './ManualSteps';
import StatusBar from './StatusBar';
import SaveBuildButton from '../common/SaveBuildButton';
import ShareButton from '../common/ShareButton';
import WizardGuide from './WizardGuide';

export default function MyPC() {
  const [rightTab, setRightTab] = useState('hardware');

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-widest">
            我的电脑
          </h1>
          <p className="text-on-surface-variant/70 font-body-lg">3D 拼装舱 — 自由组合你的神光同步信仰机</p>
        </div>
      </div>

      {/* 主区域 */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* 左侧：机箱视图 (65%) */}
        <div className="flex-[2] bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-3">
          <PCScene />
        </div>

        {/* 右侧：硬件/手册面板 (35%) */}
        <div className="flex-1 bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-4 flex flex-col min-w-0">
          {/* 顶栏：收藏 + 分享 */}
          <div className="flex justify-end gap-2 mb-3">
            <ShareButton />
            <SaveBuildButton />
          </div>

          {/* Tab 切换 */}
          <div className="flex gap-1 mb-3 bg-surface-container/50 rounded-xl p-0.5 border border-white/[0.04]">
            <button
              onClick={() => setRightTab('hardware')}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${rightTab === 'hardware'
                  ? 'bg-primary/15 text-primary shadow-sm'
                  : 'text-on-surface-variant/50 hover:text-on-surface-variant/70'
                }
              `}
            >
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              核能配件谱
            </button>
            <button
              onClick={() => setRightTab('manual')}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${rightTab === 'manual'
                  ? 'bg-primary/15 text-primary shadow-sm'
                  : 'text-on-surface-variant/50 hover:text-on-surface-variant/70'
                }
              `}
            >
              <span className="material-symbols-outlined text-sm">menu_book</span>
              装机手册
            </button>
            <button
              onClick={() => setRightTab('wizard')}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${rightTab === 'wizard'
                  ? 'bg-primary/15 text-primary shadow-sm'
                  : 'text-on-surface-variant/50 hover:text-on-surface-variant/70'
                }
              `}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              新手引导
            </button>
          </div>

          {/* Tab 内容 */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {rightTab === 'hardware' ? <HardwarePanel /> : rightTab === 'wizard' ? <WizardGuide /> : <ManualSteps />}
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="mt-4 flex-shrink-0">
        <StatusBar />
      </div>
    </div>
  );
}
