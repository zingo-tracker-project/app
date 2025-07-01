import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/userAtom";

export default function UserHeader() {
  const user = useRecoilValue(userAtom);

  if (!user) return null;

  return (
    <View style={styles.container}>
      {user.profileImage && (
        <Image source={{ uri: user.profileImage }} style={styles.image} />
      )}
      <Text style={styles.nickname}>{user.userNm}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  image: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  nickname: { fontWeight: "bold", fontSize: 16, color: "#fff" },
}); 