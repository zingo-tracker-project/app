import { useEffect } from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getKeyHashAndroid, initializeKakaoSDK } from "@react-native-kakao/core";
import { login, logout, unlink } from "@react-native-kakao/user";


// npx expo install expo-dev-client
// npx expo prebuild  # 네이티브 코드 생성
// npx expo run:android or npx expo run:ios

// build.gradle 에서 kotlinVersion = '1.9.25', classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.25") 추가

// run:ios 실행시 pod 라이브러리 필요 (npm i pod)



export default function HomeScreen() {
  useEffect(() => {
    const kakaoNativeAppKey = process.env.EXPO_PUBLIC_NATIVE_APP_KEY || '';
    initializeKakaoSDK(kakaoNativeAppKey);
    getKeyHashAndroid().then(console.log);
  }, []); // 의존성 배열 추가

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text>징고 트래커 프로젝트</Text>
      <Button title="카카오 로그인" onPress={()=>{
        login().then(console.log).catch(console.log);
      }}></Button>
      <Button title="카카오 로그아웃" onPress={()=>{
        logout().then(console.log).catch(console.log);
      }}></Button>
      <Button title="카카오 언링크" onPress={()=>{
        unlink().then(console.log).catch(console.log);
      }}></Button>
    </SafeAreaView>
  );
}
