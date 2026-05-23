import React from 'react';
import { useBuild } from '../../context/BuildContext';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../common/NeonButton';
import HUDGauge from '../common/HUDGauge';

export default function StatusBar() {
  const { totalPower, warnings, canPower, build, powerOn } = useBuild();
  const navigate = useNavigate();

  // 假设一个典型电源的额定功率
  const psuWatt = 850;
  const hasErrors = warnings.some(w => w.type === 'error');

  const handlePowerOn = () => {
    if (canPower && !hasErrors) {
      powerOn();
      navigate('/benchmark');
    }
  };

  const powerPercent = Math.min((totalPower / psuWatt) * 100, 100);
  const isHighLoad = totalPower > psuWatt * 0.8;

  return (
    <div className="bg-surface-container-low/50 backdrop-blur-md border border-white/[0.06] rounded-xl px-4 md:px-5 py-3.5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* 功耗显示 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className={`material-symbols-outlined text-sm ${isHighLoad ? 'text-tertiary-container' : 'text-secondary-fixed-dim'}`}>
              {isHighLoad ? 'warning' : 'bolt'}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant/50 uppercase tracking-wider">功耗</span>
            <span className={`font-headline-md text-headline-md font-semibold tabular-nums ${isHighLoad ? 'text-tertiary-container' : 'text-secondary-fixed-dim'}`}>
              {totalPower}
              <span className="text-sm text-on-surface-variant/50 font-normal">/ {psuWatt}W</span>
            </span>
          </div>
          <div className="w-32">
            <HUDGauge
              value={totalPower}
              max={psuWatt}
              unit="W"
              color={isHighLoad ? 'pink' : 'ice'}
              showPercent={false}
              pulse={isHighLoad}
            />
          </div>
        </div>

        {/* 警告信息 */}
        <div className="flex-1 min-w-0">
          {warnings.length > 0 ? (
            <div className="space-y-0.5">
              {warnings.slice(0, 2).map((w, i) => (
                <div
                  key={i}
                  className={`font-label-sm text-label-sm flex items-center gap-1.5 ${
                    w.type === 'error' ? 'text-tertiary-container' : 'text-yellow-400/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[inherit] text-xs">
                    {w.type === 'error' ? 'error' : 'warning'}
                  </span>
                  {w.message}
                </div>
              ))}
            </div>
          ) : (
            <div className="font-label-sm text-label-sm text-green-400/70 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[inherit] text-xs">check_circle</span>
              所有系统自检通过，准备就绪
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <NeonButton
            variant="ghost"
            size="sm"
            icon="delete"
            onClick={() => window.location.reload()}
          >
            重置
          </NeonButton>
          <NeonButton
            variant={canPower && !hasErrors ? 'primary' : 'secondary'}
            size="sm"
            icon="power_settings_new"
            onClick={handlePowerOn}
            disabled={!canPower || hasErrors}
          >
            通电开机
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
