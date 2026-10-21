import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, InquiryItem, InquiryFormData } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  jwt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  inquiries: InquiryItem[];
  refreshInquiries: () => Promise<void>;
  recordInquiry: (data: InquiryFormData) => Promise<InquiryItem>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'bk_auth_token';
const USER_KEY = 'bk_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

  // Verify stored token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const profile = await authService.getProfile(storedToken);
          if (profile) {
            setUser(profile);
            localStorage.setItem(USER_KEY, JSON.stringify(profile));
          }
        } catch {
          // Keep cached user if offline
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Fetch inquiries when user is authenticated
  const refreshInquiries = async () => {
    if (!user?.email) {
      setInquiries([]);
      return;
    }
    try {
      const items = await authService.getUserInquiries(jwt || '', user.email);
      setInquiries(items);
    } catch (err) {
      console.warn('Failed to fetch user inquiries', err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      refreshInquiries();
    } else {
      setInquiries([]);
    }
  }, [user?.email, jwt]);

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (identifier: string, password: string) => {
    const resp = await authService.login(identifier, password);
    setJwt(resp.jwt);
    setUser(resp.user);
    localStorage.setItem(TOKEN_KEY, resp.jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(resp.user));
    closeAuthModal();
  };

  const register = async (username: string, email: string, password: string) => {
    const resp = await authService.register(username, email, password);
    setJwt(resp.jwt);
    setUser(resp.user);
    localStorage.setItem(TOKEN_KEY, resp.jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(resp.user));
    closeAuthModal();
  };

  const logout = () => {
    setJwt(null);
    setUser(null);
    setInquiries([]);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const recordInquiry = async (data: InquiryFormData): Promise<InquiryItem> => {
    const item = await authService.recordInquiry(data, jwt);
    if (user?.email && (data.email === user.email || !data.email)) {
      setInquiries((prev) => [item, ...prev]);
    }
    return item;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwt,
        isAuthenticated: !!user,
        isLoading,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        inquiries,
        refreshInquiries,
        recordInquiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
