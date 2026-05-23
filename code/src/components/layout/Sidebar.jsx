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
    <aside className="fixed left-0 top-16 h-[calc(100vh-112px)] z-40 flex flex-col py-5 px-2 bg-surface-container/30 backdrop-blur-xl border-r border-white/[0.06] shadow-[5px_0_25px_rgba(0,0,0,0.3)] w-64 hidden md:flex">
      {/* 用户信息 */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full border border-primary/50 shadow-[0_0_10px_rgba(208,188,255,0.4)] bg-gradient-to-br from-primary/20 to-secondary-fixed-dim/20 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm text-primary leading-tight">
              BUILDER_001
            </div>
            <div className="text-[10px] text-on-surface-variant/60 font-label-sm">
              装机架构师
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/builder')}
          className="w-full bg-primary/20 border border-primary text-primary font-bold py-2 rounded-lg
            hover:bg-primary/30 transition-all duration-200 text-sm tracking-wider active:scale-[0.98]
            shadow-[0_0_15px_rgba(208,188,255,0.2)]"
        >
          新建配置
        </button>
      </div>

      {/* 导航 */}
      <nav className="flex flex-col flex-1 gap-1 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center gap-3 px-4 py-2.5 transition-all duration-200 font-medium text-sm w-full text-left
                ${isActive
                  ? 'bg-primary/20 text-primary border-r-4 border-primary translate-x-0.5'
                  : 'text-on-surface-variant/70 hover:bg-white/[0.04] hover:text-on-surface-variant rounded-lg'
                }
              `}
            >
              <span className={`material-symbols-outlined text-lg transition-all duration-200 ${isActive ? '' : ''}`}>
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* CPU 负载仪表盘 */}
      <div className="px-4 mt-auto pt-4 border-t border-white/[0.04]">
        <div className="bg-surface-container-high/60 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-label-sm text-[10px] text-on-surface-variant/70">CPU LOAD</span>
            <span className="font-label-sm text-[10px] text-secondary-fixed-dim">32%</span>
          </div>
          <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
            <div className="bg-secondary-fixed-dim h-full w-[32%] shadow-[0_0_8px_#00dbe7]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
