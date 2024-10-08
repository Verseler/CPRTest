import { View, Text, StyleSheet } from "react-native";
import { Score } from "../hooks/useCpr.types";

type CircularScoreProps = {
  size?: "lg" | "sm";
  color?: Score | null;
  value: string | number | Score | null;
  valueColor?: string | null;
  defaultValueColor?: string;
  label: string;
  fontSize?: number;
};

function CircularScore({
  size = "lg",
  color = "gray",
  value,
  valueColor,
  defaultValueColor = "white",
  label,
  fontSize = 35,
}: CircularScoreProps) {
  return (
    <View
      style={[
        styles.container,
        {
          height: sizeStyle[size],
          width: sizeStyle[size],
          borderColor: color ? colorStyle[color].borderColor : "darkgray",
          backgroundColor: color
            ? colorStyle[color].backgroundColor
            : "darkgray",
        },
      ]}
    >
      <Text
        style={[
          styles.value,
          {
            color: valueColor ?? defaultValueColor,
            fontSize: fontSize,
          },
        ]}
      >
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default CircularScore;

const styles = StyleSheet.create({
  container: {
    height: 170,
    width: 170,
    borderRadius: 99,
    backgroundColor: "#D9D9D9",
    borderWidth: 6,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
    position: "absolute",
    bottom: 12,
  },
});

const sizeStyle = {
  lg: 170,
  sm: 140,
};

const colorStyle = {
  green: {
    backgroundColor: "#22C55E",
    borderColor: "#1CAE52",
  },
  red: {
    backgroundColor: "#DC2626",
    borderColor: "#BB1E1E",
  },
  yellow: {
    backgroundColor: "#F59E0B",
    borderColor: "#D48806",
  },
  gray: {
    backgroundColor: "#bab8b8",
    borderColor: "#a6a6a6",
  },
};
