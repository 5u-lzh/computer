import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: '大神推荐', icon: 'verified' },
  { path: '/builder', label: '我的电脑', icon: 'memory' },
  { path: '/benchmark', label: '跑分测试', icon: 'speed' },
  { path: '/collection', label: '我的收藏', icon: 'favorite' },
  { path: '/community', label: '配置社区', icon: 'public' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex flex-col py-5 px-2 bg-surface-container/30 backdrop-blur-xl border-r border-white/[0.06] shadow-[5px_0_25px_rgba(0,0,0,0.3)] w-56 hidden md:flex rounded-r-2xl">
      {/* 用户信息 */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-secondary-fixed-dim/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md text-primary leading-tight text-sm font-semibold">
              BUILDER_001
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant/60">
              装机架构师
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/builder')}
          className="w-full bg-primary/15 border border-primary/30 text-primary font-semibold py-2 rounded-xl
            hover:bg-primary/25 hover:shadow-[0_0_15px_rgba(208,188,255,0.2)]
            transition-all duration-200 text-sm tracking-wider active:scale-[0.98]"
        >
          + 新建配置
        </button>
      </div>

      {/* 导航 */}
      <nav className="flex flex-col flex-1 gap-0.5 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm w-full text-left
                ${isActive
                  ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(208,188,255,0.15)]'
                  : 'text-on-surface-variant/70 hover:bg-white/[0.04] hover:text-on-surface-variant'
                }
              `}
            >
              <span className={`material-symbols-outlined text-lg transition-all duration-200 ${isActive ? 'text-primary' : ''}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1 h-4 rounded-full bg-primary shadow-[0_0_6px_rgba(208,188,255,0.5)] animate-pulse-dot" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 底部设置 */}
      <div className="px-2 mt-auto pt-4 border-t border-white/[0.04]">
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
            location.pathname === '/settings'
              ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(208,188,255,0.15)]'
              : 'text-on-surface-variant/50 hover:bg-white/[0.04] hover:text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          <span>设置</span>
          {location.pathname === '/settings' && (
            <span className="ml-auto w-1 h-4 rounded-full bg-primary shadow-[0_0_6px_rgba(208,188,255,0.5)]" />
          )}
        </button>
      </div>
    </aside>
  );
}
