import {
  NavigationContainer,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
  },
});
const Navigation = createStaticNavigation(RootStack);
export default function App() {
  return (
    // <useNavigation>
    //   <HomeScreen />
    // </useNavigation>
    <Navigation />
  );
}
