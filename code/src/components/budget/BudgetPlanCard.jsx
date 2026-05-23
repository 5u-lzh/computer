import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuild } from '../../context/BuildContext';
import { getScoreTier } from '../../utils/benchmark';
import GlassPanel from '../common/GlassPanel';
import NeonButton from '../common/NeonButton';
import StatusChip from '../common/StatusChip';

const CATEGORY_META = {
  gpu: { icon: 'videogame_asset', label: '显卡' },
  cpu: { icon: 'memory', label: '处理器' },
  memory: { icon: 'storage', label: '内存' },
  motherboard: { icon: 'developer_board', label: '主板' },
  storage: { icon: 'hard_drive', label: '存储' },
  psu: { icon: 'bolt', label: '电源' },
  cooler: { icon: 'ac_unit', label: '散热' },
  case: { icon: 'dns', label: '机箱' },
};

const PLAN_CONFIG = {
  economy: {
    label: '经济方案',
    chipVariant: 'primary',
    chipIcon: 'eco',
    glowColor: 'violet',
    desc: '性价比优先，花最少的钱获得最佳体验',
  },
  balanced: {
    label: '均衡方案',
    chipVariant: 'ice',
    chipIcon: 'balance',
    glowColor: 'ice',
    desc: '性能与价格的最佳平衡点',
  },
  extreme: {
    label: '极致方案',
    chipVariant: 'error',
    chipIcon: 'bolt',
    glowColor: 'pink',
    desc: '预算拉满，追求极限性能',
  },
};

export default function BudgetPlanCard({ planData, planKey, userBudget }) {
  const navigate = useNavigate();
  const { loadBuild } = useBuild();
  const config = PLAN_CONFIG[planKey];
  const tier = getScoreTier(planData.score);
  const pct = Math.round((planData.totalPrice / userBudget) * 100);

  const handleApply = () => {
    const buildObj = {};
    for (const [cat, part] of Object.entries(planData.parts)) {
      buildObj[cat] = part.id;
    }
    loadBuild(buildObj);
    navigate('/builder');
  };

  return (
    <GlassPanel glow className="border-white/[0.08]" glowColor={config.glowColor}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusChip variant={config.chipVariant} icon={config.chipIcon}>
            {config.label}
          </StatusChip>
        </div>
        <span className="text-[11px] text-on-surface-variant/40 tabular-nums">
          ¥{planData.totalPrice.toLocaleString()} / ¥{userBudget.toLocaleString()} ({pct}%)
        </span>
      </div>

      {/* Score */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-headline-xl text-headline-xl font-bold tabular-nums" style={{ color: tier.color }}>
          {planData.score.toLocaleString()}
        </span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${tier.color}20`, color: tier.color }}>
          {tier.label}
        </span>
      </div>

      <p className="text-xs text-on-surface-variant/50 mb-4">{config.desc}</p>

      {/* Parts List */}
      <div className="space-y-1 mb-4">
        {Object.entries(CATEGORY_META).map(([cat, meta]) => {
          const part = planData.parts[cat];
          if (!part) return null;
          return (
            <div key={cat} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="material-symbols-outlined text-on-surface-variant/30 text-[14px]">{meta.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs text-on-surface/80 truncate">{part.name}</div>
                  <div className="text-[10px] text-on-surface-variant/30 truncate">{meta.label} · {part.spec}</div>
                </div>
              </div>
              <span className="text-xs text-secondary-fixed-dim tabular-nums flex-shrink-0 ml-2">
                ¥{part.price.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent mb-3" />

      {/* Total & Apply */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-on-surface-variant/30 font-label-sm tracking-wider">总计</div>
          <div className="text-lg font-bold text-secondary-fixed-dim tabular-nums">
            ¥{planData.totalPrice.toLocaleString()}
          </div>
        </div>
        <NeonButton
          variant="primary"
          size="md"
          icon="bolt"
          onClick={handleApply}
        >
          应用此方案
        </NeonButton>
      </div>
    </GlassPanel>
  );
}
