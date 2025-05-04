import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  type BottomTab = {
    name: string; // 파일명
    title: string; // 탭 이름
    icon: string; // 탭 아이콘
    badge?: string | number; // 탭에 노출될 뱃지
  };

  const tabList: BottomTab[] = [
    {
      name: "index",
      title: "home",
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
  // console.log(tabList)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     // position: 'absolute',
        //   },
        //   default: {
        //   },
        // }),
        tabBarStyle: { display: "block" },
      }}
    >
      {tabList.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              // <IconSymbol size={28} name={tab.icon} color={color} />
              <Ionicons name={tab.icon} size={28} color={color} />
            ),
            ...(tab.badge !== undefined && { tabBarBadge: tab.badge }),
          }}
        />
      ))}
    </Tabs>
  );
}
