import React, { useState, useMemo } from 'react';
import { useBuild } from '../../context/BuildContext';
import { getPartsByCategory, getPart } from '../../utils/compatibility';
import PartCard from './PartCard';
import NeonButton from '../common/NeonButton';

const STEPS = [
  { category: 'motherboard', title: '选择主板', desc: '主板是整台电脑的基础，它决定了你能用什么 CPU 和内存', icon: 'developer_board' },
  { category: 'cpu', title: '选择 CPU', desc: '中央处理器，电脑的大脑，注意插槽必须与主板匹配', icon: 'memory' },
  { category: 'cooler', title: '选择散热器', desc: '给 CPU 降温，风冷性价比高，水冷性能强且更好看', icon: 'ac_unit' },
  { category: 'memory', title: '选择内存', desc: '内存越大后台开得越多，频率越高游戏帧率越稳', icon: 'storage' },
  { category: 'gpu', title: '选择显卡', desc: '游戏性能的核心，预算的大头，建议优先投入', icon: 'videogame_asset' },
  { category: 'storage', title: '选择硬盘', desc: '固态硬盘 NVMe 协议速度最快，装系统和游戏首选', icon: 'hard_drive' },
  { category: 'psu', title: '选择电源', desc: '电源要留足余量，金牌认证更省电更稳定', icon: 'bolt' },
  { category: 'case', title: '选择机箱', desc: '最后把全部硬件装进机箱，注意兼容主板尺寸', icon: 'dns' },
];

