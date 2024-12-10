import { StyleSheet, Text, View, Button } from "react-native";
import useTimingAudio from "./hooks/useTimingAudio";
import useCpr from "./hooks/useCpr"; // Import the custom hook
import { useNavigation } from "@react-navigation/native";
import { getOverallScoreColor } from "./cpr.helper";
import ScoreCircle from "./components/ScoreCircle";
import { useMemo } from "react";

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
  const { backgroundColor, borderColor } = useMemo(
    () => getOverallScoreColor(overallScore),
    [overallScore]
  );
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

  //! remove this later
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
        <ScoreCircle label="Timing" score={timingScore} size="small" />
        <ScoreCircle
          label="Overall"
          score={overallScore}
          size="big"
          backgroundColor={backgroundColor}
          borderColor={borderColor}
        />
        <ScoreCircle label="Depth" score={depthScore} size="small" />
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
    borderColor: "#a6a6a6",
    backgroundColor: "#bab8b8",
    borderRadius: 500,
    maxHeight: "90%",
  },
});
