/**
 * 预算规划引擎
 * 暴力枚举最优硬件搭配，在预算约束下最大化跑分
 */
import hardware from '../data/hardware.json';

const SCORING_CATS = ['gpu', 'cpu', 'memory'];
const NON_SCORING_CATS = ['motherboard', 'storage', 'psu', 'cooler', 'case'];

/** 计算跑分（与 benchmark.js 公式一致） */
function calculateScore(gpu, cpu, mem) {
  const rawScore = (gpu?.pf || 0) * 0.7 + (cpu?.pf || 0) * 0.2 + (mem?.pf || 0) * 0.1;
  return Math.round(rawScore / 100 * 2000000);
}

/** 获取兼容某 socket 的最便宜主板 */
function cheapestMBForSocket(socket) {
  const compatible = hardware.motherboard.filter((m) => m.socket === socket);
  if (compatible.length === 0) return null;
  return compatible.reduce((a, b) => (a.price < b.price ? a : b));
}

/** 获取某类别中最便宜的配件 */
function cheapestInCategory(cat) {
  return hardware[cat].reduce((a, b) => (a.price < b.price ? a : b));
}

/** 在非评分类别中贪心升级配件，花光剩余预算 */
function upgradeNonScoring(parts, remainingBudget) {
  const upgraded = { ...parts };

  for (const cat of NON_SCORING_CATS) {
    if (cat === 'motherboard') continue; // 主板已由 socket 决定，不改
    const sorted = [...hardware[cat]].sort((a, b) => a.price - b.price);
    const currentIdx = sorted.findIndex((p) => p.id === upgraded[cat].id);
    if (currentIdx === -1) continue;

    // 尝试升级到更贵的版本
    for (let i = currentIdx + 1; i < sorted.length; i++) {
      const diff = sorted[i].price - sorted[currentIdx].price;
      if (diff <= remainingBudget) {
        upgraded[cat] = sorted[i];
        remainingBudget -= diff;
      }
    }
  }

  return { parts: upgraded, remainingBudget };
}

/**
 * 在目标预算内寻找最优配置
 * @param {number} targetBudget
 * @returns {object|null} { parts, totalPrice, score }
 */
function findOptimalBuild(targetBudget) {
  let best = null;
  let bestScore = -1;

  // 预计算非评分类别最便宜选项
  const cheapestNonScoring = {};
  for (const cat of NON_SCORING_CATS) {
    if (cat !== 'motherboard') {
      cheapestNonScoring[cat] = cheapestInCategory(cat);
    }
  }

  // 暴力枚举所有 GPU × CPU × 内存 组合
  for (const gpu of hardware.gpu) {
    for (const cpu of hardware.cpu) {
      const mb = cheapestMBForSocket(cpu.socket);
      if (!mb) continue;

      for (const mem of hardware.memory) {
        const parts = {
          gpu,
          cpu,
          memory: mem,
          motherboard: mb,
          ...cheapestNonScoring,
        };

        const totalPrice = Object.values(parts).reduce((sum, p) => sum + p.price, 0);
        if (totalPrice > targetBudget) continue;

        const score = calculateScore(gpu, cpu, mem);
        if (score > bestScore) {
          bestScore = score;
          best = { parts: { ...parts }, totalPrice, score };
        }
      }
    }
  }

  if (!best) return null;

  // 用剩余预算升级非评分配件
  const remaining = targetBudget - best.totalPrice;
  if (remaining > 0) {
    const upgraded = upgradeNonScoring(best.parts, remaining);
    best.parts = upgraded.parts;
    best.totalPrice = Object.values(upgraded.parts).reduce((sum, p) => sum + p.price, 0);
  }

  return best;
}

/**
 * 生成 3 套预算方案
 * @param {number} userBudget
 * @returns {object} { economy, balanced, extreme, minBudget, maxBudget }
 */
export function generatePlans(userBudget) {
  // 计算最低可行预算
  const minBudget = calculateMinBudget();
  const maxBudget = calculateMaxBudget();

  if (userBudget < minBudget) {
    return { economy: null, balanced: null, extreme: null, minBudget, maxBudget };
  }

  const targets = [
    { key: 'economy', multiplier: 0.6 },
    { key: 'balanced', multiplier: 0.85 },
    { key: 'extreme', multiplier: 1.0 },
  ];

  const plans = {};
  for (const { key, multiplier } of targets) {
    const target = Math.round(userBudget * multiplier);
    const plan = findOptimalBuild(target);
    if (plan) {
      // 计算预算使用率
      plan.budgetUsage = plan.totalPrice;
      plan.budgetTarget = target;
    }
    plans[key] = plan;
  }

  return { ...plans, minBudget, maxBudget };
}

/** 计算最低可行配置总价 */
function calculateMinBudget() {
  // 最便宜 CPU (i7-14700K, LGA1700)
  const cpu = cheapestInCategory('cpu');
  const mb = cheapestMBForSocket(cpu.socket);
  const gpu = cheapestInCategory('gpu');
  const mem = cheapestInCategory('memory');
  const storage = cheapestInCategory('storage');
  const psu = cheapestInCategory('psu');
  const cooler = cheapestInCategory('cooler');
  const case_ = cheapestInCategory('case');
  return gpu.price + cpu.price + mem.price + mb.price
    + storage.price + psu.price + cooler.price + case_.price;
}

/** 计算最高配置总价 */
function calculateMaxBudget() {
  const mostExpensive = (cat) => hardware[cat].reduce((a, b) => (a.price > b.price ? a : b));
  let total = 0;
  for (const cat of [...SCORING_CATS, ...NON_SCORING_CATS]) {
    total += mostExpensive(cat).price;
  }
  return total;
}
