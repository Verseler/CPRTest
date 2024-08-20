import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CPR from "./screens/CPRold";
import CPRFinal from "./screens/CPRFinal";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="CPRFinal"
            component={CPRFinal}
            options={{
              orientation: "landscape",
              headerShown: false,
              statusBarTranslucent: true,
              statusBarHidden: true,
              statusBarStyle: "light",
            }}
          />
          <Stack.Screen
            name="CPR"
            component={CPR}
            options={{
              orientation: "landscape",
              headerShown: false,
              statusBarTranslucent: true,
              statusBarHidden: true,
              statusBarStyle: "light",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
