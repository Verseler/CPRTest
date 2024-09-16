import { View, StyleSheet } from "react-native";
import { useState, memo } from "react";
import { Divider, Menu, TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type CprHeaderProps = {
  startCpr: () => void;
  stopCpr: () => void;
};

function Header({ startCpr, stopCpr }: CprHeaderProps) {
  const [visibleActionMenu, setVisibleActionMenu] = useState(false);

  const openActionMenu = (): void => setVisibleActionMenu(true);
  const closeActionMenu = (): void => setVisibleActionMenu(false);

  return (
    <View style={styles.header}>
      <Menu
        visible={visibleActionMenu}
        onDismiss={closeActionMenu}
        anchor={<MoreOptionActionButton onPress={openActionMenu} />}
      >
        <Menu.Item onPress={startCpr} title="Start" />
        <Divider />
        <Menu.Item onPress={stopCpr} title="Stop" />
      </Menu>
    </View>
  );
}

type MoreOptionActionButtonProps = {
  onPress: () => void;
};

function MoreOptionActionButton({ onPress }: MoreOptionActionButtonProps) {
  return (
    <TouchableRipple onPress={onPress} style={styles.optionButton}>
      <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
    </TouchableRipple>
  );
}

export const CprHeader = memo(Header);

const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "flex-end",
  },
  optionButton: {
    width: 33,
    height: 33,
    borderRadius: 33,
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  },
});
