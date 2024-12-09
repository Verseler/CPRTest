import { useNavigation } from "@react-navigation/native";
import { Button, View } from "react-native";

export default function StartingScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Go to CPR" onPress={() => navigation.navigate("CPR")} />
    </View>
  );
}
