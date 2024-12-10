import { StyleSheet, Text, View, Button } from "react-native";
import useTimingAudio from "./hooks/useTimingAudio";
import useCpr from "./hooks/useCpr"; // Import the custom hook
import { useNavigation } from "@react-navigation/native";

export default function CPR() {
  const { isLoading, playAudio, pauseAudio } = useTimingAudio();
  const {
    compressionScores: {
      depth: depthScore,
      timing: timingScore,
      overall: overallScore,
    },
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  } = useCpr();
  const navigation = useNavigation();

  const handleStartMonitoring = () => {
    playAudio();
    startMonitoring();
  };

  const handleStopMonitoring = () => {
    pauseAudio();
    stopMonitoring();
  };

  const handleExit = () => {
    handleStopMonitoring();
    navigation.goBack();
  };

  if (isMonitoring === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Start"
          onPress={handleStartMonitoring}
          disabled={isLoading}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Back" onPress={handleExit} />
      </View>
      <View style={styles.content}>
        <View style={[styles.scoreCircleContainer, styles.smallCircle]}>
          <Text style={[styles.score, styles.smallScore]}>{timingScore}</Text>
        </View>
        <View style={[styles.scoreCircleContainer, styles.bigCircle]}>
          <Text style={[styles.score, styles.bigScore]}>{overallScore}</Text>
        </View>
        <View style={[styles.scoreCircleContainer, styles.smallCircle]}>
          <Text style={[styles.score, styles.smallScore]}>{depthScore}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sensorData: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    columnGap: 20,
  },
  scoreCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "gray",
    borderRadius: 500,
    maxHeight: "90%",
  },
  smallCircle: {
    width: 170,
    height: 170,
  },
  bigCircle: {
    width: 290,
    height: 290,
  },
  score: {
    textAlign: "center",
    fontWeight: "bold",
    color: "gray",
  },
  smallScore: {
    fontSize: 22,
  },
  bigScore: {
    fontSize: 36,
  },
});
