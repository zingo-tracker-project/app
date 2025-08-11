import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from '../../store/zustandStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  console.log("welcome - 사용자 정보:", user);
  console.log("welcome - 사용자 이름:", user?.userNm);

  if (!user || !user.userNm) {
    return (
      <View style={styles.container}>
        <Text>유저 정보 없음</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>어서오세요</Text>
      <Text style={styles.nickname}>
        <Text style={{ fontWeight: "bold" }}>{user.userNm}</Text> 님!
      </Text>
      <Text style={styles.subtitle}>천리길도 한걸음부터라고 했어용~</Text>
      <Text style={styles.subtitle}>이제부터 잘 살아보자 이거예용~</Text>

      <Pressable style={styles.button} onPress={() => router.replace("/todo")}>
        <Text style={styles.buttonText}>딱 오늘 하루만 살러 가기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#d4eac8",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#111",
      marginBottom: 8,
    },
    nickname: {
      fontSize: 18,
      color: "#fff",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: "#fff",
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: "contain",
      marginVertical: 30,
    },
    button: {
      backgroundColor: "#5bc065",
      width: "100%",
      paddingVertical: 14,
      borderRadius: 4,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  
