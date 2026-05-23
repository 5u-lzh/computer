import React from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import BottomRGBPanel from './BottomRGBPanel';
import ParticleField from '../common/ParticleField';
export default function Layout({ children }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background selection:bg-primary/20 selection:text-on-background">
      <ParticleField />
      {/* 网格背景 */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      {/* 扫描线 - 动画 */}
      <div className="fixed inset-0 scanline-overlay pointer-events-none opacity-20 animate-scanline" />
      {/* 环境光 - 多方向 */}
      <div className="fixed inset-0 bg-gradient-to-br from-surface-container-lowest via-transparent via-60% to-primary/[0.04] pointer-events-none" />
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-secondary-fixed-dim/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -left-32 w-80 h-80 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-20 -right-20 w-64 h-64 bg-tertiary/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* 暗角 */}
      <div className="fixed inset-0 cyber-vignette pointer-events-none" />

      <TopBar />
      <Sidebar />

      {/* 主内容区 */}
      <main className="fixed top-16 left-0 md:left-64 right-0 bottom-20 overflow-y-auto px-margin-mobile md:px-margin-desktop py-lg animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <BottomRGBPanel />
    </div>
  );
}
