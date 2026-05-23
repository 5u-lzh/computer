/**
 * 跑分计算引擎
 * 公式：总分 = GPU系数×0.7 + CPU系数×0.2 + 内存系数×0.1
 * 然后根据显卡和CPU性能推算游戏帧率
 */

import { getPart } from './compatibility';

/**
 * 计算总跑分
 */
export function calcBenchmarkScore(build) {
  const gpu = getPart('gpu', build.gpu);
  const cpu = getPart('cpu', build.cpu);
  const mem = getPart('memory', build.memory);

  const gpuPF = gpu?.pf || 0;
  const cpuPF = cpu?.pf || 0;
  const memPF = mem?.pf || 0;

  const rawScore = gpuPF * 0.7 + cpuPF * 0.2 + memPF * 0.1;
  // 映射到 0~200万 分数区间
  const baseScore = Math.round(rawScore / 100 * 2000000);

  return baseScore;
}

/**
 * 获取子项得分
 */
export function calcSubScores(build) {
  const gpu = getPart('gpu', build.gpu);
  const cpu = getPart('cpu', build.cpu);
  const mem = getPart('memory', build.memory);

  const gpuScore = ((gpu?.pf || 0) / 100) * 900000;
  const cpuScore = ((cpu?.pf || 0) / 100) * 600000;
  const memScore = ((mem?.pf || 0) / 100) * 300000;

  return {
    gpu: Math.round(gpuScore),
    cpu: Math.round(cpuScore),
    memory: Math.round(memScore),
  };
}

/**
 * 游戏帧率预测
 * returns { game: string, fhd: number, qhd: number, uhd: number }
 */
export function predictGameFPS(build) {
  const gpu = getPart('gpu', build.gpu);
  const cpu = getPart('cpu', build.cpu);
  const mem = getPart('memory', build.memory);

  const gpuPF = gpu?.pf || 30;
  const cpuPF = cpu?.pf || 30;
  const memPF = mem?.pf || 30;

  const gpuWeight = gpuPF / 100;
  const cpuWeight = cpuPF / 100;
  const memWeight = memPF / 100;

  const games = [
    {
      name: '赛博朋克 2077',
      baseFHD: 80, baseQHD: 55, baseUHD: 30,
    },
    {
      name: '黑神话：悟空',
      baseFHD: 70, baseQHD: 50, baseUHD: 25,
    },
    {
      name: '绝地求生',
      baseFHD: 150, baseQHD: 100, baseUHD: 60,
    },
    {
      name: 'Valorant',
      baseFHD: 300, baseQHD: 250, baseUHD: 180,
    },
    {
      name: '艾尔登法环',
      baseFHD: 60, baseQHD: 50, baseUHD: 30,
    },
  ];

  return games.map(game => ({
    name: game.name,
    fhd: Math.round(game.baseFHD * (0.6 + 0.4 * gpuWeight) * (0.8 + 0.2 * cpuWeight)),
    qhd: Math.round(game.baseQHD * (0.6 + 0.4 * gpuWeight) * (0.8 + 0.2 * cpuWeight)),
    uhd: Math.round(game.baseUHD * (0.6 + 0.4 * gpuWeight) * (0.8 + 0.2 * cpuWeight)),
  }));
}

/**
 * 获取跑分等级
 */
export function getScoreTier(score) {
  if (score >= 1800000) return { label: 'ELITE 超神', color: '#ff506e', icon: 'military_tech' };
  if (score >= 1200000) return { label: 'PLATINUM 铂金', color: '#d0bcff', icon: 'stars' };
  if (score >= 700000) return { label: 'GOLD 黄金', color: '#00dbe7', icon: 'verified' };
  if (score >= 300000) return { label: 'SILVER 白银', color: '#cbc3d7', icon: 'trophy' };
  return { label: 'BRONZE 青铜', color: '#958ea0', icon: 'emoji_events' };
}
