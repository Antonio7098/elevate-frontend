import { createContext } from 'react';

export interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  login: (token: string, onSuccess?: () => void) => void;
  logout: (onSuccess?: () => void) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);


