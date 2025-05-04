import {atom, selector} from 'recoil'

type UserInfo = {
    nickname: string;
    profileImage: string;
    id: string;
  };
  
export const userAtom = atom<UserInfo | null>({
    key: 'userAtom',
    default: null,
});

export const isUserAtomSelector = selector({
    key : 'isUserAtomSelector',
    get : ({get}) => {
        const user = get(userAtom)

        return user ? true : false
    }
})