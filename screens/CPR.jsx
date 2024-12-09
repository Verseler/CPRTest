import { StyleSheet, Text, View, Button } from "react-native";
import useTimingAudio from "./hooks/useTimingAudio";
import useCpr from "./hooks/useCpr"; // Import the custom hook
import { useNavigation } from "@react-navigation/native";

export default function CPR() {
  const { isLoading, playAudio, pauseAudio } = useTimingAudio();
  const {
    compressionCount,
    timingScore,
    compressionDepth,
    depthScore,
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
      <Text style={styles.sensorData}>
        Compression Count: {compressionCount}
      </Text>

      <Text style={styles.sensorData}>
        Compression Depth: {compressionDepth} inches
      </Text>

      <View style={styles.content}>
        <View style={styles.scoreCircleContainer}>
          <Text style={styles.score}>{timingScore}</Text>
        </View>
        <View style={styles.scoreCircleContainer}>
          <Text style={styles.score}>{depthScore}</Text>
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
    marginBottom: 16,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 20,
  },
  scoreCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "gray",
    borderRadius: 500,
    width: 220,
    height: 220,
  },
  score: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "gray",
  },
});
