import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "@/recoil/userAtom";
import Ionicons from '@expo/vector-icons/Ionicons';
import makeApiRequest from "@/hooks/api";
import { Picker } from '@react-native-picker/picker';

export default function NewUserFlow() {
  const router = useRouter();
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);

  // 단계 관리
  const [step, setStep] = useState<"nickname" | "gender" | "ageGrp">("nickname");
  // 입력값 상태
  const [nickname, setNickname] = useState(user?.userNm ?? "");
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [ageGrp, setAgeGrp] = useState("");

  // 나이대 옵션 생성 (라벨과 값 분리)
  const ageOptions: { label: string; value: string }[] = [];
  const ages = [
    { decade: "10", code: "A" },
    { decade: "20", code: "B" },
    { decade: "30", code: "C" },
    { decade: "40", code: "D" },
    { decade: "50", code: "E" },
    { decade: "60", code: "F" },
    { decade: "70", code: "G" },
    { decade: "80", code: "H" },
  ];
  const details = [
    { label: "초반", num: "1" },
    { label: "중반", num: "2" },
    { label: "후반", num: "3" },
  ];
  ages.forEach((age, i) => {
    details.forEach(detail => {
      ageOptions.push({
        label: `${age.decade}대 ${detail.label}`,
        value: `${detail.num}${age.code}`
      });
    });
  });


  // 다음 버튼 핸들러
  const handleNext = async () => {
    if (step === "nickname") {
      setStep("gender");
    } else if (step === "gender") {
      setStep("ageGrp");
    } else if (step === "ageGrp") {
      // 모든 정보로 로그인 API 호출
      const res = await makeApiRequest('/user/update', 'PATCH', user?.accessToken ?? '', {
        userId: user?.userId,
        userNm: nickname,
        profileImage: user?.profileImage,
        gender,
        ageGrp,
      });
      if (res && res.status === 200 && res.data) {
        setUser(prev => ({
          ...prev,
          userNm: res.data.userNm,
          profileImage: res.data.profileImage,
          userId: res.data.userId,
          gender: res.data.gender,
          isActive: res.data.isActive,
          ageGrp: res.data.ageGrp,
          createdAt: res.data.createdAt,
          deletedAt: res.data.deletedAt,
        }));
        router.replace('./welcome');
      }
    }
  };

  // 각 단계별 입력 UI
  let content = null;
  if (step === "nickname") {
    content = (
      <>
        <Text style={styles.title}>어서오세요</Text>
        <Text style={styles.subtitle}>닉네임을 입력해주세요</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={user?.userNm}
            placeholderTextColor="#999"
            value={nickname}
            onChangeText={setNickname}
          />
          <Ionicons name="checkmark" size={24} style={styles.checkIcon} />
        </View>
      </>
    );
  } else if (step === "gender") {
    content = (
      <>
        <Text style={styles.title}>성별을 선택해주세요</Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <Pressable
            style={[
              styles.genderButton,
              gender === "M" && styles.genderButtonSelected,
            ]}
            onPress={() => setGender("M")}
          >
            <Text style={styles.genderText}>남자</Text>
          </Pressable>
          <Pressable
            style={[
              styles.genderButton,
              gender === "F" && styles.genderButtonSelected,
            ]}
            onPress={() => setGender("F")}
          >
            <Text style={styles.genderText}>여자</Text>
          </Pressable>
        </View>
      </>
    );
  } else if (step === "ageGrp") {
    content = (
      <>
        <Text style={styles.title}>나이대를 선택해주세요</Text>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={ageGrp}
            onValueChange={setAgeGrp}
            style={{ flex: 1 }}
          >
            <Picker.Item label="나이대를 선택하세요" value="" />
            {ageOptions.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </>
    );
  }

  // 다음 버튼 활성화 조건
  const isNextEnabled =
    (step === "nickname" && nickname.trim() !== "") ||
    (step === "gender" && gender !== "") ||
    (step === "ageGrp" && ageGrp.trim() !== "");

  return (
    <View style={styles.container}>
      {content}
      <Pressable
        style={[
          styles.button,
          !isNextEnabled && { backgroundColor: "#ccc" },
        ]}
        onPress={handleNext}
        disabled={!isNextEnabled}
      >
        <Text style={styles.buttonText}>
          {step === "ageGrp" ? "완료" : "다음"}
        </Text>
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
    genderButton: {
      flex: 1,
      backgroundColor: "#f6f6f6",
      paddingVertical: 14,
      borderRadius: 4,
      alignItems: "center",
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: "#ccc",
    },
    genderButtonSelected: {
      backgroundColor: "#5bc065",
      borderColor: "#5bc065",
    },
    genderText: {
      color: "#333",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  