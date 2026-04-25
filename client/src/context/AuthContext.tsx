import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

// ─── Types ───
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'agent';
  avatar_url?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}

interface RegisterResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (data: {
    email: string;
    full_name: string;
    role: string;
    password: string;
  }) => Promise<RegisterResult>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

// ─── Context ───
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ───
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Rehydrate session on mount ──
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me/');
        const u: AuthUser = {
          id: res.data.id,
          email: res.data.email,
          full_name: res.data.full_name,
          role: res.data.role,
          avatar_url: res.data.avatar_url,
        };
        setUser(u);
        localStorage.setItem('fieldscope_user', JSON.stringify(u));
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('fieldscope_user');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  // ── Login ──
  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      console.log('🔐 Attempting login for:', email);

      // 1. Get JWT tokens
      const tokenRes = await api.post('/auth/login/', { email, password });
      console.log('✅ Token response:', tokenRes.data);

      const { access, refresh } = tokenRes.data;

      if (!access || !refresh) {
        console.error('❌ No tokens in response:', tokenRes.data);
        return { success: false, error: 'Server returned no tokens.' };
      }

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 2. Check if user data came with login response
      if (tokenRes.data.user) {
        console.log('✅ User data from login response:', tokenRes.data.user);
        const u: AuthUser = {
          id: tokenRes.data.user.id,
          email: tokenRes.data.user.email,
          full_name: tokenRes.data.user.full_name,
          role: tokenRes.data.user.role,
          avatar_url: tokenRes.data.user.avatar_url,
        };
        setUser(u);
        localStorage.setItem('fieldscope_user', JSON.stringify(u));
        return { success: true, user: u };
      }

      // 3. If not in login response, fetch from /me/
      console.log('📡 Fetching user profile from /auth/me/...');
      const meRes = await api.get('/auth/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      console.log('✅ /me/ response:', meRes.data);

      const u: AuthUser = {
        id: meRes.data.id,
        email: meRes.data.email,
        full_name: meRes.data.full_name,
        role: meRes.data.role,
        avatar_url: meRes.data.avatar_url,
      };

      setUser(u);
      localStorage.setItem('fieldscope_user', JSON.stringify(u));
      return { success: true, user: u };

    } catch (err: any) {
      // ── Detailed error logging ──
      console.error('❌ LOGIN FAILED');
      console.error('Status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      console.error('Error message:', err.message);

      const status = err.response?.status;
      const data = err.response?.data;

      let error = 'Login failed. Please try again.';

      if (status === 401) {
        error = 'Invalid email or password.';
      } else if (status === 400) {
        // Collect all field errors into one message
        if (data && typeof data === 'object') {
          const messages: string[] = [];
          Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              messages.push(`${key}: ${(value as string[]).join(', ')}`);
            } else if (typeof value === 'string') {
              messages.push(value);
            }
          });
          if (messages.length > 0) {
            error = messages.join('. ');
          }
        }
      } else if (data?.detail) {
        error = data.detail;
      } else if (data?.non_field_errors) {
        error = data.non_field_errors.join(' ');
      }

      return { success: false, error };
    }
  };

  // ── Register ──
  const register = async (data: {
    email: string;
    full_name: string;
    role: string;
    password: string;
  }): Promise<RegisterResult> => {
    try {
      console.log('📝 Attempting registration:', { ...data, password: '***' });
      await api.post('/auth/register/', data);
      console.log('✅ Registration successful');
      return { success: true };
    } catch (err: any) {
      console.error('❌ REGISTRATION FAILED');
      console.error('Status:', err.response?.status);
      console.error('Response data:', err.response?.data);

      const respData = err.response?.data;

      if (respData && typeof respData === 'object') {
        const fieldErrors: Record<string, string[]> = {};
        let generalError = '';

        Object.entries(respData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            fieldErrors[key] = value as string[];
          } else if (key === 'detail') {
            generalError = value as string;
          }
        });

        if (Object.keys(fieldErrors).length > 0) {
          return { success: false, fieldErrors };
        }

        if (generalError) {
          return { success: false, error: generalError };
        }
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  // ── Logout ──
  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('fieldscope_user');
  };

  // ── Update user ──
  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('fieldscope_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ───
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};