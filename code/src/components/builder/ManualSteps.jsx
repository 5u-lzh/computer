import React from 'react';
import { useBuild } from '../../context/BuildContext';
import { getPart } from '../../utils/compatibility';

const STEPS = [
  { id: 'motherboard', title: '测序 01', desc: '将主控核心植入母套座', icon: 'developer_board' },
  { id: 'cpu', title: '测序 02', desc: '锁定中央处理生物芯片', icon: 'memory' },
  { id: 'cooler', title: '测序 03', desc: '部署液态冷凝散热矩阵', icon: 'ac_unit' },
  { id: 'memory', title: '测序 04', desc: '嵌入双通道高频缓忆载体', icon: 'storage' },
  { id: 'gpu', title: '测序 05', desc: '接入三维矢量渲染核心', icon: 'videogame_asset' },
  { id: 'storage', title: '测序 06', desc: '挂载量子数据仓储单元', icon: 'hard_drive' },
  { id: 'psu', title: '测序 07', desc: '启动聚变能量供应模组', icon: 'bolt' },
  { id: 'case', title: '测序 08', desc: '封装纳米合金装甲外壳', icon: 'dns' },
];

export default function ManualSteps() {
  const { build } = useBuild();

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
        <h3 className="font-label-sm text-label-sm text-primary uppercase">新兵装机手册</h3>
      </div>

      <div className="space-y-2">
        {STEPS.map((step, index) => {
          const partId = build[step.id];
          const part = partId ? getPart(step.id, partId) : null;
          const isDone = !!part;

          return (
            <div
              key={step.id}
              className={`
                flex items-center gap-3 p-2.5 rounded-lg border transition-all
                ${isDone
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-surface-container/30 border-white/5'
                }
              `}
            >
              {/* 序号 */}
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                ${isDone
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-surface-container-high text-on-surface-variant'
                }
              `}>
                {isDone ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  index + 1
                )}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="font-label-sm text-label-sm text-on-surface-variant">
                  {step.title}
                </div>
                <div className={`text-xs ${isDone ? 'text-green-400' : 'text-on-surface-variant/60'}`}>
                  {step.desc}
                </div>
              </div>

              {/* 已安装硬件名 */}
              {isDone && part && (
                <div className="text-[10px] text-green-400/70 truncate max-w-[100px] text-right">
                  {part.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 完成状态 */}
      {STEPS.every(s => !!build[s.id]) && (
        <div className="mt-4 bg-secondary-fixed-dim/10 border border-secondary-fixed-dim/30 rounded-lg p-3 text-center">
          <span className="material-symbols-outlined text-secondary-fixed-dim text-lg">celebration</span>
          <div className="font-label-sm text-label-sm text-secondary-fixed-dim mt-1">
            全部部署完成！准备开机测试
          </div>
        </div>
      )}
    </div>
  );
}
