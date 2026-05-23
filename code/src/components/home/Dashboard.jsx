import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuildCard from './BuildCard';
import StatusChip from '../common/StatusChip';
import StaggerEnter from '../common/StaggerEnter';
import hardware from '../../data/hardware.json';

// 预设推荐配置
const FEATURED_BUILDS = [
  {
    name: '幻影架构师 V.9',
    tier: 'Ultra 旗舰',
    price: 38800,
    score: 1894000,
    glowColor: 'violet',
    parts: {
      cpu: hardware.cpu[0],
      gpu: hardware.gpu[0],
      memory: hardware.memory[0],
      motherboard: hardware.motherboard[0],
      storage: hardware.storage[0],
      psu: hardware.psu[0],
      cooler: hardware.cooler[0],
      case: hardware.case[0],
    },
  },
  {
    name: '冰霜协议 X.1',
    tier: 'Precision 精英',
    price: 24500,
    score: 1420000,
    glowColor: 'ice',
    parts: {
      cpu: hardware.cpu[1],
      gpu: hardware.gpu[2],
      memory: hardware.memory[1],
      motherboard: hardware.motherboard[1],
      storage: hardware.storage[1],
      psu: hardware.psu[1],
      cooler: hardware.cooler[1],
      case: hardware.case[1],
    },
  },
  {
    name: '核心频率 R.4',
    tier: 'Core 主流',
    price: 15900,
    score: 890000,
    glowColor: 'violet',
    parts: {
      cpu: hardware.cpu[2],
      gpu: hardware.gpu[3],
      memory: hardware.memory[2],
      motherboard: hardware.motherboard[2],
      storage: hardware.storage[2],
      psu: hardware.psu[2],
      cooler: hardware.cooler[2],
      case: hardware.case[1],
    },
  },
];

const FILTERS = ['全部', '旗舰', '精英', '主流'];
const SORTS = ['热门', '价格', '跑分'];

const FILTER_MAP = {
  '全部': 'all',
  '旗舰': 'Ultra',
  '精英': 'Precision',
  '主流': 'Core',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('全部');
  const [activeSort, setActiveSort] = useState('热门');

  const filteredBuilds = useMemo(() => {
    let list = [...FEATURED_BUILDS];

    // Filter
    if (activeFilter !== '全部') {
      const tier = FILTER_MAP[activeFilter];
      list = list.filter(b => b.tier.includes(tier));
    }

    // Sort
    if (activeSort === '价格') {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === '跑分') {
      list.sort((a, b) => b.score - a.score);
    }
    // '热门' keeps original order

    return list;
  }, [activeFilter, activeSort]);

  return (
    <section>
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-lg">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2 uppercase tracking-widest">
            推荐配置
          </h1>
          <p className="text-on-surface-variant/70 font-body-lg">
            高端硬件架构师精心打造的极限性能方案
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center">
          {/* 筛选 */}
          <div className="flex gap-1 p-1 bg-surface-container-high/40 rounded-xl border border-white/[0.04]">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all duration-200
                  ${activeFilter === f
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-on-surface-variant/50 hover:text-on-surface-variant/80 hover:bg-white/[0.03]'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* 排序 */}
          <div className="flex gap-1 p-1 bg-surface-container-high/40 rounded-xl border border-white/[0.04]">
            {SORTS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSort(s)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all duration-200
                  ${activeSort === s
                    ? 'bg-secondary/10 text-secondary-fixed-dim shadow-sm'
                    : 'text-on-surface-variant/50 hover:text-on-surface-variant/80 hover:bg-white/[0.03]'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 配置卡片网格 */}
      {filteredBuilds.length > 0 ? (
        <StaggerEnter baseDelay={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuilds.map((build, index) => (
            <BuildCard key={build.name} build={build} glowColor={build.glowColor} />
          ))}
        </StaggerEnter>
      ) : (
        <div className="text-center py-16">
          <p className="text-on-surface-variant/50">当前筛选条件下无匹配配置</p>
        </div>
      )}

      {/* 预算规划入口 */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/budget')}
          className="w-full group relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-r from-primary/[0.04] via-secondary-fixed-dim/[0.04] to-primary/[0.04] p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(208,188,255,0.08)]"
        >
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(208,188,255,0.5) 0%, transparent 60%)',
            }}
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-headline-md text-headline-md text-primary font-semibold">预算规划</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/15 text-primary border border-primary/25">NEW</span>
                </div>
                <p className="text-sm text-on-surface-variant/50 mt-0.5">输入预算 · AI 智能推荐最佳硬件搭配方案</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary/60 group-hover:text-primary transition-colors duration-300">
              <span className="text-sm font-semibold hidden sm:inline">立即规划</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>
          </div>
        </button>
      </div>

      {/* 底部提示 */}
      <div className="mt-6 text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant/30">
          * 点击"一键跃迁"将配置克隆到 3D 拼装舱进行个性化调整
        </p>
      </div>
    </section>
  );
}
