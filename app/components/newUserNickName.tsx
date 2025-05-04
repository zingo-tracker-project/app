import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userAtom } from "@/recoil/userAtom";
import { useKakaoLogin } from "../../hooks/useKakaoLogin"; // 경로 맞게 조정
import Ionicons from '@expo/vector-icons/Ionicons';

export default function newUserNickName() {
  const router = useRouter();
  const user = useRecoilValue(userAtom);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [isNewUser, setIsNewUser] = useState(user?.isNew);

  if (user && !isNewUser) {
    router.replace('./welcome');
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>어서오세요</Text>
        <Text style={styles.subtitle}>닉네임을 입력해주세요</Text>
    
        <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder={user.nickname}
            placeholderTextColor="#999"
            value={nickname}
            onChangeText={setNickname}
        />
        <Ionicons name="checkmark" size={24} style={styles.checkIcon} />
        </View>
    
        <Pressable style={styles.button} onPress={()=>{router.replace('./welcome');}}>
        <Text style={styles.buttonText}>다음</Text>
        </Pressable>
    
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 100,
      paddingHorizontal: 20,
      backgroundColor: "#d4eac8",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#111",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: "#444",
      marginBottom: 24,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#ccc",
      borderWidth: 1,
      backgroundColor: "#f6f6f6",
      borderRadius: 4,
      paddingHorizontal: 12,
      width: "100%",
      height: 50,
      marginBottom: 20,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: "#333",
    },
    checkIcon: {
      marginLeft: 8,
      color: "#5bc065",
    },
    button: {
      backgroundColor: "#5bc065",
      width: "100%",
      paddingVertical: 14,
      borderRadius: 4,
      alignItems: "center",
      marginBottom: 40,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    bottomImage: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 80,
      height: 80,
      resizeMode: "contain",
    },
  });
  