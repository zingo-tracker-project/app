import {atom, selector} from 'recoil'

type ssoInfo = {
    userNm: string;
    profileImage: string;
  };
  
export const ssoAtom = atom({
    key: 'ssoAtom',
    default: {
        showWebView: false,
    },
});
  