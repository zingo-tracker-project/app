// @ts-nocheck
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// bigTodos, test 상태
interface BigTodosState {
  bigTodos: any[];
  setBigTodos: (todos: any[]) => void;
  test: string;
  setTest: (val: string) => void;
}

export const useBigTodosStore = create<BigTodosState>()(
  persist(
    (set) => ({
      bigTodos: [],
      setBigTodos: (todos) => set({ bigTodos: todos }),
      test: '',
      setTest: (val) => set({ test: val }),
    }),
    {
      name: 'big-todos-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// user 상태
export type Gender = 'M' | 'F' | null;
export type UserInfo = {
  userId?: string;
  gender?: Gender;
  userNm?: string;
  isActive?: boolean;
  ageGrp?: string | null;
  createdAt?: string;
  deletedAt?: string | null;
  profileImage?: string;
  accessToken?: string;
  refreshToken?: string;
};

interface UserState {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  resetUser: () => void;
  isRefreshingToken: boolean;
  setIsRefreshingToken: (isRefreshing: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      resetUser: () => set({ user: null }),
      isRefreshingToken: false,
      setIsRefreshingToken: (isRefreshing) => set({ isRefreshingToken: isRefreshing }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// sso 상태
interface SsoState {
  showWebView: boolean;
  setShowWebView: (show: boolean) => void;
}

export const useSsoStore = create<SsoState>((set) => ({
  showWebView: false,
  setShowWebView: (show) => set({ showWebView: show }),
}));

// kakaoToken 상태
interface KakaoToken {
  accessToken: string | null;
  refreshToken: string | null;
}

interface KakaoTokenState {
  kakaoToken: KakaoToken;
  setKakaoToken: (token: KakaoToken) => void;
}

export const useKakaoTokenStore = create<KakaoTokenState>()(
  persist(
    (set) => ({
      kakaoToken: { accessToken: null, refreshToken: null },
      setKakaoToken: (token) => set({ kakaoToken: token }),
    }),
    {
      name: 'kakao-token-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 