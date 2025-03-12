import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Button, Text, Image } from "react-native";
import { WebView } from "react-native-webview";
import { useKakaoLogin } from "../../hooks/useKakaoLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<{
    nickname: string;
    profileImage: string;
    id: string;
  } | null>(null);

  // TODO navitage로 동작하도록 변경 필요
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUserInfo = await AsyncStorage.getItem("kakao_user");
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

  const {
    webViewRef,
    setLoading,
    loading,
    showWebView,
    setShowWebView,
    handleNavigationStateChange,
    KAKAO_AUTH_URL,
    handleLogout,
  } = useKakaoLogin(
    (userData) => {
      setUserInfo(userData);
    },
    () => {
      setUserInfo(null);
      !isFocused;
    }
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      {!showWebView ? (
        <>
          {userInfo ? (
            <View style={{ alignItems: "center" }}>
              <Image
                source={{ uri: userInfo.profileImage }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: 10,
                }}
              />
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>
                {userInfo.nickname}님, 환영합니다! 🎉
              </Text>
              <Button title="로그아웃" color="red" onPress={handleLogout} />
            </View>
          ) : (
            <Button
              title="카카오 로그인"
              color="yellow"
              onPress={() => setShowWebView(true)}
            />
          )}
        </>
      ) : (
        <View style={{ flex: 1, width: "100%" }}>
          {loading && (
            <ActivityIndicator
              size="large"
              color="#FEE500"
              style={{ marginTop: 20 }}
            />
          )}
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
