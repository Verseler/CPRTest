import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const CircularProgress = ({ msCounter }: { msCounter: number }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Convert the msCounter value (1 to 6) to degrees (0 to 360)
  const getRotationValue = (value: number) => {
    // 1 maps to 0 degrees, 6 maps to 360 degrees
    return (value / 6) * 360;
  };

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: getRotationValue(msCounter),
      duration: 5,
      useNativeDriver: true,
    }).start();
  }, [msCounter]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Animated.View
          style={[styles.indicator, { transform: [{ rotate: rotation }] }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 5,
    height: 100, // Half the radius of the circle
    backgroundColor: "red",
    position: "absolute",
    top: 0, // Start at the top of the circle
  },
});

export default CircularProgress;
