import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeContextProps } from './ThemeContext';

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
