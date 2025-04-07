import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebViewNavigation } from 'react-native-webview';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import createUser from './users/usersApi';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const useKakaoLogin = (onSuccess: (userData: any) => void, onLogout: () => void) => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    if (url.includes('code=')) {
      try {
        const code = new URL(url).searchParams.get('code');
        if (!code) return;

        setShowWebView(false); // 웹뷰 닫기

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

          const userData = await getUserInfo(tokenData.access_token);
          if (userData) {
            onSuccess(userData); // 사용자 정보 저장 및 리다이렉트
          }

          await AsyncStorage.removeItem('last_kakao_code');
        }
      } catch (error) {
        console.error('handleNavigationStateChange(login): ', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const getUserInfo = async (accessToken: string) => {
    try {
      const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = await userInfoResponse.json();
      await AsyncStorage.setItem('kakao_user', JSON.stringify(userData));
      
      return {
        nickname: userData.kakao_account.profile.nickname,
        profileImage: userData.kakao_account.profile.profile_image_url,
        id: userData.id,
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("checkAccessTokenValidity response : ", response)
      if (response.status === 200) {
        console.log('token is valid.');
        return true;
      } else {
        console.log('token is not valid.');
        return false;
      }
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
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&refresh_token=${refreshToken}`,
      });

      const tokenData = await response.json();

      if (tokenData.access_token) {
        await AsyncStorage.setItem('kakao_token', tokenData.access_token);

        if (tokenData.refresh_token) {
          await AsyncStorage.setItem('kakao_refresh_token', tokenData.refresh_token);
        }

        console.log('token refreshed');
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.status !== 200) throw new Error('카카오 로그아웃 실패');

      await AsyncStorage.removeItem('kakao_token');
      await AsyncStorage.removeItem('kakao_refresh_token');
      await AsyncStorage.removeItem('kakao_user');

      onLogout();
      setShowWebView(false);
    } catch (error) {
      console.log('kakao logout err :', error);
      alert(error.message);
    }
  };

  // TODO 카카오 완전 로그아웃 웹뷰 구현
  const handleKakaoLogout = async () => {
    try {
  
      const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&logout_redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}`;
      console.info(logoutUrl);
      
      const response = await fetch(logoutUrl, {
        method: 'GET',
      });
  
      if (response.ok) {
        console.log('카카오 로그아웃 요청 성공!');
      } else {
        console.error('카카오 로그아웃 요청 실패: ', response);
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
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
    handleKakaoLogout,
    handleTokenRefresh,
    checkAccessTokenValidity,
  };
};
