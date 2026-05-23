import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBuilds, getMyBuilds, ensureUser, publishBuild, deleteBuild } from '../../utils/community';
import { useBuild } from '../../context/BuildContext';
import { getScoreTier } from '../../utils/benchmark';
import { getPart } from '../../utils/compatibility';
import NeonButton from '../common/NeonButton';
import Skeleton from '../common/Skeleton';
import StaggerEnter from '../common/StaggerEnter';
import PublishModal from './PublishModal';
import BuildDetail from './BuildDetail';

const categoryIcons = {
  cpu: 'memory', gpu: 'videogame_asset', memory: 'storage',
  motherboard: 'developer_board', storage: 'hard_drive',
  psu: 'bolt', cooler: 'ac_unit', case: 'dns',
};

function BuildCard({ item, onImport, onDelete }) {
  const tier = getScoreTier(item.score || 0);
  const navigate = useNavigate();

  return (
    <div className="group bg-surface-container-low/30 backdrop-blur-sm rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* 顶部装饰 */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${tier.color}44, ${tier.color}22, transparent)` }} />

      <div className="p-4">
        {/* 标题行 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="font-headline-md text-headline-md text-primary font-semibold truncate">{item.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-label-sm text-label-sm text-on-surface-variant/40">{item.profiles?.username || '匿名'}</span>
              <span className="text-on-surface-variant/20">·</span>
              <span className="font-label-sm text-label-sm" style={{ color: tier.color }}>{tier.label}</span>
            </div>
          </div>
        </div>

        {/* 分数 */}
        <div className="font-headline-sm text-headline-sm font-bold tabular-nums mb-3" style={{ color: tier.color }}>
          {item.score?.toLocaleString() || 'N/A'}
        </div>

        {/* 统计 */}
        <div className="flex items-center gap-4 text-xs text-on-surface-variant/40 mb-4">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">favorite</span>
            {item.likes_count || 0}
          </span>
          <span className="tabular-nums">{new Date(item.created_at).toLocaleDateString('zh-CN')}</span>
        </div>

        {/* 操作 */}
        <div className="flex gap-2 pt-3 border-t border-white/[0.05]">
          <NeonButton variant="primary" size="sm" icon="visibility" onClick={() => onImport(item)}>
            查看
          </NeonButton>
          <NeonButton variant="ghost" size="sm" icon="bolt" onClick={() => {
            const parts = item.build_data?.parts || {};
            const filtered = {};
            for (const [k, v] of Object.entries(parts)) {
              if (v && !['poweredOn', 'savedName'].includes(k)) filtered[k] = v;
            }
            loadBuildToContext(filtered);
            navigate('/builder');
          }}>
            导入
          </NeonButton>
        </div>
      </div>
    </div>
  );
}

// 用于导入的全局引用（避免 hooks 问题）
let loadBuildToContext = () => {};

