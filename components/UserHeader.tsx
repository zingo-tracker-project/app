// @ts-nocheck
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useUserStore, useSsoStore } from 'store/zustandStore';
import { useKakaoLogin } from '../hooks/useKakaoLogin';
import { WebView } from "react-native-webview";
import { ActivityIndicator } from "react-native";

export default function UserHeader() {
  const user = useUserStore((state) => state.user);
  const isRefreshingToken = useUserStore((state) => state.isRefreshingToken);
  const { showWebView, setShowWebView, loading, setLoading, kakaoLogin, KAKAO_AUTH_URL, kakaoLogout } = useKakaoLogin();

  console.log("UserHeader - 현재 사용자:", user);
  console.log("UserHeader - 사용자 이름:", user?.userNm);
  console.log("UserHeader - 토큰 갱신 중:", isRefreshingToken);

  if (user && user.userNm) {
    return (
      <View style={styles.container}>
        <Text style={styles.userName}>{user.userNm}님</Text>
        {isRefreshingToken && (
          <View style={styles.refreshingContainer}>
            <ActivityIndicator size="small" color="#FEE500" />
            <Text style={styles.refreshingText}>토큰 갱신 중...</Text>
          </View>
        )}
        <Pressable onPress={kakaoLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </View>
    );
  }

  if (showWebView) {
    return (
      <View style={styles.webViewContainer}>
        {loading && <ActivityIndicator size="small" color="#FEE500" style={styles.loadingIndicator} />}
        <WebView
          source={{ uri: KAKAO_AUTH_URL }}
          onLoad={() => setLoading(false)}
          onNavigationStateChange={kakaoLogin}
          style={styles.webView}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setShowWebView(true)} style={styles.loginButton}>
        <Text style={styles.loginText}>로그인</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FEE500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  refreshingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  refreshingText: {
    fontSize: 12,
    color: '#666',
  },
  webViewContainer: {
    width: 200,
    height: 300,
    marginRight: 10,
  },
  webView: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
