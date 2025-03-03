import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Button, Text, Image, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useKakaoLogin } from '../../hooks/useKakaoLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

export default function HomeScreen({ navigation }: { navigation: any }) {

  const [userInfo, setUserInfo] = useState<{ nickname: string; profileImage: string; id:string } | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUserInfo = await AsyncStorage.getItem('kakao_user');
      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo({
          nickname: parsedUserInfo.kakao_account.profile.nickname,
          profileImage: parsedUserInfo.kakao_account.profile.profile_image_url,
          id: parsedUserInfo.id,
        });
      }
    };

    fetchUserInfo();
  }, []);

  const { webViewRef, setLoading,loading, showWebView, setShowWebView, handleNavigationStateChange, KAKAO_AUTH_URL, logout } =
    useKakaoLogin((userData) => {
      setUserInfo(userData);
    });

  return (
    <View style={styles.container}>
      {!showWebView ? (
        <>
          {userInfo ? (
            <View style={styles.userContainer}>
              <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
              <Text style={styles.welcomeText}>{userInfo.nickname}님 안녕하세요</Text>
              <Button title="로그아웃" onPress={logout} color="red" />
            </View>
          ) : (
            <Button title="카카오 로그인" onPress={() => setShowWebView(true)}  />
          )}
        </>
      ) : (
        <View style={styles.webViewContainer}>
          {loading && <ActivityIndicator size="large" color="#FEE500" />}
          <WebView
            ref={webViewRef}
            source={{ uri: KAKAO_AUTH_URL }}
            onLoad={() => setLoading(false)}
            onNavigationStateChange={handleNavigationStateChange}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', // ✅ 글자 검은색
    textAlign: 'center',
    marginBottom: 10,
  },
  webViewContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
