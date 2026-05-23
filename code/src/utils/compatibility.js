import hardware from '../data/hardware.json';

/**
 * 计算总功耗
 */
export function calcTotalPower(build) {
  let total = 0;
  for (const category of Object.keys(hardware)) {
    const partId = build[category];
    if (partId) {
      const part = hardware[category].find(p => p.id === partId);
      if (part) total += part.power || 0;
    }
  }
  return total;
}

/**
 * 检测兼容性问题
 * returns [{ type: 'error'|'warning', message: string }]
 */
export function checkCompatibility(build) {
  const warnings = [];

  const cpu = getPart('cpu', build.cpu);
  const mb = getPart('motherboard', build.motherboard);
  const psu = getPart('psu', build.psu);

  // CPU / 主板 插槽匹配
  if (cpu && mb && cpu.socket !== mb.socket) {
    warnings.push({
      type: 'error',
      message: `CPU 插槽 (${cpu.socket}) 与 主板插槽 (${mb.socket}) 不兼容！请选择匹配的插槽类型。`,
    });
  }

  // 电源功率检测
  if (psu) {
    const totalPower = calcTotalPower(build);
    const psuName = psu.name;
    const psuWatt = parseInt(psu.spec.match(/(\d+)W/)?.[1] || 0);
    if (psuWatt > 0 && totalPower > psuWatt * 0.9) {
      warnings.push({
        type: 'error',
        message: `电源功率不足！当前配置总功耗 ${totalPower}W，${psuName} 额定 ${psuWatt}W，建议升级更大功率电源。`,
      });
    } else if (psuWatt > 0 && totalPower > psuWatt * 0.7) {
      warnings.push({
        type: 'warning',
        message: `电源负载较高 (${totalPower}W / ${psuWatt}W)，建议预留更多余量。`,
      });
    }
  }

  // 缺少关键组件
  if (!build.cpu) warnings.push({ type: 'error', message: '⚠ 未安装 CPU 处理器' });
  if (!build.gpu) warnings.push({ type: 'warning', message: '⚠ 未安装 独立显卡（核显可临时点亮）' });
  if (!build.memory) warnings.push({ type: 'error', message: '⚠ 未安装 内存条' });
  if (!build.motherboard) warnings.push({ type: 'error', message: '⚠ 未安装 主板' });
  if (!build.storage) warnings.push({ type: 'warning', message: '⚠ 未安装 硬盘（无法安装操作系统）' });
  if (!build.psu) warnings.push({ type: 'error', message: '⚠ 未安装 电源（无法通电）' });

  return warnings;
}

/**
 * 检查是否可以开机（所有关键部件齐全）
 */
export function canPowerOn(build) {
  return !!(build.cpu && build.memory && build.motherboard && build.psu);
}

/**
 * 获取硬件详情
 */
export function getPart(category, id) {
  if (!id || !hardware[category]) return null;
  return hardware[category].find(p => p.id === id) || null;
}

/**
 * 获取所有硬件分类
 */
export function getAllCategories() {
  return Object.keys(hardware);
}

/**
 * 按分类获取所有硬件
 */
export function getPartsByCategory(category) {
  return hardware[category] || [];
}

/**
 * 获取分类中文名
 */
export function getCategoryLabel(category) {
  const labels = {
    cpu: 'CPU 处理器',
    gpu: '显卡',
    memory: '内存',
    motherboard: '主板',
    storage: '硬盘',
    psu: '电源',
    cooler: '散热器',
    case: '机箱',
  };
  return labels[category] || category;
}

/**
 * 获取分类图标
 */
export function getCategoryIcon(category) {
  const icons = {
    cpu: 'memory',
    gpu: 'videogame_asset',
    memory: 'storage',
    motherboard: 'developer_board',
    storage: 'hard_drive',
    psu: 'bolt',
    cooler: 'ac_unit',
    case: 'dns',
  };
  return icons[category] || 'settings';
}

export default hardware;