export default function WizardGuide() {
  const { build, selectPart, clearPart } = useBuild();
  const [currentStep, setCurrentStep] = useState(findFirstIncompleteStep(build));

  // 找第一个未完成的步骤
  function findFirstIncompleteStep(buildState) {
    for (let i = 0; i < STEPS.length; i++) {
      if (!buildState[STEPS[i].category]) return i;
    }
    return STEPS.length - 1; // 全部完成
  }

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  // 获取当前步骤的配件列表（含兼容过滤）
  const parts = useMemo(() => {
    const allParts = getPartsByCategory(step.category);

    // 选 CPU 时，过滤出与已选主板 socket 匹配的
    if (step.category === 'cpu' && build.motherboard) {
      const mb = getPart('motherboard', build.motherboard);
      if (mb) {
        return allParts.filter((p) => p.socket === mb.socket);
      }
    }

    // 选主板时，过滤出与已选 CPU socket 匹配的
    if (step.category === 'motherboard' && build.cpu) {
      const cpu = getPart('cpu', build.cpu);
      if (cpu) {
        return allParts.filter((p) => p.socket === cpu.socket);
      }
    }

    return allParts;
  }, [step.category, build.motherboard, build.cpu]);

  // 当前步骤是否已完成（已选配件）
  const isComplete = !!build[step.category];

  // 处理配件选择
  const handleSelect = (partId) => {
    selectPart(step.category, partId);
  };

  // 上一步
  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // 下一步
  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 跳转到指定步骤（仅允许已完成或当前步骤）
  const jumpTo = (index) => {
    if (index <= currentStep || build[STEPS[index].category]) {
      setCurrentStep(index);
    }
  };

  // 计算进度
  const completedCount = STEPS.filter((s) => !!build[s.category]).length;
  const allDone = completedCount === STEPS.length;

  // 无兼容配件提示
  const noCompatible = parts.length === 0 && (
    step.category === 'cpu' || step.category === 'motherboard'
  );

  return (
    <div className="flex flex-col h-full">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
        <h3 className="font-label-sm text-label-sm text-primary uppercase">新手引导</h3>
        <span className="ml-auto text-[10px] text-on-surface-variant/30 tabular-nums">
          {completedCount}/{STEPS.length}
        </span>
      </div>

      {/* 步骤进度条 */}
      <div className="flex gap-1 mb-4">
        {STEPS.map((s, i) => {
          const isDone = !!build[s.category];
          const isActive = i === currentStep;
          return (
            <button
              key={s.category}
              onClick={() => jumpTo(i)}
              disabled={!isDone && i > currentStep}
              className={`
                flex-1 h-1.5 rounded-full transition-all duration-300
                ${isActive
                  ? 'bg-primary shadow-[0_0_6px_rgba(208,188,255,0.4)]'
                  : isDone
                    ? 'bg-green-500/60 cursor-pointer hover:bg-green-500/80'
                    : 'bg-white/[0.06]'
                }
              `}
              aria-label={`步骤 ${i + 1}: ${s.title}`}
            />
          );
        })}
      </div>

      {/* 步骤标签 */}
      <div className="flex justify-between mb-4">
        {STEPS.map((s, i) => {
          const isDone = !!build[s.category];
          const isActive = i === currentStep;
          return (
            <button
              key={s.category}
              onClick={() => jumpTo(i)}
              disabled={!isDone && i > currentStep}
              className={`
                flex flex-col items-center gap-1 transition-all duration-200
                ${isActive
                  ? 'opacity-100'
                  : isDone
                    ? 'opacity-60 hover:opacity-80'
                    : 'opacity-20 cursor-default'
                }
              `}
              style={{ width: `${100 / STEPS.length}%` }}
              aria-label={s.title}
            >
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${isActive
                  ? 'bg-primary text-on-primary shadow-[0_0_10px_rgba(208,188,255,0.3)]'
                  : isDone
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-surface-container-high text-on-surface-variant/30'
                }
              `}>
                {isDone ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[9px] font-medium text-center leading-tight hidden sm:block
                ${isActive ? 'text-primary' : isDone ? 'text-green-400/70' : 'text-on-surface-variant/30'}
              `}>
                {s.title.replace('选择', '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* 当前步骤内容 */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin -mr-1">
        {/* 步骤标题和描述 */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-lg">{step.icon}</span>
            <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
              第{currentStep + 1}步：{step.title}
            </h4>
          </div>
          <p className="text-xs text-on-surface-variant/50 ml-8">{step.desc}</p>
        </div>

        {/* 已选配件标签 */}
        {isComplete && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
            <span className="text-xs text-green-400 font-medium">已选择：{getPart(step.category, build[step.category])?.name}</span>
            <button
              onClick={() => clearPart(step.category)}
              className="ml-auto text-on-surface-variant/30 hover:text-tertiary transition-colors"
              aria-label="取消选择"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* 无兼容配件提示 */}
        {noCompatible && (
          <div className="px-3 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-3">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-yellow-400 text-sm">warning</span>
              <div>
                <p className="text-xs text-yellow-400 font-medium mb-0.5">暂无兼容配件</p>
                <p className="text-[11px] text-on-surface-variant/50">
                  {step.category === 'cpu'
                    ? '当前主板没有兼容的 CPU，请先更换主板'
                    : '当前 CPU 没有兼容的主板，请先更换 CPU'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 配件列表 */}
        {!noCompatible && (
          <div className="space-y-2">
            {parts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                category={step.category}
                selected={build[step.category] === part.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06]">
        <NeonButton
          variant="ghost"
          size="sm"
          icon="arrow_back"
          onClick={goPrev}
          disabled={isFirstStep}
        >
          上一步
        </NeonButton>

        <div className="flex items-center gap-2">
          {allDone && currentStep === STEPS.length - 1 && (
            <span className="text-[10px] text-green-400/60">全部部署完成 ✓</span>
          )}
          {!isComplete && !noCompatible && (
            <span className="text-[10px] text-on-surface-variant/30">请先选择配件</span>
          )}
        </div>

        {isLastStep ? (
          allDone ? (
            <NeonButton variant="primary" size="sm" icon="celebration" onClick={() => {}} className="animate-pulse">
              全部完成！
            </NeonButton>
          ) : (
            <NeonButton variant="secondary" size="sm" disabled>
              完成
            </NeonButton>
          )
        ) : (
          <NeonButton
            variant="primary"
            size="sm"
            icon="arrow_forward"
            onClick={goNext}
            disabled={!isComplete}
          >
            下一步
          </NeonButton>
        )}
      </div>
    </div>
  );
}
