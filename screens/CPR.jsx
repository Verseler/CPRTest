import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCpr from "../hooks/useCpr";
import ScoringBar from "../components/ScoringBar";
import COLORS from "../utils/Colors";

export default function CPR() {
  const { timer, timerOn, toggleStartAndStop, compressionAttempt } = useCpr();

  const { depthAttempt, depthScore, timingScore, overallScore } =
    compressionAttempt;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.timer}>{timer}</Text> */}
        <TouchableOpacity onPress={toggleStartAndStop} style={styles.button}>
          <Text>{timerOn ? "Stop" : "Start"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={{ alignItems: "center" }}>
          <ScoringBar score={overallScore} />
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricContainer}>
            <View style={styles.smallCircle}>
              <Text style={styles.depth}>
                <Text style={styles.timer}>{timer}</Text>
              </Text>
            </View>
            <Text style={styles.feedbackLabel}>TIMER</Text>
          </View>

          <View style={styles.metricContainer}>
            <TimingScoreUI timingScore={timingScore} />
            <Text style={styles.feedbackLabel}>TIMING SCORE</Text>
          </View>

          <View style={styles.metricContainer}>
            <DepthScoreUI depthScore={depthScore} />
            <Text style={styles.feedbackLabel}>DEPTH SCORE</Text>
          </View>

          <View style={styles.metricContainer}>
            <View style={styles.smallCircle}>
              <Text style={styles.depth}>{depthAttempt || "0.0"}</Text>
            </View>
            <Text style={styles.feedbackLabel}>DEPTH (in)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const TimingScoreUI = ({ timingScore }) => {
  const BG_COLOR = {
    Perfect: COLORS.green,
    Bad: COLORS.red,
  };

  //if there is a timingAttempt or score
  if (timingScore) {
    return (
      <View
        style={[
          styles.feedbackContainer,
          { backgroundColor: BG_COLOR[timingScore] },
        ]}
      >
        <Text style={styles.feedbackScore}>{timingScore}</Text>
      </View>
    );
  }

  return (
    <View style={styles.feedbackContainer}>
      <Text style={styles.feedbackScore}></Text>
    </View>
  );
};

const DepthScoreUI = ({ depthScore }) => {
  const BG_COLOR = {
    Perfect: COLORS.green,
    "Too much": COLORS.red,
    "Too little": COLORS.yellow,
    Inactive: "gray",
  };

  //if there is a depthAttempt or score
  if (depthScore) {
    return (
      <View
        style={[
          styles.feedbackContainer,
          { backgroundColor: BG_COLOR[depthScore] },
        ]}
      >
        <Text style={styles.feedbackScore}>
          {depthScore != "Inactive" && depthScore}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.feedbackContainer}>
      <Text style={styles.feedbackScore}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    height: 56,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timer: {
    textAlign: "center",
    fontSize: 28,
    color: "white",
  },

  body: {
    flex: 1,
    rowGap: 14,
  },
  metricsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    columnGap: 16,
    paddingBottom: 10,
  },
  metricContainer: {
    alignItems: "center",
    rowGap: 10,
  },
  feedbackContainer: {
    height: 190,
    width: 190,
    maxHeight: "100%",
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  feedbackLabel: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackScore: {
    textAlign: "center",
    fontSize: 38,
    fontWeight: "bold",
    color: "white",
  },

  smallCircle: {
    height: 130,
    width: 130,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  depth: {
    fontSize: 40,
    fontWeight: "500",
    color: "white",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "#111",
  },
});
