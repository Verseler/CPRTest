import { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

function ScoreCircle({ label, score, size, backgroundColor, borderColor }) {
  if (size === "big") {
    return (
      <View
        style={[
          styles.scoreCircleContainer,
          styles.bigCircle,
          { backgroundColor: backgroundColor, borderColor: borderColor },
        ]}
      >
        <Text style={[styles.score, styles.bigScore]}>{score}</Text>
        <Text style={[styles.label, styles.bigLabel, { bottom: 24 }]}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.scoreCircleContainer, styles.smallCircle]}>
      <Text style={[styles.score, styles.smallScore]}>{score}</Text>
      <Text style={[styles.label, styles.smallLabel]}>{label}</Text>
    </View>
  );
}

export default memo(ScoreCircle);

const styles = StyleSheet.create({
  scoreCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderColor: "#a6a6a6",
    backgroundColor: "#bab8b8",
    borderRadius: 500,
    maxHeight: "90%",
  },
  smallCircle: {
    width: 155,
    height: 155,
    borderWidth: 5,
  },
  bigCircle: {
    width: 270,
    height: 270,
    borderWidth: 7,
  },
  score: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  smallScore: {
    fontSize: 20,
  },
  bigScore: {
    fontSize: 33,
  },
  label: {
    position: "absolute",
    bottom: 12,
    fontWeight: "500",
    color: "white",
  },
  smallLabel: {
    fontSize: 13,
  },
  bigLabel: {
    fontSize: 18,
  },
});
