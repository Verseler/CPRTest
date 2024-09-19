import { View, StyleSheet } from "react-native";
import useCpr from "../hooks/new/useCpr";
import { CprHeader } from "../components/CprHeader";
import CircularScore from "../components/CircularScore";
import OverallScoreBar from "../components/OverallScoreBar";
import CircularProgress from "../components/CircularProgress";

const CPRGuide = () => {
  const {
    compressionCount,
    currentCompressionScore,
    timer,
    start,
    stop,
    msCounter,
  } = useCpr();

  const compressionRateTimer = (msCounter * 0.01).toFixed(0);
  const { compressionDepth, depthScore, overallScore, timingScore } =
    currentCompressionScore;

  const timingScoreColor = {
    Perfect: "green",
    "Too Early": "yellow",
    "Too Late": "red",
    Missed: "red",
    default: "darkgray",
  };

  const depthScoreColor = {
    Perfect: "green",
    "Too Shallow": "yellow",
    "Too Deep": "red",
    default: "darkgray",
  };

  return (
    <View style={styles.container}>
      <CprHeader startCpr={start} stopCpr={stop} />

      <View style={styles.scoreContainer}>
        <View style={styles.scoreBarContainer}>
          <OverallScoreBar score={overallScore} />
        </View>
        <View style={styles.circularScoreContainer}>
          {/* <CircularProgress msCounter={compressionRateTimer} /> */}
          <CircularScore size="sm" value={timer} label="TIMER" fontSize={38} />
          <CircularScore
            color={timingScoreColor[timingScore]}
            value={timingScore}
            label="TIMING"
          />
          <CircularScore
            color={depthScoreColor[depthScore]}
            value={depthScore}
            label="DEPTH"
          />
          <CircularScore
            size="sm"
            value={compressionDepth}
            valueColor={depthScoreColor[depthScore]}
            defaultValueColor="#bab8b8"
            label="DEPTH(in)"
            fontSize={44}
          />
        </View>
      </View>
    </View>
  );
};

export default CPRGuide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

// const timingScoreColor = {
//   Perfect: "#22C55E",
//   "Too Early": "#F59E0B",
//   "Too Late": "#DC2626",
//   default: "#bab8b8",
// };

// const depthScoreColor = {
//   Perfect: "#22C55E",
//   "Too Shallow": "#F59E0B",
//   "Too Deep": "#DC2626",
//   default: "#bab8b8",
// };
