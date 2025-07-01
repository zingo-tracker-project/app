import { useState, useRef } from 'react';
import { WebViewNavigation } from 'react-native-webview';
import { router } from 'expo-router';
import { useSetRecoilState, useResetRecoilState, useRecoilState, useRecoilValue, constSelector } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import makeApiRequest from './api';
import { ssoAtom } from '../recoil/ssoAtom';
import { kakaoTokenAtom } from '../recoil/kakaoTokenAtom';
import * as queryString from 'query-string';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;


export const useKakaoLogin = () => {
  
  const webViewRef = useRef(null);
  const lastCode = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ssoState, setSsoState] = useRecoilState(ssoAtom);
  const setUser = useSetRecoilState(userAtom);
  const resetUser = useResetRecoilState(userAtom);
  const [kakaoToken, setKakaoToken] = useRecoilState(kakaoTokenAtom);

  // handleNavigationStateChange
  const kakaoLogin = async (navState: WebViewNavigation) => {
    const { url } = navState;

    if (url.includes('code=')) {
      try {
        const code = new URL(url).searchParams.get('code');
        if (!code) return;

        setSsoState({ showWebView: false });

        if (lastCode.current === code) return;
        lastCode.current = code;

        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=authorization_code&client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}&code=${code}`,
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          setKakaoToken({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
          });

          const userData = await setKakaoUserInfo(tokenData.access_token);
          if (userData) {
            router.replace('../components/newUserNickName');
          }

          lastCode.current = null;
        }
      } catch (error) {
        console.error('kakaoLogin: ', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  /**
   * 카카오 토큰으로 카카오 유저 정보 조회
   * @param accessToken
   * @returns recoil userAtom 업데이트
   */
  const setKakaoUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = await response.json();

      // 로그인 후 유저 정보 업데이트
      const loginResponse = await makeApiRequest('/user/login', 'POST', '', {
        userId: userData.id,
        userNm: userData.kakao_account.profile.nickname,
        profileImage: userData.kakao_account.profile.profile_image_url,
      });

      setUser({
        userNm: loginResponse.data.userNm,
        profileImage: loginResponse.data.profileImage,
        userId: loginResponse.data.userId,
        gender: loginResponse.data.gender,
        isActive: loginResponse.data.isActive,
        ageGrp: loginResponse.data.ageGrp,
        createdAt: loginResponse.data.createdAt,
        deletedAt: loginResponse.data.deletedAt,
        accessToken: loginResponse.data.jwt.accessToken,
        refreshToken: loginResponse.data.jwtrefreshToken,
      });

      router.replace('../(tabs)/login/newUserNickName');

    } catch (error) {
      console.error('setKakaoUserInfo :', error);
      return null;
    }
  };

  /**
   * 카카오 토큰 유효성 검사
   * @param accessToken
   * @returns 
   */
  const checkKakaoTokenValidity = async (accessToken: string) => {
    try {
      const response = await fetch('https://kapi.kakao.com/v1/user/access_token_info', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.status === 200;
    } catch (error) {
      console.error('token check err :', error);
      return false;
    }
  };

  /**
   * 카카오 토큰 갱신
   * @returns 
   */
  const kakaoTokenRefresh = async () => {
    try {
      if (!kakaoToken.refreshToken) throw new Error('No refresh token found');

      const response = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=refresh_token&client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&refresh_token=${kakaoToken.refreshToken}`,
      });

      const tokenData = await response.json();

      if (tokenData.access_token) {
        setKakaoToken({
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || kakaoToken.refreshToken, // New refresh token might not be provided
        });
        return tokenData.access_token;
      } else {
        throw new Error('token refresh fail');
      }
    } catch (error) {
      console.error('token refresh:', error);
      throw error;
    }
  };

  /**
   * 카카오 로그아웃
   * @returns 
   */
  const kakaoLogout = async () => {
    try {
      if (!kakaoToken.accessToken) throw new Error('No access token found');

      const response = await fetch('https://kapi.kakao.com/v1/user/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${kakaoToken.accessToken}` },
      });

      if (response.status !== 200) throw new Error('카카오 로그아웃 실패');

      setKakaoToken({ accessToken: null, refreshToken: null });
      resetUser();
      setSsoState({ showWebView: false });

    } catch (error: any) {
      console.error('kakao logout err :', error);
      alert(error.message);
    }
  };

  return {
    webViewRef,
    loading,
    setLoading,
    showWebView: ssoState.showWebView,
    setShowWebView: (show: boolean) => setSsoState({ showWebView: show }),
    kakaoLogin,
    KAKAO_AUTH_URL,
    kakaoLogout,
    kakaoTokenRefresh,
    checkKakaoTokenValidity,
  };
};
