import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { calcTotalPower, checkCompatibility, canPowerOn, getPart } from '../utils/compatibility';

const BuildContext = createContext();

const initialState = {
  cpu: null,
  gpu: null,
  memory: null,
  motherboard: null,
  storage: null,
  psu: null,
  cooler: null,
  case: null,
  poweredOn: false,
  savedName: '',
};

function buildReducer(state, action) {
  switch (action.type) {
    case 'SELECT_PART':
      return { ...state, [action.category]: action.partId, poweredOn: false };
    case 'CLEAR_PART':
      return { ...state, [action.category]: null, poweredOn: false };
    case 'LOAD_BUILD':
      return { ...action.build, poweredOn: false };
    case 'CLEAR_ALL':
      return { ...initialState };
    case 'POWER_ON':
      return { ...state, poweredOn: true };
    case 'POWER_OFF':
      return { ...state, poweredOn: false };
    case 'SET_NAME':
      return { ...state, savedName: action.name };
    default:
      return state;
  }
}

export function BuildProvider({ children }) {
  const [build, dispatch] = useReducer(buildReducer, initialState);

  const selectPart = useCallback((category, partId) => {
    dispatch({ type: 'SELECT_PART', category, partId });
  }, []);

  const clearPart = useCallback((category) => {
    dispatch({ type: 'CLEAR_PART', category });
  }, []);

  const loadBuild = useCallback((buildData) => {
    dispatch({ type: 'LOAD_BUILD', build: buildData });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const powerOn = useCallback(() => {
    dispatch({ type: 'POWER_ON' });
  }, []);

  const powerOff = useCallback(() => {
    dispatch({ type: 'POWER_OFF' });
  }, []);

  const totalPower = calcTotalPower(build);
  const warnings = checkCompatibility(build);
  const canPower = canPowerOn(build);

  const getBuildSummary = useCallback(() => {
    const summary = {};
    for (const [category, id] of Object.entries(build)) {
      if (category === 'poweredOn' || category === 'savedName') continue;
      if (id) {
        const part = getPart(category, id);
        if (part) {
          summary[category] = part;
        }
      }
    }
    return summary;
  }, [build]);

  return (
    <BuildContext.Provider
      value={{
        build,
        selectPart,
        clearPart,
        loadBuild,
        clearAll,
        powerOn,
        powerOff,
        totalPower,
        warnings,
        canPower,
        getBuildSummary,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error('useBuild must be used within BuildProvider');
  return ctx;
}
