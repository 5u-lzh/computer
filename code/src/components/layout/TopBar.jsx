import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuild } from '../../context/BuildContext';
import hardware from '../../data/hardware.json';

const categoryLabels = {
  cpu: 'CPU 处理器',
  gpu: '显卡',
  memory: '内存',
  motherboard: '主板',
  storage: '存储',
  psu: '电源',
  cooler: '散热器',
  case: '机箱',
};

const categoryIcons = {
  cpu: 'memory',
  gpu: 'videogame_asset',
  memory: 'storage',
  motherboard: 'developer_board',
  storage: 'hard_drive',
  psu: 'bolt',
  cooler: 'ac_unit',
  case: 'dns',
};

export default function TopBar() {
  const navigate = useNavigate();
  const { selectPart } = useBuild();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 搜索过滤
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const q = query.toLowerCase();
    const matches = [];

    for (const [category, parts] of Object.entries(hardware)) {
      for (const part of parts) {
        const searchText = `${part.name} ${part.spec} ${part.desc}`.toLowerCase();
        if (searchText.includes(q)) {
          matches.push({ ...part, _category: category });
        }
      }
    }

    // 按相关性排序：name 匹配优先
    matches.sort((a, b) => {
      const aName = a.name.toLowerCase().includes(q) ? 1 : 0;
      const bName = b.name.toLowerCase().includes(q) ? 1 : 0;
      return bName - aName;
    });

    setResults(matches.slice(0, 8));
    setShowDropdown(matches.length > 0);
    setSelectedIndex(0);
  }, [query]);

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (part) => {
    selectPart(part._category, part.id);
    setQuery('');
    setShowDropdown(false);
    navigate('/builder');
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-desktop h-16 bg-surface/60 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_0_20px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-3">
        {/* Logo */}
          <h1 className="font-headline-lg text-headline-lg tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(208,188,255,0.6)]">
            装机大神
          </h1>
        <div className="hidden md:flex items-center gap-2 ml-2">
          <span className="text-[10px] text-on-surface-variant/60 font-label-sm px-2 py-0.5 rounded border border-white/[0.06] bg-white/[0.02] tracking-wider">
            v1.0 DEMO
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* 搜索 */}
        <div className="relative hidden sm:block" ref={dropdownRef}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            onKeyDown={handleKeyDown}
            className="bg-surface-container-high/80 border border-white/[0.06] rounded-xl pl-4 pr-10 py-2 text-sm w-48 lg:w-64 text-on-surface placeholder-on-surface-variant/40
              transition-all duration-200
              focus:border-primary/30 focus:bg-surface-container-high focus:shadow-[0_0_12px_rgba(208,188,255,0.08)]
              hover:border-white/[0.12]"
            placeholder="搜索硬件..."
            type="text"
            aria-label="搜索硬件"
            autoComplete="off"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-base pointer-events-none">
            search
          </span>

          {/* 搜索下拉结果 */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-surface-container-high/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
              {results.map((part, i) => (
                <button
                  key={`${part._category}-${part.id}`}
                  onClick={() => handleSelect(part)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 ${
                    i === selectedIndex
                      ? 'bg-primary/10'
                      : 'hover:bg-white/[0.03]'
                  } ${i !== results.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                >
                  {/* 分类图标 */}
                  <div className="w-8 h-8 rounded-lg bg-surface-container/80 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-sm">
                      {categoryIcons[part._category] || 'settings'}
                    </span>
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-on-surface font-medium truncate">
                      {highlightMatch(part.name, query)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-primary/60 font-label-sm px-1.5 py-0.5 rounded bg-primary/10 border border-primary/10">
                        {categoryLabels[part._category] || part._category}
                      </span>
                      <span className="text-xs text-secondary-fixed-dim tabular-nums">¥{part.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 快捷键提示 */}
                  <span className="text-[10px] text-on-surface-variant/20 font-mono">↵</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 通知 */}
        <button
          className="relative w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center
            hover:bg-primary/10 hover:border-primary/20 hover:text-primary
            transition-all duration-200 group"
          aria-label="通知"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-lg group-hover:text-primary transition-colors duration-200">
            notifications
          </span>
          {/* 小红点 */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-tertiary-container shadow-[0_0_4px_rgba(255,80,110,0.6)] animate-pulse-dot" />
        </button>

        {/* 头像 */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary-fixed-dim/20 border border-primary/20 flex items-center justify-center
          hover:border-primary/40 hover:shadow-[0_0_12px_rgba(208,188,255,0.15)] transition-all duration-200 cursor-pointer">
          <span className="material-symbols-outlined text-primary text-lg">account_circle</span>
        </div>
      </div>
    </header>
  );
}

// 高亮匹配文字
function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}
