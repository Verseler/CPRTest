import { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { type Score } from "../hooks/useCpr.types";
import { Color } from "../screens/cpr.types";

type ScoreBarProps = {
  score: Score | null;
};

const OverallScoreBar = ({ score }: ScoreBarProps) => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const SCORE_PROGRESS_VALUE: Record<Score, number> = {
    gray: 0,
    yellow: 13,
    green: 45,
    red: 78,
  };

  useEffect(() => {
    Animated.timing(progress, {
      toValue: SCORE_PROGRESS_VALUE[score || "gray"],
      duration: 15,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  }, [score]);

  const progressPosition = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { left: progressPosition }]} />

      <View style={[styles.scoreBox, { backgroundColor: Color.yellow }]} />
      <View style={[styles.scoreBox, { backgroundColor: Color.green }]} />
      <View style={[styles.scoreBox, { backgroundColor: Color.red }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 3,
    margin: 10,
    width: 260,
    borderWidth: 2.5,
    flexDirection: "row",
  },
  bar: {
    height: 46,
    width: 24,
    zIndex: 90,
    position: "absolute",
    bottom: -6,
    backgroundColor: "white",
    borderWidth: 3,
  },
  scoreBox: {
    height: "100%",
    zIndex: 0,
    flex: 1,
  },
});

export default OverallScoreBar;
