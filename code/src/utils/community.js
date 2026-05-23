import { supabase } from '../lib/supabase';

// 模块级用户缓存 —— 确保登录状态持续有效
let _currentUser = null;
let _currentProfile = null;

/**
 * 获取缓存的用户（同步）
 */
export function getCachedUser() {
  return _currentUser;
}

/**
 * 获取缓存的 profile（同步）
 */
export function getCachedProfile() {
  return _currentProfile;
}

/**
 * 匿名登录 + 确保 profile 存在
 */
export async function ensureUser() {
  // 尝试从缓存获取
  if (_currentUser) {
    return { user: _currentUser, profile: _currentProfile };
  }

  // 尝试恢复已有 session
  const { data: { session } } = await supabase.auth.getSession();
  let user = session?.user;

  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    user = data.user;
  }

  _currentUser = user;

  // 确保 profile 存在
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    const username = '玩家' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: user.id, username, display_name: username })
      .select()
      .single();

    if (insertError) {
      // 可能并发插入冲突，再查一次
      const { data: retry } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      _currentProfile = retry;
    } else {
      _currentProfile = newProfile;
    }
  } else {
    _currentProfile = profile;
  }

  return { user: _currentUser, profile: _currentProfile };
}

/**
 * 获取当前登录用户
 */
export async function getCurrentUser() {
  if (_currentUser) return _currentUser;
  const { data: { session } } = await supabase.auth.getSession();
  _currentUser = session?.user || null;
  return _currentUser;
}

/**
 * 获取当前用户 profile
 */
export async function getProfile(userId) {
  // 缓存命中直接返回
  if (_currentProfile && _currentProfile.id === userId) return _currentProfile;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

/** ===== 配置操作 ===== */

/**
 * 发布配置到社区
 */
export async function publishBuild({ name, description, buildParts, buildSummary, score }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('未登录');

  const buildData = { parts: buildParts, summary: buildSummary };

  const { data, error } = await supabase
    .from('builds')
    .insert({
      user_id: user.id,
      name,
      description: description || '',
      build_data: buildData,
      score: score || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 获取配置列表
 */
export async function getBuilds(sort = 'latest', page = 0, limit = 12) {
  let query = supabase
    .from('builds')
    .select('id, name, score, description, likes_count, created_at, user_id');

  if (sort === 'popular') {
    query = query.order('likes_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const from = page * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error } = await query;
  if (error) throw error;

  // 批量获取用户名
  const userIds = [...new Set((data || []).map(b => b.user_id))];
  const profilesMap = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds);
    (profiles || []).forEach(p => { profilesMap[p.id] = p; });
  }

  const builds = (data || []).map(b => ({
    ...b,
    profiles: profilesMap[b.user_id] || { username: '匿名' },
  }));

  return { builds, count: 0 };
}

/**
 * 获取单个配置详情
 */
export async function getBuildDetail(id) {
  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('配置不存在');

  // 获取发布者信息
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', data.user_id)
    .single();

  return { ...data, profiles: profile || { username: '匿名' } };
}

/**
 * 删除自己的配置
 */
export async function deleteBuild(id) {
  const { error } = await supabase
    .from('builds')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * 获取当前用户的发布
 */
export async function getMyBuilds() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from('builds')
    .select('id, name, score, description, likes_count, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return data || [];
}

/** ===== 点赞 ===== */

export async function toggleLike(buildId) {
  const user = await getCurrentUser();
  if (!user) throw new Error('未登录');

  const { data: existing } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('build_id', buildId)
    .maybeSingle();

  if (existing) {
    await supabase.from('likes').delete().eq('user_id', user.id).eq('build_id', buildId);
    await supabase.rpc('decrement_likes', { bid: buildId });
  } else {
    await supabase.from('likes').insert({ user_id: user.id, build_id: buildId });
    await supabase.rpc('increment_likes', { bid: buildId });
  }

  // 从数据库获取最新点赞数，保证状态同步
  const { data: updated } = await supabase
    .from('builds')
    .select('likes_count')
    .eq('id', buildId)
    .single();

  return { liked: !existing, count: updated?.likes_count ?? 0 };
}

export async function hasLiked(buildId) {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('build_id', buildId)
    .maybeSingle();

  return !!data;
}

/** ===== 评论 ===== */

export async function getComments(buildId) {
  const { data } = await supabase
    .from('comments')
    .select('*, profiles(username)')
    .eq('build_id', buildId)
    .order('created_at', { ascending: true });

  return data || [];
}

export async function addComment(buildId, content) {
  const user = await getCurrentUser();
  if (!user) throw new Error('未登录');

  const { data, error } = await supabase
    .from('comments')
    .insert({ build_id: buildId, user_id: user.id, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}
