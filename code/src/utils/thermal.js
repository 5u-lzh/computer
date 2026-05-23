/**
 * 热力学计算引擎
 * 根据实际配置计算温度、散热余量、稳定性评级
 */

import { getPart } from './compatibility';
import { calcTotalPower } from './compatibility';

const AMBIENT_TEMP = 25;         // 室温 25°C
const GPU_COOLER_BASELINE = 400; // 显卡散热器基准解热能力 (W)

/**
 * 估算 CPU/GPU 待机和满载温度
 * @param {Object} build - 当前配置
 * @param {number} ambientTemp - 环境温度（默认 25°C）
 * @returns {{ cpu: { idle: number, load: number }, gpu: { idle: number, load: number } }}
 */
export function calcTemperatures(build, ambientTemp = AMBIENT_TEMP) {
  const cpu = getPart('cpu', build.cpu);
  const gpu = getPart('gpu', build.gpu);
  const cooler = getPart('cooler', build.cooler);

  const cpuTdp = cpu?.power || 0;
  const gpuTdp = gpu?.power || 0;
  const coolerTdp = cooler?.coolingTdp || 150; // 没选散热器默认 Intel 原装级别

  // CPU 温度模型
  const cpuLoadRatio = cpuTdp / coolerTdp;
  const cpuIdle = Math.min(ambientTemp + 5 + cpuLoadRatio * 20, 55);
  const cpuLoad = Math.min(ambientTemp + 10 + cpuLoadRatio * 55, 100);

  // GPU 温度模型（GPU 自带散热器）
  const gpuLoadRatio = gpuTdp / GPU_COOLER_BASELINE;
  const gpuIdle = Math.min(ambientTemp + 5 + gpuLoadRatio * 15, 50);
  const gpuLoad = Math.min(ambientTemp + 10 + gpuLoadRatio * 45, 88);

  return {
    cpu: { idle: Math.round(cpuIdle), load: Math.round(cpuLoad) },
    gpu: { idle: Math.round(gpuIdle), load: Math.round(gpuLoad) },
  };
}

/**
 * 计算散热余量（百分比）
 * 基于 CPU 满载温度距临界值的距离
 * @param {Object} build
 * @returns {{ cpu: number, gpu: number, overall: number }}
 */
export function calcThermalHeadroom(build) {
  const temps = calcTemperatures(build);
  const CPU_CRITICAL = 100;
  const GPU_CRITICAL = 85;

  const cpuHeadroom = Math.max(0, Math.round((1 - temps.cpu.load / CPU_CRITICAL) * 100));
  const gpuHeadroom = Math.max(0, Math.round((1 - temps.gpu.load / GPU_CRITICAL) * 100));
  const overall = Math.round((cpuHeadroom + gpuHeadroom) / 2);

  return { cpu: cpuHeadroom, gpu: gpuHeadroom, overall };
}

/**
 * 计算稳定性评级 (0-100)
 * 综合：散热余量 40% + 电源余量 30% + 兼容性 30%
 * @param {Object} build
 * @returns {number}
 */
export function calcStabilityRating(build) {
  const cpu = getPart('cpu', build.cpu);
  const gpu = getPart('gpu', build.gpu);
  const psu = getPart('psu', build.psu);

  // 1. 散热稳定性 (40%)
  const headroom = calcThermalHeadroom(build);
  const thermalScore = headroom.overall;

  // 2. 电源余量 (30%)
  let psuScore = 50;
  if (psu) {
    const totalPower = calcTotalPower(build);
    const psuWatt = parseInt(psu.spec.match(/(\d+)W/)?.[1] || psu.power);
    const ratio = psuWatt / (totalPower || 1);
    if (ratio >= 1.5) psuScore = 100;
    else if (ratio >= 1.3) psuScore = 90;
    else if (ratio >= 1.15) psuScore = 75;
    else if (ratio >= 1.0) psuScore = 55;
    else if (ratio >= 0.8) psuScore = 30;
    else psuScore = 10;
  }

  // 3. 兼容性 (30%)
  // 有核心部件即可，缺少越多分数越低
  let compScore = 0;
  if (build.motherboard) compScore += 25;
  if (build.cpu) compScore += 25;
  if (build.gpu) compScore += 20;
  if (build.memory) compScore += 15;
  if (build.storage) compScore += 10;
  if (build.psu) compScore += 5;

  // CPU/主板插槽不匹配惩罚
  if (cpu && build.motherboard) {
    const mb = getPart('motherboard', build.motherboard);
    if (mb && cpu.socket !== mb.socket) {
      compScore = Math.max(0, compScore - 40);
    }
  }

  const rating = Math.round(thermalScore * 0.4 + psuScore * 0.3 + compScore * 0.3);
  return Math.min(100, Math.max(0, rating));
}

/**
 * 计算满载总功耗
 * @param {Object} build
 * @returns {number}
 */
export function calcFullLoadPower(build) {
  return calcTotalPower(build);
}

/**
 * 获取风扇转速估算 (RPM)
 * @param {Object} build
 * @param {'idle'|'load'} mode
 * @returns {number}
 */
export function calcFanRPM(build, mode = 'idle') {
  const temps = calcTemperatures(build);
  const cpuTemp = mode === 'load' ? temps.cpu.load : temps.cpu.idle;
  // 30°C → 600 RPM,  60°C → 1200 RPM,  85°C → 2000 RPM
  const rpm = Math.round(400 + (cpuTemp - 25) * 20);
  return Math.min(2200, Math.max(0, rpm));
}

/**
 * 获取温度对应的视觉颜色 (HSL)
 * @param {number} temp - 当前温度
 * @param {number} maxTemp - 危险温度阈值
 * @returns {string} hsl 颜色
 */
export function tempToColor(temp, maxTemp = 85) {
  const ratio = Math.min(temp / maxTemp, 1);
  // 蓝(0.55) → 青(0.45) → 绿(0.3) → 黄(0.15) → 红(0.0)
  const hue = (1 - ratio) * 0.55;
  const saturation = 80 + ratio * 20;
  const lightness = 50 + (1 - ratio) * 20;
  return `hsl(${hue * 360}, ${saturation}%, ${lightness}%)`;
}
