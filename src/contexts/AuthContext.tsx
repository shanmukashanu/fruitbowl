import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminAuth');
    if (stored) {
      const { email, token: savedToken } = JSON.parse(stored);
      setIsAdmin(true);
      setAdminEmail(email);
      setToken(savedToken || null);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const json = await res.json();
      if (!json?.token) return false;
      setIsAdmin(true);
      setAdminEmail(email);
      setToken(json.token);
      localStorage.setItem('adminAuth', JSON.stringify({ email, token: json.token }));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminEmail(null);
    setToken(null);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, adminEmail, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
