import { View, Text, StyleSheet } from "react-native";
import { Score } from "../hooks/useCpr.types";

type CircularScoreProps = {
  size?: "lg" | "sm";
  color?: Score | null;
  value: string | number | Score | null;
  valueColor?: Score | null;
  label: string;
  fontSize?: number;
};

function CircularScore({
  size = "lg",
  color = "gray",
  value,
  valueColor,
  label,
  fontSize = 32,
}: CircularScoreProps) {
  return (
    <View
      style={[
        styles.container,
        {
          height: sizeStyle[size],
          width: sizeStyle[size],
          backgroundColor: color
            ? colorStyle[color].backgroundColor
            : colorStyle.gray.backgroundColor,
          borderColor: color
            ? colorStyle[color].borderColor
            : colorStyle.gray.borderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.value,
          {
            color: valueColor
              ? colorStyle[valueColor].backgroundColor
              : "white",
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
    backgroundColor: "#d3d3d3",
    borderColor: "#CCCCCC",
  },
};
