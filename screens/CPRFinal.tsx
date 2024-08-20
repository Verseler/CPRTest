import { StyleSheet, View } from "react-native";
import OverallScoreBar from "../components/OverallScoreBar";
import CircularScore from "../components/CircularScore";
import useCpr from "../hooks/useCpr";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Score, TimingScore } from "../hooks/useCpr.types";

function CPRFinal() {
  const {
    timer,
    toggleStartAndStop,
    currentCompressionScore,
    depth,
    compressionHistory,
  } = useCpr();

  const { depthAttempt, depthScore, timingScore, overallScore } =
    currentCompressionScore;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={toggleStartAndStop}
          style={styles.optionButton}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreBarContainer}>
          <OverallScoreBar score={overallScore} />
        </View>
        <View style={styles.circularScoreContainer}>
          <CircularScore size="sm" value={timer} label="TIMER" fontSize={38} />
          <CircularScore
            color={timingScore}
            value={
              timingScore
                ? timingScoreValue[timingScore]
                : timingScoreValue.gray
            }
            label="TIMING"
          />
          <CircularScore
            color={depthScore}
            value={
              depthScore ? depthScoreValue[depthScore] : depthScoreValue.gray
            }
            label="DEPTH"
          />
          <CircularScore
            size="sm"
            value={depthAttempt}
            valueColor={depthScore}
            label="DEPTH (in)"
            fontSize={44}
          />
        </View>
      </View>
    </View>
  );
}

export default CPRFinal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "flex-end",
  },
  optionButton: {
    width: 33,
    height: 33,
    borderRadius: 33,
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreContainer: {
    flex: 1,
  },
  scoreBarContainer: {
    flex: 1,
    maxHeight: "35%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  circularScoreContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
    alignItems: "flex-end",
    justifyContent: "center",
    columnGap: 10,
  },
});

const depthScoreValue: Record<Score, string> = {
  green: "Perfect",
  yellow: "Too  Little",
  red: "Too Much",
  gray: "",
};

const timingScoreValue: Record<TimingScore, string> = {
  green: "Perfect",
  red: "Bad",
  gray: "",
};
