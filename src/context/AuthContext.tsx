import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../services/types';
interface AuthContextType {
  user: UserProfile | null;
  login: (tokens: { access: string; refresh: string }, userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if user is already logged in when app starts
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (tokens: { access: string; refresh: string }, userData: any) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use Auth easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};