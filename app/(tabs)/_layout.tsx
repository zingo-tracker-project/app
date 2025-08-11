import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, Modal, SafeAreaView } from "react-native";
import WebView from "react-native-webview";
import queryString from 'query-string';
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useKakaoLogin } from "@/hooks/useKakaoLogin";
import UserHeader from "@/components/UserHeader";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {
    showWebView,
    setShowWebView,
    webViewRef,
    kakaoLogin,
    KAKAO_AUTH_URL,
  } = useKakaoLogin();

  type BottomTab = {
    name: string; // 파일명
    title: string; // 탭 이름
    icon: React.ComponentProps<typeof Ionicons>["name"]; // 탭 아이콘
    badge?: string | number; // 탭에 노출될 뱃지
  };

  const tabList: BottomTab[] = [
    {
      name: "index",
      title: "Home",
      icon: "home",
    },
    {
      name: "todo",
      title: "오늘",
      icon: "list-outline",
    },
    // {
    //     name: "today",
    //     title: "Today",
    //     icon: "list-outline",
    // },
    {
      name: "calendar",
      title: "calendar",
      icon: "list-outline",
    },
        {
            name: "recoilTest",
            title: "recoil",
            icon: "list-outline",
        },
    {
      name: "settings",
      title: "설정",
      icon: "list-outline",
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          headerRight: () => (
            <UserHeader />
          ),
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {},
        }}
      >
        {tabList.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color }) => (
                <Ionicons name={tab.icon} size={28} color={color} />
              ),
              ...(tab.badge !== undefined && { tabBarBadge: tab.badge }),
            }}
          />
        ))}
      </Tabs>
      <Modal visible={showWebView} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            source={{ uri: KAKAO_AUTH_URL }}
            onNavigationStateChange={kakaoLogin}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}
