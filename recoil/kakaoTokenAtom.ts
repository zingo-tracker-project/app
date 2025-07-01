import { atom } from 'recoil';

type KakaoToken = {
  accessToken: string | null;
  refreshToken: string | null;
};

export const kakaoTokenAtom = atom<KakaoToken>({
  key: 'kakaoTokenAtom',
  default: {
    accessToken: null,
    refreshToken: null,
  },
}); 