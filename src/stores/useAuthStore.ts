import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: null | { id?: string; email?: string };
  email: string;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: AuthState['user']) => void;
  setEmail: (email: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      email: '',
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setToken: token => {
        set({ token });
        document.cookie = `accessToken=${token}; path=/; max-age=3600`; // Set cookie for 1 hour
      },
      setRefreshToken: refreshToken => {
        set({ refreshToken });
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800`; // Set cookie for 7 days
      },
      setTokens: (token, refreshToken) => {
        set({ token, refreshToken });
        document.cookie = `accessToken=${token}; path=/; max-age=3600`; // Set cookie for 1 hour
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800`; // Set cookie for 7 days
      },
      setUser: user => set({ user, isAuthenticated: !!user }),
      setEmail: email => set({ email }),
      signOut: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        // Xoá luôn storage nếu muốn reset toàn bộ
        useAuthStore.persist?.clearStorage?.();
        document.cookie =
          'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie =
          'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      },
    }),
    {
      name: 'auth-storage', // Tên key lưu trong AsyncStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
