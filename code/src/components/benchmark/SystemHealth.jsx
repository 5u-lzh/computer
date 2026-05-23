import React from 'react';
import { calcTotalPower } from '../../utils/compatibility';
import { calcFanRPM } from '../../utils/thermal';

export default function SystemHealth({ build = {}, temps }) {
  const cpuTemp = temps ? `${temps.cpu.load}°C` : '--';
  const gpuTemp = temps ? `${temps.gpu.load}°C` : '--';
  const cpuTempIdle = temps ? `${temps.cpu.idle}°C` : '--';
  const totalPower = calcTotalPower(build);
  const idleRpm = calcFanRPM(build, 'idle');
  const loadRpm = calcFanRPM(build, 'load');

  const METRICS = [
    { label: 'CPU 待机', value: cpuTempIdle, sub: `${idleRpm} RPM`, color: 'text-secondary-fixed-dim', icon: 'thermostat' },
    { label: 'CPU 满载', value: cpuTemp, sub: `${loadRpm} RPM`, color: 'text-secondary-fixed-dim', icon: 'thermostat' },
    { label: 'GPU 满载', value: gpuTemp, color: 'text-primary', icon: 'thermostat' },
    { label: '整机功耗', value: `${totalPower}W`, color: 'text-on-surface', icon: 'bolt' },
  ];

  return (
    <section className="bg-surface-container-low/40 backdrop-blur-md p-4 md:p-5 rounded-xl border border-white/[0.06]">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-sm">monitor_heart</span>
        <h3 className="font-label-sm text-label-sm text-on-surface-variant/60 uppercase tracking-wider">系统健康状态</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {METRICS.map((metric) => (
          <div
            key={metric.label}
            className="p-3 bg-black/20 border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-all duration-200"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[10px] text-on-surface-variant/30">{metric.icon}</span>
              <span className="text-[10px] text-on-surface-variant/40 font-label-sm tracking-wider">{metric.label}</span>
            </div>
            <div className={`font-headline-md text-headline-md ${metric.color} font-semibold tabular-nums`}>
              {metric.value}
            </div>
            {metric.sub && (
              <div className="text-[9px] text-on-surface-variant/20 font-label-sm mt-0.5 tracking-wider">{metric.sub}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
