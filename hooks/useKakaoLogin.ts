import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebViewNavigation } from 'react-native-webview';
import { useNavigation, NavigationProp } from '@react-navigation/native';



const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const useKakaoLogin = (onSuccess: (userData: any) => void, onLogout: () => void) => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    if (url.includes('code=')) {
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
        id: userData.id,
      });
    } catch (error) {
      console.error('사용자 정보 요청 에러:', error);
    }
  };

  
  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('kakao_token');
  
      if (!accessToken) {
        throw new Error('No access token found');
      }
  
      // 카카오 로그아웃 API 호출
      const response = await fetch('https://kapi.kakao.com/v1/user/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const result = await response.json();
      console.log('카카오 로그아웃 결과:', result);
  
      if (response.status !== 200) {
        throw new Error('카카오 로그아웃 실패');
      }
  
      // 특정 키만 삭제 (완전한 초기화 방지)
      await AsyncStorage.removeItem('kakao_token');
      await AsyncStorage.removeItem('kakao_user');
  
      onLogout();
      setShowWebView(false);
  
    } catch (error) {
      console.log('로그아웃 에러:', error);
      alert(error);
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
  };
};
