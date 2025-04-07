import { Link } from "expo-router";
import { View, ActivityIndicator, Button, Text, Image } from "react-native";
import { ROUTES } from "../../constants/Pages";

export default function Setting() {
  const settingList = [
    { name: "ACCOUNT", title: "계정 정보" },
    { name: "GOALS", title: "목표 관리" },
    { name: "NOTIFICATIONS", title: "알림 설정" },
    { name: "BACKUP", title: "데이터 백업 및 복원" },
  ];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      {settingList.map((item) => {
        const name = item.name;
        return (
          <View key={name}>
            <Link href={ROUTES[name as keyof typeof ROUTES]} asChild>
              <Button title={item.title} />
            </Link>
          </View>
        );
      })}
    </View>
  );
}
