import { createContext } from 'react';

// Types
export type Theme = 'parchment' | 'slate';
export interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Context
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

