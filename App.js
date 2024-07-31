import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CPR from "./screens/CPR";
import { View } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
  );
}
