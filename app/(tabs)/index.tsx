import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const tab = createBottomTabNavigator()

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <View><Text>징고 트래커 프로젝트</Text></View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    test: {
        flex: 1,
        color: 'red',
    }
})