export default function Community() {
  const navigate = useNavigate();
  const { build, loadBuild } = useBuild();
  const [builds, setBuilds] = useState([]);
  const [myBuilds, setMyBuilds] = useState([]);
  const [sort, setSort] = useState('latest');
  const [tab, setTab] = useState('explore');
  const [showPublish, setShowPublish] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(null);

  loadBuildToContext = loadBuild;

  // 初始化：匿名登录
  useEffect(() => {
    (async () => {
      try {
        const { user: u } = await ensureUser();
        setUser(u);
        setLoginError(null);
      } catch (e) {
        console.error('登录失败', e);
        setLoginError(e.message || '未知错误');
      }
    })();
  }, []);

  // 加载列表
  const fetchBuilds = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'mine') {
        const list = await getMyBuilds();
        setMyBuilds(list);
      } else {
        const { builds: list } = await getBuilds(sort);
        setBuilds(list);
      }
    } catch (e) {
      console.error('加载社区配置失败', e);
    } finally {
      setLoading(false);
    }
  }, [tab, sort]);

  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);

  // 发布
  const handlePublish = async ({ name, description }) => {
    const parts = {};
    const summary = {};
    for (const [category, partId] of Object.entries(build)) {
      if (['poweredOn', 'savedName'].includes(category)) continue;
      if (partId) {
        parts[category] = partId;
        const part = getPart(category, partId);
        if (part) summary[category] = { name: part.name, price: part.price, pf: part.pf, spec: part.spec };
      }
    }
    await publishBuild({ name, description, buildParts: parts, buildSummary: summary, score: null });
    fetchBuilds();
  };

  // 查看详情
  const handleViewDetail = (item) => {
    setSelectedBuild(item);
  };

  // 删除
  const handleDelete = async (id) => {
    if (!confirm('确定删除这条发布？')) return;
    await deleteBuild(id);
    fetchBuilds();
  };

  const displayList = tab === 'mine' ? myBuilds : builds;

  if (selectedBuild) {
    return <BuildDetail buildId={selectedBuild.id} onBack={() => setSelectedBuild(null)} />;
  }

  return (
    <div className="h-full space-y-5">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-widest">
            配置社区
          </h1>
          <p className="text-on-surface-variant/70 font-body-lg mt-1">浏览其他玩家的配置方案，分享你的信仰之机</p>
        </div>
        <NeonButton variant="primary" icon="add" onClick={() => {
          const hasParts = Object.entries(build).filter(([k, v]) => !['poweredOn', 'savedName'].includes(k) && v).length > 0;
          if (!hasParts) {
            alert('请先在"我的电脑"配置硬件后再发布');
            return;
          }
          setShowPublish(true);
        }}>
          发布配置
        </NeonButton>
      </div>

      {/* Tab 切换 */}
      <div className="flex items-center gap-1 bg-surface-container/50 rounded-xl p-0.5 border border-white/[0.04] w-fit">
        <button
          onClick={() => setTab('explore')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            tab === 'explore' ? 'bg-primary/15 text-primary shadow-sm' : 'text-on-surface-variant/50 hover:text-on-surface-variant/70'
          }`}
        >
          <span className="material-symbols-outlined text-sm mr-1 align-middle">explore</span>
          探索
        </button>
        <button
          onClick={() => setTab('mine')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            tab === 'mine' ? 'bg-primary/15 text-primary shadow-sm' : 'text-on-surface-variant/50 hover:text-on-surface-variant/70'
          }`}
        >
          <span className="material-symbols-outlined text-sm mr-1 align-middle">person</span>
          我的发布
        </button>
      </div>

      {/* 排序（探索模式） */}
      {tab === 'explore' && (
        <div className="flex gap-2">
          <button
            onClick={() => setSort('latest')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200 ${
              sort === 'latest' ? 'bg-primary/15 text-primary' : 'text-on-surface-variant/30 hover:text-on-surface-variant/50'
            }`}
          >
            最新
          </button>
          <button
            onClick={() => setSort('popular')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200 ${
              sort === 'popular' ? 'bg-primary/15 text-primary' : 'text-on-surface-variant/30 hover:text-on-surface-variant/50'
            }`}
          >
            最热
          </button>
        </div>
      )}

      {/* 列表 */}
      {loginError && (
        <div className="p-4 rounded-xl bg-tertiary/10 border border-tertiary/20 text-tertiary text-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-sm">error</span>
            <span className="font-semibold">连接 Supabase 失败</span>
          </div>
          <p className="text-tertiary/80 text-xs ml-6">{loginError}</p>
          <p className="text-tertiary/60 text-xs ml-6 mt-2">
            请确认：① Supabase 匿名登录已开启 (Authentication → Settings → Enable anonymous sign-ins) ② 已运行建表 SQL
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-3xl text-white/10">dns</span>
          <p className="text-on-surface-variant/30 font-label-sm">
            {tab === 'mine' ? '你还没有发布过配置' : '社区暂无配置，来做第一个分享者'}
          </p>
          {tab === 'mine' && (
            <NeonButton variant="primary" size="sm" icon="add" onClick={() => setShowPublish(true)}>
              发布配置
            </NeonButton>
          )}
        </div>
      ) : (
        <StaggerEnter baseDelay={80} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayList.map(item => (
            <BuildCard
              key={item.id}
              item={item}
              onImport={handleViewDetail}
              onDelete={handleDelete}
            />
          ))}
        </StaggerEnter>
      )}

      {/* 发布弹窗 */}
      <PublishModal
        isOpen={showPublish}
        onClose={() => setShowPublish(false)}
        onPublish={handlePublish}
        currentBuild={build}
      />
    </div>
  );
}
