import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useKakaoLogin } from "../../hooks/useKakaoLogin";
import { ActivityIndicator } from "react-native";

export default function HomeScreen() {

  const {
    webViewRef,
    setLoading,
    loading,
    showWebView,
    setShowWebView,
    handleNavigationStateChange,
    KAKAO_AUTH_URL,
  } = useKakaoLogin(
    // () => {}, // onSuccess 무시
    // () => {}  // onLogout 무시
  );

  return (
    <View style={styles.container}>
      {!showWebView ? (
        <Button title="카카오 로그인" color="yellow" onPress={() => setShowWebView(true)} />
      ) : (
        <View style={styles.webViewContainer}>
          {loading && <ActivityIndicator size="large" color="#FEE500" style={styles.loadingIndicator} />}
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
});
