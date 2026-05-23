import React, { createContext, useContext, useState, useCallback } from 'react';

const RGBContext = createContext();

const COLOR_PRESETS = [
  { name: '电光紫', value: '#d0bcff' },
  { name: '冰川蓝', value: '#00dbe7' },
  { name: '赛博粉', value: '#ffb2b8' },
  { name: '烈焰红', value: '#ff506e' },
  { name: '极光绿', value: '#00ff88' },
  { name: '夕阳黄', value: '#ffd700' },
];

const RGB_MODES = [
  { id: 'static', label: '静态', icon: 'palette' },
  { id: 'pulse', label: '呼吸', icon: 'waves' },
  { id: 'strobe', label: '闪烁', icon: 'flash_on' },
  { id: 'cycle', label: '循环', icon: 'sync' },
];

export function RGBProvider({ children }) {
  const [color, setColor] = useState('#d0bcff');
  const [mode, setMode] = useState('static');
  const [brightness, setBrightness] = useState(85);

  const selectPreset = useCallback((presetValue) => {
    setColor(presetValue);
  }, []);

  const selectMode = useCallback((modeId) => {
    setMode(modeId);
  }, []);

  return (
    <RGBContext.Provider
      value={{
        color,
        mode,
        brightness,
        setColor,
        setMode: selectMode,
        setBrightness,
        selectPreset,
        COLOR_PRESETS,
        RGB_MODES,
      }}
    >
      {children}
    </RGBContext.Provider>
  );
}

export function useRGB() {
  const ctx = useContext(RGBContext);
  if (!ctx) throw new Error('useRGB must be used within RGBProvider');
  return ctx;
}

export { RGBContext, COLOR_PRESETS, RGB_MODES };
