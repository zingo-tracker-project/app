import { Link } from "expo-router";
import { View, ActivityIndicator, Button, Text, Image } from "react-native";
import { ROUTES } from "../../constants/Pages";

export default function Setting() {
  const settingList = [
    { name: "ACCOUNT", title: "계정 정보" },
    { name: "GOALS", title: "목표" },
    { name: "NOTIFICATIONS", title: "알림" },
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
          <View>
            <Link href={ROUTES[name as keyof typeof ROUTES]} asChild>
              <Button title={item.title} />
            </Link>
          </View>
        );
      })}
    </View>
  );
}
