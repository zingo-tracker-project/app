import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView, WebViewNavigation } from 'react-native-webview';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const useKakaoLogin = (onSuccess: (userData: any) => void) => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    if (url.includes('code=')) {
      // 인가코드
      const code = new URL(url).searchParams.get('code');

      // 액세스 토큰 요청
      const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}&code=${code}`,
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.access_token) {
        await AsyncStorage.setItem('kakao_token', tokenData.access_token);
        await getUserInfo(tokenData.access_token);
      }
    }
  };

  // 사용자 정보 가져오기
  const getUserInfo = async (accessToken: string) => {
    try {
      const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const userData = await userInfoResponse.json();
      console.log('사용자 정보:', userData);

      await AsyncStorage.setItem('kakao_user', JSON.stringify(userData));

      onSuccess({
        nickname: userData.kakao_account.profile.nickname,
        profileImage: userData.kakao_account.profile.profile_image_url,
        id: userData.kakao_account.profile.id,
      });
    } catch (error) {
      console.error('사용자 정보 요청 에러:', error);
    }
  };

  // 로그아웃
  const logout = async () => {
    await AsyncStorage.clear();
    alert('로그아웃 되었습니다.');
    onSuccess(null);
  };

  return {
    webViewRef,
    loading,
    setLoading,
    showWebView,
    setShowWebView,
    handleNavigationStateChange,
    KAKAO_AUTH_URL,
    logout,
  };
};
