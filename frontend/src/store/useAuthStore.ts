import { create } from 'zustand';
import { User, AuthTokens } from '@/types/api';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const storedTokens = localStorage.getItem('auth_tokens');
      const storedUser = localStorage.getItem('auth_user');

      if (storedTokens && storedUser) {
        try {
          set({
            tokens: JSON.parse(storedTokens),
            user: JSON.parse(storedUser),
            isAuthenticated: true,
          });
        } catch (e) {
          localStorage.removeItem('auth_tokens');
          localStorage.removeItem('auth_user');
        }
      }
    }
  },

  login: async (username: string, password: string) => {
    const response = await api.post<AuthTokens>('/api/token/', { username, password });
    const tokens = response.data;

    // For demonstration, extract user info or construct fallback user object
    const user: User = {
      id: 1,
      first_name: username,
      last_name: '',
      profile_picture_url: null,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
      localStorage.setItem('auth_user', JSON.stringify(user));
    }

    set({ tokens, user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('auth_user');
    }
    set({ user: null, tokens: null, isAuthenticated: false });
  },
}));
