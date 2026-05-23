import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePlans } from '../../utils/budgetOptimizer';
import GlassPanel from '../common/GlassPanel';
import NeonButton from '../common/NeonButton';
import Skeleton from '../common/Skeleton';
import BudgetPlanCard from './BudgetPlanCard';

const QUICK_TAGS = [8000, 15000, 30000, 50000];

export default function BudgetPlanner() {
  const navigate = useNavigate();
  const [budgetInput, setBudgetInput] = useState(30000);
  const [plans, setPlans] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const handleGenerate = useCallback(() => {
    if (!budgetInput || budgetInput < 5000) {
      setError('请输入预算金额（最低 ¥5,000）');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setPlans(null);

    // 300ms 延迟让用户感知计算过程
    setTimeout(() => {
      try {
        const result = generatePlans(budgetInput);

        if (budgetInput < result.minBudget) {
          setError(`预算过低，最低需 ¥${result.minBudget.toLocaleString()}`);
          setIsGenerating(false);
          return;
        }

        setPlans(result);
        setGenerated(true);
        setIsGenerating(false);
      } catch (e) {
        console.error('预算规划出错:', e);
        setError(`计算出错: ${e.message}`);
        setIsGenerating(false);
      }
    }, 300);
  }, [budgetInput]);

  const handleTagClick = (val) => {
    setBudgetInput(val);
  };

  const handleSliderChange = (e) => {
    setBudgetInput(Number(e.target.value));
  };

  const allSame = plans && generated
    && plans.economy && plans.balanced && plans.extreme
    && plans.economy.totalPrice === plans.balanced.totalPrice
    && plans.balanced.totalPrice === plans.extreme.totalPrice;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-xl border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.04] transition-colors"
          aria-label="返回首页"
        >
          <span className="material-symbols-outlined text-on-surface-variant/60 text-lg">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-widest">
            预算规划
          </h1>
          <p className="text-on-surface-variant/70 font-body-lg mt-0.5">AI 智能推荐最佳硬件搭配方案</p>
        </div>
      </div>

      {/* Budget Input */}
      <GlassPanel className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="font-headline-md text-headline-md text-secondary-fixed-dim/80 font-semibold">
            总预算
          </label>
          <span className="font-headline-lg text-headline-lg font-bold text-primary tabular-nums">
            ¥{budgetInput.toLocaleString()}
          </span>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={5000}
          max={100000}
          step={500}
          value={budgetInput}
          onChange={handleSliderChange}
          className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(208,188,255,0.4)]
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-110"
          aria-label="预算金额"
        />

        {/* Range labels */}
        <div className="flex justify-between mt-1.5 text-[10px] text-on-surface-variant/30">
          <span>¥5,000</span>
          <span>¥100,000</span>
        </div>

        {/* Quick tags */}
        <div className="flex gap-2 mt-4">
          {QUICK_TAGS.map((val) => (
            <button
              key={val}
              onClick={() => handleTagClick(val)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border
                ${budgetInput === val
                  ? 'bg-primary/15 text-primary border-primary/25 shadow-sm'
                  : 'bg-transparent text-on-surface-variant/40 border-white/[0.06] hover:border-white/20 hover:text-on-surface-variant/70'
                }`}
            >
              ¥{val.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <NeonButton
            variant="primary"
            size="lg"
            icon={isGenerating ? 'hourglass_top' : 'auto_awesome'}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? '计算中...' : '生成智能方案'}
          </NeonButton>
        </div>
      </GlassPanel>

      {/* Error */}
      {error && (
        <GlassPanel glow glowColor="pink" className="mb-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-tertiary text-lg">warning</span>
            <div>
              <p className="text-sm font-semibold text-tertiary mb-0.5">预算不足</p>
              <p className="text-xs text-on-surface-variant/60">{error}</p>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Loading skeletons */}
      {isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      )}

      {/* Results */}
      {generated && !isGenerating && plans && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-secondary-fixed-dim/80 font-semibold">
              为你推荐以下 3 套方案
            </h2>
            {plans.extreme && plans.maxBudget && budgetInput > plans.maxBudget && (
              <span className="text-[10px] text-yellow-400/60 px-2 py-1 rounded border border-yellow-400/20 bg-yellow-400/5">
                已达配置上限，剩余 ¥{(budgetInput - plans.extreme.totalPrice).toLocaleString()}
              </span>
            )}
          </div>

          {allSame && (
            <p className="text-xs text-on-surface-variant/40 mb-4">
              当前预算已达到最高配置上限，三套方案均使用相同顶配硬件
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {['economy', 'balanced', 'extreme'].map((key) => {
              const plan = plans[key];
              if (!plan) return null;
              return (
                <BudgetPlanCard
                  key={key}
                  planData={plan}
                  planKey={key}
                  userBudget={budgetInput}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!generated && !isGenerating && !error && (
        <GlassPanel className="text-center py-12">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3">account_balance</span>
          <p className="text-sm text-on-surface-variant/50 mb-1">设定预算范围，系统将自动匹配最优配置</p>
          <p className="text-xs text-on-surface-variant/30">
            点击"生成智能方案"获取 3 套不同价位的推荐配置
          </p>
        </GlassPanel>
      )}
    </section>
  );
}
