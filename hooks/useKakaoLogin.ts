import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebViewNavigation } from 'react-native-webview';
import { router } from 'expo-router';
import { useSetRecoilState, useResetRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const useKakaoLogin = () => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const resetUser = useResetRecoilState(userAtom);

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    if (url.includes('code=')) {
      try {
        const code = new URL(url).searchParams.get('code');
        if (!code) return;

        setShowWebView(false);

        const storedCode = await AsyncStorage.getItem('last_kakao_code');
        if (storedCode === code) return;

        await AsyncStorage.setItem('last_kakao_code', code);

        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=authorization_code&client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}&code=${code}`,
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          await AsyncStorage.setItem('kakao_token', tokenData.access_token);
          await AsyncStorage.setItem('kakao_refresh_token', tokenData.refresh_token);

          const userData = await setUserInfo(tokenData.access_token);
          if (userData) {
            router.replace('../components/newUserNickName');
          }

          await AsyncStorage.removeItem('last_kakao_code');
        }
      } catch (error) {
        console.error('handleNavigationStateChange(login): ', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const setUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = await response.json();
      // await AsyncStorage.setItem('kakao_user', JSON.stringify(userData));

      setUser({
        nickname: userData.kakao_account.profile.nickname,
        profileImage: userData.kakao_account.profile.profile_image_url,
        id: userData.id,
        isNew: true
      });

      return {
        nickname: userData.kakao_account.profile.nickname,
        profileImage: userData.kakao_account.profile.profile_image_url,
        id: userData.id,
        isNew: true
      };

    } catch (error) {
      console.error('getUserInfo :', error);
      return null;
    }
  };

  const checkAccessTokenValidity = async (accessToken: string) => {
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

  const handleTokenRefresh = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('kakao_refresh_token');
      if (!refreshToken) throw new Error('No refresh token found');

      const response = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=refresh_token&client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&refresh_token=${refreshToken}`,
      });

      const tokenData = await response.json();

      if (tokenData.access_token) {
        await AsyncStorage.setItem('kakao_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          await AsyncStorage.setItem('kakao_refresh_token', tokenData.refresh_token);
        }
        return tokenData.access_token;
      } else {
        throw new Error('token refresh fail');
      }
    } catch (error) {
      console.error('token refresh:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('kakao_token');
      if (!accessToken) throw new Error('No access token found');

      const response = await fetch('https://kapi.kakao.com/v1/user/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status !== 200) throw new Error('카카오 로그아웃 실패');

      await AsyncStorage.removeItem('kakao_token');
      await AsyncStorage.removeItem('kakao_refresh_token');
      // await AsyncStorage.removeItem('kakao_user');

      resetUser();
      setShowWebView(false);

    } catch (error) {
      console.error('kakao logout err :', error);
      alert(error.message);
    }
  };

  return {
    webViewRef,
    loading,
    setLoading,
    showWebView,
    setShowWebView,
    handleNavigationStateChange,
    KAKAO_AUTH_URL,
    handleLogout,
    handleTokenRefresh,
    checkAccessTokenValidity,
  };
};
