import { atom, selector } from 'recoil';

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

export const userAtom = atom<UserInfo | null>({
  key: 'userAtom',
  default: null,
});

export const isUserAtomSelector = selector({
  key: 'isUserAtomSelector',
  get: ({ get }) => {
    const user = get(userAtom);
    return !!user; // user가 null이 아니면 true
  },
});
