const STORAGE_KEY = 'core-build-collections';

/**
 * 获取所有收藏配置
 */
export function getCollections() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 保存收藏配置
 */
export function saveCollection(config) {
  const collections = getCollections();
  const newItem = {
    ...config,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
  };
  collections.unshift(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  return newItem;
}

/**
 * 删除收藏配置
 */
export function deleteCollection(id) {
  const collections = getCollections().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  return collections;
}

/**
 * 更新收藏配置
 */
export function updateCollection(id, updates) {
  const collections = getCollections().map(c =>
    c.id === id ? { ...c, ...updates } : c
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  return collections;
}

// === 跑分历史 ===

const BENCHMARK_KEY = 'core-build-benchmarks';

/**
 * 获取所有跑分历史
 */
export function getBenchmarks() {
  try {
    const data = localStorage.getItem(BENCHMARK_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 保存一次跑分结果
 */
export function saveBenchmark(result) {
  const list = getBenchmarks();
  const newItem = {
    ...result,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
  };
  list.unshift(newItem);
  // 只保留最近 20 条
  if (list.length > 20) list.length = 20;
  localStorage.setItem(BENCHMARK_KEY, JSON.stringify(list));
  return newItem;
}

/**
 * 删除一条跑分记录
 */
export function deleteBenchmark(id) {
  const list = getBenchmarks().filter(b => b.id !== id);
  localStorage.setItem(BENCHMARK_KEY, JSON.stringify(list));
  return list;
}
