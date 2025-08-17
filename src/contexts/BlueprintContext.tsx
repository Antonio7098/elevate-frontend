import React, { createContext, useContext, ReactNode } from 'react';
import { useBlueprintStore, useBlueprintSelectors, useBlueprintActions } from '../store/blueprintStore';

// Context interface
interface BlueprintContextValue {
  // Store instance
  store: ReturnType<typeof useBlueprintStore>;
  
  // Selectors
  selectors: ReturnType<typeof useBlueprintSelectors>;
  
  // Actions
  actions: ReturnType<typeof useBlueprintActions>;
}

// Create the context
const BlueprintContext = createContext<BlueprintContextValue | undefined>(undefined);

// Provider component
interface BlueprintProviderProps {
  children: ReactNode;
}

export const BlueprintProvider: React.FC<BlueprintProviderProps> = ({ children }) => {
  const store = useBlueprintStore();
  const selectors = useBlueprintSelectors();
  const actions = useBlueprintActions();

  const value: BlueprintContextValue = {
    store,
    selectors,
    actions,
  };

  return (
    <BlueprintContext.Provider value={value}>
      {children}
    </BlueprintContext.Provider>
  );
};

// Hook to use the blueprint context
export const useBlueprintContext = (): BlueprintContextValue => {
  const context = useContext(BlueprintContext);
  
  if (context === undefined) {
    throw new Error('useBlueprintContext must be used within a BlueprintProvider');
  }
  
  return context;
};

// Convenience hooks for specific parts of the context
export const useBlueprintStoreContext = () => {
  const { store } = useBlueprintContext();
  return store;
};

export const useBlueprintSelectorsContext = () => {
  const { selectors } = useBlueprintContext();
  return selectors;
};

export const useBlueprintActionsContext = () => {
  const { actions } = useBlueprintContext();
  return actions;
};





