import React from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useKakaoLogin } from "../../../hooks/useKakaoLogin";
import { useUserStore } from '../../store/zustandStore';


export default function Login() {
  const user = useUserStore((state: any) => state.user);

  console.log("afsadfkjahsdjlkfhadsl ", user);

  const {
    webViewRef,
    setLoading,
    loading,
    showWebView,
    setShowWebView,
    kakaoLogin,
    KAKAO_AUTH_URL,
    kakaoLogout,
  } = useKakaoLogin();

  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.welcomeText}>{user.userNm}님</Text>
      ) : !showWebView ? (
        
        <Button title="로그인" color="white" onPress={() => setShowWebView(true)} />
        
      ) : (
        <View style={styles.webViewContainer}>
          {loading && <ActivityIndicator size="large" color="#FEE500" style={styles.loadingIndicator} />}
          <WebView
            ref={webViewRef}
            source={{ uri: KAKAO_AUTH_URL }}
            onLoad={() => setLoading(false)}
            onNavigationStateChange={kakaoLogin}

          />
        </View>
      )}
      <Button title="로그아웃" onPress={kakaoLogout}></Button> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webViewContainer: {
    flex: 1,
    width: "100%",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#white"
  },

  largeButton: {
    backgroundColor: "black",
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginTop: 10,
  },
  
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
