import React, { useEffect, useRef } from "react";
import Svg, { Circle } from "react-native-svg";

const CIRCLE_LENGTH = 1000;
const RADIUS = CIRCLE_LENGTH / (2 * Math.PI);

const CycleTimer = ({ progressValue }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: progressValue,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [progressValue]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1000],
    outputRange: [CIRCLE_LENGTH, 0],
  });

  return (
    <View style={styles.container}>
      <Svg width={200} height={200}>
        <Circle
          cx="100"
          cy="100"
          r={RADIUS}
          stroke="gray"
          strokeWidth="10"
          fill="none"
        />
        <AnimatedCircle
          cx="100"
          cy="100"
          r={RADIUS}
          stroke="tomato"
          strokeWidth="10"
          fill="none"
          strokeDasharray={CIRCLE_LENGTH}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default CycleTimer;
