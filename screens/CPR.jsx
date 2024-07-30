import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCpr from "../hooks/useCpr";
import ScoringBar from "../components/ScoringBar";
import COLORS from "../utils/Colors";

export default function CPR() {
  const {
    depthRef,
    timer,
    timerOn,
    depthAttempt,
    timingAttempt,
    overallScore,
    toggleStartAndStop,
  } = useCpr();

  //optional: kung gusto naay depth sa ui
  // const [depth, setDepth] = useState(depthRef.current);

  // useEffect(() => {
  //   setDepth(depthRef.current);
  // }, [depthRef.current]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>LK</Text>
        <Text style={styles.timer}>{timer}</Text>
        <TouchableOpacity onPress={toggleStartAndStop} style={styles.button}>
          <Text>{timerOn ? "Stop" : "Start"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <ScoringBar score={overallScore} />
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricContainer}>
            <View style={styles.smallCircle}>
              <Text style={styles.depth}>?</Text>
            </View>
            <Text style={styles.feedbackLabel}>?</Text>
          </View>

          <View style={styles.metricContainer}>
            <DisplayTimingAttemptFeedback timing={timingAttempt} />
            <Text style={styles.feedbackLabel}>TIMING SCORE</Text>
          </View>

          <View style={styles.metricContainer}>
            <DisplayDepthAttemptFeedback depth={depthAttempt} />
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

const DisplayDepthAttemptFeedback = ({ depth }) => {
  const feedback_values = {
    perfect: {
      backgroundColor: COLORS.green,
      message: "Perfect",
    },
    over: {
      backgroundColor: COLORS.red,
      message: "Too Much",
    },
    under: {
      backgroundColor: COLORS.yellow,
      message: "Too   Little",
    },
    inactive: {
      backgroundColor: "gray",
      message: "",
    },
  };

  let feedback = feedback_values.perfect;

  if (depth >= 2 && depth <= 2.5) feedback = feedback_values.perfect;
  else if (depth > 2.5) feedback = feedback_values.over;
  else if (depth > 0 && depth < 2) feedback = feedback_values.under;
  else feedback = feedback_values.inactive;

  //if there is a depthAttempt
  if (depth) {
    return (
      <View
        style={[
          styles.feedbackContainer,
          { backgroundColor: feedback.backgroundColor },
        ]}
      >
        <Text style={styles.feedbackScore}>{feedback.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.feedbackContainer}>
      <Text style={styles.feedbackScore}></Text>
    </View>
  );
};

const DisplayTimingAttemptFeedback = ({ timing }) => {
  const feedback_values = {
    perfect: {
      backgroundColor: COLORS.green,
      message: "Perfect",
    },
    bad: {
      backgroundColor: COLORS.red,
      message: "Bad",
    },
  };

  let feedback = feedback_values.perfect;

  if (timing == "Perfect") feedback = feedback_values.perfect;
  else feedback = feedback_values.bad;

  //if there is a timingAttempt
  if (timing) {
    return (
      <View
        style={[
          styles.feedbackContainer,
          { backgroundColor: feedback.backgroundColor },
        ]}
      >
        <Text style={styles.feedbackScore}>{feedback.message}</Text>
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
    // backgroundColor: "#121212", dark mode background
  },
  header: {
    height: 60,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    padding: 10,
  },
  timer: {
    textAlign: "center",
    fontSize: 28,
    color: "#111",
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
