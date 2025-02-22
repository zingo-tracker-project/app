import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RootLayout from './_layout'

const tab = createBottomTabNavigator()

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <View  style={styles.test}><Text>징고 트래커 프로젝트</Text></View>
        <View style={{flex: 1}}>
            <View style={{flex: 1}}><Text>1234</Text></View>
            <View style={{flex: 1}}><Text>1234r</Text></View>
        </View>
    </SafeAreaView>
    //   <RootLayout>
    //       <View  style={styles.test}><Text>징고 트래커 프로젝트</Text></View>
    //   </RootLayout>
  );
}
const styles = StyleSheet.create({
    test: {
        flex: 1,
        color: 'red',
    }
})
