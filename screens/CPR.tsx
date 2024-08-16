import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCpr from "../hooks/useCpr";
import OverallScoreBar from "../components/OverallScoreBar";
// import COLORS from "../utils/Colors";
import { type TimingScore, type Score } from "../hooks/useCpr.types";
import {
  type TimingScoreUIProps,
  type DepthScoreUIProps,
  Colors,
} from "./cpr.types";

export default function CPR() {
  const { timer, timerOn, toggleStartAndStop, currentCompressionScore, depth } =
    useCpr();

  const { depthAttempt, depthScore, timingScore, overallScore } =
    currentCompressionScore;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor:
            overallScore === "green"
              ? "#4BB543"
              : overallScore === "red"
              ? "red"
              : "transparent",
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleStartAndStop} style={styles.button}>
          <Text>{timerOn ? "Stop" : "Start"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={{ alignItems: "center" }}>
          <OverallScoreBar score={overallScore} />
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
            <TimingScoreUI score={timingScore} />
            <Text style={styles.feedbackLabel}>TIMING SCORE</Text>
          </View>

          <View style={styles.metricContainer}>
            <DepthScoreUI score={depthScore} />
            <Text style={styles.feedbackLabel}>DEPTH SCORE</Text>
          </View>

          <View style={styles.metricContainer}>
            <View style={styles.smallCircle}>
              {depthAttempt ? (
                <Text
                  style={[
                    styles.depth,
                    {
                      color:
                        depthScore == "green"
                          ? Colors.green
                          : depthScore == "red"
                          ? Colors.red
                          : depthScore == "yellow"
                          ? Colors.yellow
                          : Colors.white,
                    },
                  ]}
                >
                  {depthAttempt}
                </Text>
              ) : (
                <Text style={styles.depth}>{depth}</Text>
              )}
            </View>
            <Text style={styles.feedbackLabel}>DEPTH (in)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const TimingScoreUI = ({ score }: TimingScoreUIProps) => {
  const BG_COLOR: Record<TimingScore, string> = {
    gray: Colors.gray,
    green: Colors.green,
    red: Colors.red,
  };

  const TIMING_SCORE_MESSAGE = {
    gray: "INACTIVE",
    green: "PERFECT",
    red: "BAD",
  };

  //if there is a timingAttempt or score
  if (score) {
    return (
      <View
        style={[styles.feedbackContainer, { backgroundColor: BG_COLOR[score] }]}
      >
        <Text style={styles.feedbackScore}>
          {score && TIMING_SCORE_MESSAGE[score]}
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

const DepthScoreUI = ({ score }: DepthScoreUIProps) => {
  const BG_COLOR: Record<Score, string> = {
    gray: Colors.gray,
    green: Colors.green,
    red: Colors.red,
    yellow: Colors.yellow,
  };

  const DEPTH_SCORE_MESSAGE = {
    gray: "INACTIVE",
    green: "PERFECT",
    red: "TO0 MUCH",
    yellow: "TOO LITTLE",
  };

  //if there is a depthAttempt or score
  if (score) {
    return (
      <View
        style={[styles.feedbackContainer, { backgroundColor: BG_COLOR[score] }]}
      >
        <Text style={styles.feedbackScore}>
          {score && DEPTH_SCORE_MESSAGE[score]}
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
    borderWidth: 8,
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
    fontSize: 32,
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
