import React, { useState, useCallback, useEffect } from 'react';
import ScoreGauge from './ScoreGauge';
import GamePrediction from './GamePrediction';
import SystemHealth from './SystemHealth';
import NeonButton from '../common/NeonButton';
import SaveBuildButton from '../common/SaveBuildButton';
import ShareButton from '../common/ShareButton';
import HUDGauge from '../common/HUDGauge';
import { useBuild } from '../../context/BuildContext';
import { calcBenchmarkScore, calcSubScores, predictGameFPS, getScoreTier } from '../../utils/benchmark';
import { calcThermalHeadroom, calcStabilityRating, calcTemperatures } from '../../utils/thermal';
import { getBenchmarks, saveBenchmark, deleteBenchmark } from '../../utils/storage';

function BenchmarkHistory({ history, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? history : history.slice(0, 5);

  if (history.length === 0) return null;

  return (
    <section className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06]">
      <div className="flex items-center justify-between p-4 md:p-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-fixed-dim text-sm">history</span>
          <h3 className="font-headline-md text-headline-md text-secondary-fixed-dim/80 font-semibold">跑分历史</h3>
        </div>
        <span className="text-[10px] tabular-nums text-on-surface-variant/40 px-2 py-0.5 border border-white/[0.06] rounded-md font-mono">
          {history.length}
        </span>
      </div>

      <div className="px-3 md:px-4 pb-3 md:pb-4 space-y-1.5">
        {visible.map((item) => {
          const tier = getScoreTier(item.score);
          return (
            <div
              key={item.id}
              className="group relative pl-3 py-2.5 pr-2 rounded-xl bg-black/20 border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
              style={{ borderLeft: `2.5px solid ${tier.color}` }}
            >
              {/* 主行：分数 + 等级 + 删除 */}
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-headline-sm text-headline-sm font-bold tabular-nums" style={{ color: tier.color }}>
                    {item.score.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: `${tier.color}18`, color: tier.color }}>
                    {tier.label}
                  </span>
                </div>
                <button
                  onClick={() => { deleteBenchmark(item.id); onRefresh(); }}
                  className="opacity-0 group-hover:opacity-100 text-on-surface-variant/20 hover:text-tertiary transition-all duration-200 flex-shrink-0 ml-1"
                  aria-label="删除记录"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* 第二行：子项分数条 + 日期 */}
              <div className="flex items-center justify-between gap-3 mt-1.5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {['gpu', 'cpu', 'memory'].map((key) => {
                    const val = item.subScores?.[key] || 0;
                    const maxSub = Math.max(
                      item.subScores?.gpu || 0,
                      item.subScores?.cpu || 0,
                      item.subScores?.memory || 0,
                      1
                    );
                    const pct = (val / maxSub) * 100;
                    const barColor = key === 'gpu' ? 'bg-primary' : key === 'cpu' ? 'bg-secondary-fixed-dim' : 'bg-white/30';
                    return (
                      <div key={key} className="flex items-center gap-1 flex-1">
                        <span className="text-[8px] text-on-surface-variant/25 uppercase font-label-sm tracking-wider">{key === 'memory' ? 'MEM' : key.toUpperCase()}</span>
                        <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="text-[9px] text-on-surface-variant/25 font-label-sm whitespace-nowrap tabular-nums">
                  {new Date(item.createdAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {history.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center py-2.5 text-[10px] text-on-surface-variant/25 hover:text-on-surface-variant/50 transition-colors duration-200 border-t border-white/[0.04] font-label-sm tracking-wider"
        >
          {expanded ? '收起' : `展开全部 ${history.length} 条`}
        </button>
      )}
    </section>
  );
}

export default function Benchmark() {
  const { build } = useBuild();
  const [score, setScore] = useState(0);
  const [subScores, setSubScores] = useState({ gpu: 0, cpu: 0, memory: 0 });
  const [fpsData, setFpsData] = useState([]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('');
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(() => {
    setHistory(getBenchmarks());
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const startBenchmark = useCallback(() => {
    if (running) return;

    setRunning(true);
    setScore(0);
    setPhase('初始化测试引擎...');

    const phases = [
      { msg: 'GPU 3D 渲染测试...', delay: 800 },
      { msg: 'CPU 多核解算评估...', delay: 1600 },
      { msg: '内存吞吐极速考核...', delay: 2400 },
      { msg: '综合能效分析...', delay: 3200 },
    ];

    phases.forEach(({ msg, delay }) => {
      setTimeout(() => setPhase(msg), delay);
    });

    setTimeout(() => {
      const finalScore = calcBenchmarkScore(build);
      const subs = calcSubScores(build);
      const games = predictGameFPS(build);

      setScore(finalScore);
      setSubScores(subs);
      setFpsData(games);
      setRunning(false);
      setPhase('测试完成');

      const buildSummary = {};
      for (const [key, val] of Object.entries(build)) {
        if (val && !['poweredOn', 'savedName'].includes(key)) {
          buildSummary[key] = val;
        }
      }
      saveBenchmark({ score: finalScore, subScores: subs, build: buildSummary });
      loadHistory();
    }, 4000);
  }, [build, running, loadHistory]);

  const hasBuild = build.cpu || build.gpu || build.memory;
  const thermal = calcThermalHeadroom(build);
  const stability = calcStabilityRating(build);
  const temps = calcTemperatures(build);

  const gaugeColor = thermal.overall >= 60 ? 'ice' : thermal.overall >= 30 ? 'pink' : 'error';
  const stabColor = stability >= 70 ? 'primary' : stability >= 40 ? 'pink' : 'error';

  return (
    <div className="h-full animate-fade-in space-y-5">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-widest">
            跑分测试
          </h1>
          <p className="text-on-surface-variant/70 font-body-lg mt-1">脉冲仪表盘超频跑分与游戏能效检测</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant/30">
          <span className="material-symbols-outlined text-sm">info</span>
          <span>配置硬件后即可跑分</span>
        </div>
      </div>

      {/* 核心区域：3列平衡布局 */}
      <div className="grid grid-cols-12 gap-5">
        {/* 左列：系统健康 (轻量) */}
        <div className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-0 space-y-5">
            <SystemHealth build={build} temps={temps} />
            <div className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-4 md:p-5 space-y-4">
              <HUDGauge label="散热余量" value={thermal.overall} color={gaugeColor} pulse />
              <HUDGauge label="稳定性评级" value={stability} color={stabColor} />
            </div>
          </div>
        </div>

        {/* 中列：仪表盘 (主视觉) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col items-center">
          <div className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-6 md:p-8 w-full flex flex-col items-center">
            <ScoreGauge score={score} running={running} />

            {phase && (
              <div className="font-label-sm text-label-sm text-primary mt-5 animate-pulse tracking-wider">
                {phase}
              </div>
            )}

            <div className="mt-8">
              <NeonButton
                variant={running ? 'secondary' : 'primary'}
                size="lg"
                icon={running ? 'hourglass_top' : 'play_arrow'}
                onClick={startBenchmark}
                disabled={running}
              >
                {running ? '测试中...' : hasBuild ? '开始测试' : '请先配置硬件'}
              </NeonButton>
            </div>

            {!hasBuild && !running && (
              <p className="font-label-sm text-label-sm text-on-surface-variant/30 mt-4">
                前往"我的电脑"选择硬件后再来跑分
              </p>
            )}

            {score > 0 && !running && (
              <div className="mt-8 flex flex-col items-center gap-4 animate-slide-up w-full">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                <SaveBuildButton score={score} />
                <ShareButton score={score} />
              </div>
            )}
          </div>

          {/* 得分详情 - 跑分完成后显示 */}
          {score > 0 && !running && (
            <div className="w-full mt-5 bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-4 md:p-5 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-sm">lab_profile</span>
                <h3 className="font-headline-md text-headline-md text-secondary-fixed-dim/80 font-semibold">得分详情</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'GPU 渲染', value: subScores.gpu, color: 'text-primary', barColor: 'bg-primary' },
                  { label: 'CPU 多核', value: subScores.cpu, color: 'text-secondary-fixed-dim', barColor: 'bg-secondary-fixed-dim' },
                  { label: '内存读写', value: subScores.memory, color: 'text-on-surface', barColor: 'bg-white/40' },
                ].map((item) => {
                  const maxVal = Math.max(subScores.gpu, subScores.cpu, subScores.memory, 1);
                  const pct = (item.value / maxVal) * 100;
                  return (
                    <div key={item.label} className="p-4 rounded-xl bg-black/20 border border-white/[0.04]">
                      <div className="font-label-sm text-label-sm text-on-surface-variant/50 mb-2">{item.label}</div>
                      <div className={`font-headline-md text-headline-md font-semibold tabular-nums ${item.color} mb-2`}>
                        {item.value.toLocaleString()}
                      </div>
                      <div className="h-1 bg-surface-container-highest/60 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${item.barColor}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 右列：跑分历史 */}
        <div className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-0 space-y-5">
            <BenchmarkHistory history={history} onRefresh={loadHistory} />
          </div>
        </div>
      </div>

      {/* 游戏实测 - 独立全宽行 */}
      <GamePrediction fpsData={hasBuild ? fpsData : []} />
    </div>
  );
}
