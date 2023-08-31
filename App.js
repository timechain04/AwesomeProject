import { useFonts } from "expo-font";
import RegistrationScreen from "./src/components/RegistrationScreen";
import LoginScreen from "./src/components/LoginScreen";
import Home from "./src/components/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const MainStack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStack.Navigator initialRouteName="LoginScreen">
          <MainStack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
            options={{
              headerShown: false,
            }}
          />

          <MainStack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <MainStack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
