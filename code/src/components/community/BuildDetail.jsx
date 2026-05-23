import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBuildDetail, toggleLike, hasLiked, getComments, addComment, getProfile } from '../../utils/community';
import { getScoreTier } from '../../utils/benchmark';
import { useBuild } from '../../context/BuildContext';
import NeonButton from '../common/NeonButton';

const categoryLabels = {
  cpu: 'CPU', gpu: '显卡', memory: '内存', motherboard: '主板',
  storage: '硬盘', psu: '电源', cooler: '散热', case: '机箱',
};

export default function BuildDetail({ buildId, onBack }) {
  const [build, setBuild] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loadBuild } = useBuild();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [buildId]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [data, likedStatus, commentList] = await Promise.all([
        getBuildDetail(buildId),
        hasLiked(buildId),
        getComments(buildId),
      ]);
      if (!data) throw new Error('配置不存在或已被删除');
      setBuild(data);
      setLiked(likedStatus);
      setLikeCount(data.likes_count || 0);
      setComments(commentList);
    } catch (e) {
      setError(e.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }

  const handleLike = async () => {
    try {
      const result = await toggleLike(buildId);
      setLiked(result.liked);
      setLikeCount(result.count);
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await addComment(buildId, commentText.trim());
      // 获取评论者信息
      const profile = await getProfile(newComment.user_id);
      setComments(c => [...c, { ...newComment, profiles: profile }]);
      setCommentText('');
    } catch (e) {
      alert('评论失败：' + e.message);
    }
  };

  const handleImport = () => {
    const parts = build.build_data?.parts || {};
    const filtered = {};
    for (const [k, v] of Object.entries(parts)) {
      if (v && !['poweredOn', 'savedName'].includes(k)) {
        filtered[k] = v;
      }
    }
    loadBuild(filtered);
    navigate('/builder');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-on-surface-variant/30 font-label-sm">加载中...</div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <span className="text-on-surface-variant/30 font-label-sm">{error || '配置不存在'}</span>
        <NeonButton variant="ghost" size="sm" onClick={onBack}>返回</NeonButton>
      </div>
    );
  }

  const summary = build.build_data?.summary || {};
  const parts = build.build_data?.parts || {};
  const tier = getScoreTier(build.score || 0);
  const hasParts = Object.entries(parts).filter(([k, v]) => v && !['poweredOn', 'savedName'].includes(k));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 返回 + 标题 */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-on-surface-variant/30 hover:text-on-surface-variant/60 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-headline-lg text-headline-lg text-primary font-semibold truncate">{build.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-label-sm text-label-sm text-on-surface-variant/40">by {build.profiles?.username || '匿名'}</span>
            <span className="text-on-surface-variant/20">·</span>
            <span className="font-label-sm text-label-sm" style={{ color: tier.color }}>{tier.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 左列：配置详情 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 配件清单 */}
          <div className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-5">
            <h2 className="font-headline-md text-headline-md text-secondary-fixed-dim/80 font-semibold mb-4">配置清单</h2>
            <div className="space-y-2">
              {hasParts.map(([category, partId]) => {
                const part = summary[category];
                return (
                  <div key={category} className="flex items-center gap-3 p-2.5 rounded-xl bg-black/20 border border-white/[0.04]">
                    <span className="material-symbols-outlined text-primary text-sm w-5">
                      {category === 'cpu' ? 'memory' : category === 'gpu' ? 'videogame_asset' : category === 'memory' ? 'storage' : 'settings'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-label-sm text-label-sm text-on-surface-variant/40">{categoryLabels[category] || category}</div>
                      <div className="font-headline-sm text-headline-sm text-on-surface text-sm truncate">{part?.name || partId}</div>
                    </div>
                    {part?.price && (
                      <span className="font-label-sm text-label-sm text-secondary-fixed-dim tabular-nums">¥{part.price.toLocaleString()}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 描述 */}
          {build.description && (
            <div className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-5">
              <p className="font-body-lg text-body-lg text-on-surface-variant/70 leading-relaxed">{build.description}</p>
            </div>
          )}

          {/* 评论区 */}
          <div className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-5">
            <h2 className="font-headline-md text-headline-md text-secondary-fixed-dim/80 font-semibold mb-4">
              评论 ({comments.length})
            </h2>
            <div className="space-y-3 mb-4">
              {comments.length === 0 && (
                <div className="text-center py-6 text-on-surface-variant/30 font-label-sm">暂无评论，来说两句</div>
              )}
              {comments.map(c => (
                <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-black/20 border border-white/[0.04]">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-xs">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-label-sm text-label-sm text-primary text-xs">{c.profiles?.username || '匿名'}</span>
                      <span className="text-[9px] text-on-surface-variant/20">
                        {new Date(c.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="font-body-lg text-body-lg text-on-surface-variant/70 text-sm">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="写评论..."
                className="flex-1 bg-black/30 border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/40 transition-colors"
                onKeyDown={e => e.key === 'Enter' && handleComment()}
              />
              <NeonButton variant="primary" size="sm" icon="send" onClick={handleComment} disabled={!commentText.trim()}>
                发送
              </NeonButton>
            </div>
          </div>
        </div>

        {/* 右列：操作面板 */}
        <div className="space-y-4">
          <div className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-5">
            <div className="text-center mb-5">
              <div className="font-headline-2xl text-headline-2xl font-bold tabular-nums" style={{ color: tier.color }}>
                {build.score?.toLocaleString() || 'N/A'}
              </div>
              <div className="font-label-sm text-label-sm text-on-surface-variant/40 mt-1">跑分</div>
            </div>

            <div className="space-y-3">
              <NeonButton variant="primary" size="sm" icon="bolt" className="w-full" onClick={handleImport}>
                一键导入到我的电脑
              </NeonButton>
              <button
                onClick={handleLike}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200 text-sm"
                style={{
                  borderColor: liked ? 'rgba(208,188,255,0.3)' : 'rgba(255,255,255,0.06)',
                  color: liked ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                  backgroundColor: liked ? 'rgba(208,188,255,0.08)' : 'transparent',
                }}
              >
                <span className="material-symbols-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>
                <span>{likeCount}</span>
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] p-5">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant/50 uppercase tracking-wider mb-3">配置概览</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant/50">配件数</span>
                <span className="text-on-surface">{hasParts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant/50">发布时间</span>
                <span className="text-on-surface tabular-nums">{new Date(build.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant/50">点赞</span>
                <span className="text-on-surface">{likeCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
