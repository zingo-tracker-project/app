// @ts-nocheck
import axios from 'axios';
import { useUserStore, useKakaoTokenStore } from 'store/zustandStore';

/**
 * api 호출 
 * @param {string} url 
 * @param {string} method
 * @param {string} accessToken
 * @param {Object} data
 * @param {Object} params
 * @param {Object} headers
 */
const makeApiRequest = async (url: string, method = 'get', accessToken: string, data = {}, params = {}, headers = {}) => {
    console.log("API 호출 - accessToken:", accessToken);
    const DOMAIN = process.env.EXPO_PUBLIC_API_URL || '';
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    // accessToken이 있으면 Authorization 헤더 추가
    if (accessToken) {
        defaultHeaders['Authorization'] = "Bearer " + accessToken;
    }
    
    const finalHeaders = { ...defaultHeaders, ...headers };
    
    try {
      const response = await axios({
        url: url.includes('http') ? url : DOMAIN + url,
        method,
        headers: finalHeaders,
        params,
        data,
      });
      return response.data;
    } catch (error) {
      console.log('makeApiRequest while ', method, 'to', url);
      console.log('error : ', error);
      
      // 토큰 만료 에러인지 확인
      if (error.response?.status === 401 && error.response?.data?.code === 'EXPIRED_TOKEN') {
        console.log('토큰이 만료되었습니다. Refresh token으로 새로운 토큰을 요청합니다.');
        try {
          // Refresh token으로 새로운 access token 요청
          const refreshResult = await refreshAccessToken();
          
          if (refreshResult) {
            // 새로운 토큰으로 원래 요청 재시도
            console.log('새로운 토큰으로 API 요청을 재시도합니다.');
            const newHeaders = { ...defaultHeaders };
            newHeaders['Authorization'] = "Bearer " + refreshResult.accessToken;
            
            const retryResponse = await axios({
              url: url.includes('http') ? url : DOMAIN + url,
              method,
              headers: { ...newHeaders, ...headers },
              params,
              data,
            });
            
            return retryResponse.data;
          }
        } catch (refreshError) {
          console.error('Refresh token으로 토큰 갱신 실패:', refreshError);
          // Refresh token도 만료된 경우 로그아웃 처리
          await handleLogout();
        }
      }
      
      throw error;
    }
  };

/**
 * Refresh token을 사용하여 새로운 access token 요청
 */
const refreshAccessToken = async () => {
  try {
    const user = useUserStore.getState().user;
    const setIsRefreshingToken = useUserStore.getState().setIsRefreshingToken;
    
    if (!user?.refreshToken) {
      console.error('Refresh token이 없습니다.');
      return null;
    }
    
    // 토큰 갱신 시작
    setIsRefreshingToken(true);
    
    const DOMAIN = process.env.EXPO_PUBLIC_API_URL || '';
    const refreshToken = user.refreshToken;
    
    const response = await axios({
      url: DOMAIN + '/user/refresh',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        refreshToken: refreshToken,
      },
    });
    
    if (response.data?.data?.accessToken) {
      const newAccessToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken || refreshToken;
      
      // 새로운 JWT 토큰으로 사용자 정보 업데이트 (카카오 토큰은 그대로 유지)
      const setUser = useUserStore.getState().setUser;
      
      setUser({
        ...user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      
      console.log('새로운 JWT access token으로 업데이트 완료');
      
      // 토큰 갱신 완료
      setIsRefreshingToken(false);
      
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    
    // 토큰 갱신 실패
    setIsRefreshingToken(false);
    return null;
  } catch (error) {
    console.error('Refresh token 요청 실패:', error);
    
    // 토큰 갱신 실패
    const setIsRefreshingToken = useUserStore.getState().setIsRefreshingToken;
    setIsRefreshingToken(false);
    
    return null;
  }
};

/**
 * 로그아웃 처리
 */
const handleLogout = async () => {
  try {
    const resetUser = useUserStore.getState().resetUser;
    const setKakaoToken = useKakaoTokenStore.getState().setKakaoToken;
    
    // JWT 토큰과 카카오 토큰 모두 초기화
    resetUser();
    setKakaoToken({ accessToken: null, refreshToken: null });
    
    console.log('토큰 만료로 인한 자동 로그아웃 처리 완료');
  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error);
  }
};

export default makeApiRequest;
