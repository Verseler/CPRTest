import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const ScoreBar = ({ score }) => {
  const [progress, setProgress] = useState(new Animated.Value(0));

  const SCORE_PROGRESS_VALUE = {
    0: {
      progress: "0%", //0-24
      backgroundColor: "gray",
    },
    1: {
      progress: "25%", //25-49
      backgroundColor: "orange",
    },
    2: {
      progress: "50%", //50-74
      backgroundColor: "green",
    },
    3: {
      progress: "75%", //75-99
      backgroundColor: "red",
    },
    4: {
      progress: "100%", //100
      backgroundColor: "darkred",
    },
  };

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 75,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: SCORE_PROGRESS_VALUE[score || 0].progress,
            backgroundColor: SCORE_PROGRESS_VALUE[score || 0].backgroundColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
    margin: 10,
    width: 300,
  },
  bar: {
    height: 20,
    backgroundColor: "gray",
    borderRadius: 10,
  },
});

export default ScoreBar;
