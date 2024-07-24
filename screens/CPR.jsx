import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCpr from "../hooks/useCpr";
import ScoringBar from "../components/ScoringBar";

export default function CPR() {
  const {
    z,
    depth,
    timer,
    timerOn,
    depthAttempt,
    timingAttempt,
    overallScore,
    toggleStartAndStop,
  } = useCpr();

  const displayDepthAttemptFeedback = (depth) => {
    //default feedback data
    let feedback = {
      backgroundColor: "orange",
      message: "Too little",
    };

    if (depth >= 2 && depth <= 2.5) {
      feedback = { backgroundColor: "green", message: "Perfect" };
    } else if (depth > 2.5) {
      feedback = { backgroundColor: "red", message: "Too much" };
    } else {
      feedback = { backgroundColor: "orange", message: "Too little" };
    }

    //if there is a depthAttempt
    if (depth) {
      return (
        <View
          style={[
            styles.feedbackContainer,
            { right: 10, backgroundColor: feedback.backgroundColor },
          ]}
        >
          <Text style={styles.depthFeedback}>{feedback.message}</Text>
        </View>
      );
    }

    return <View style={[styles.feedbackContainer, { right: 10 }]}></View>;
  };

  const displayTimingAttemptFeedback = (timing) => {
    //default feedback data
    let feedback = {
      backgroundColor: "red",
      message: "Bad",
    };

    if (timing == "Perfect") {
      feedback = { backgroundColor: "green", message: "Perfect" };
    } else {
      feedback = { backgroundColor: "red", message: "Bad" };
    }

    //if there is a timingAttempt
    if (timing) {
      return (
        <View
          style={[
            styles.feedbackContainer,
            { left: 10, backgroundColor: feedback.backgroundColor },
          ]}
        >
          <Text style={styles.timingFeedback}>{feedback.message}</Text>
        </View>
      );
    }

    return <View style={[styles.feedbackContainer, { left: 10 }]}></View>;
  };

  const displayOverallScore = (score) => {
    const SCORE_BG = {
      0: "gray",
      1: "orange",
      2: "green",
      3: "red",
      4: "darkred",
    };

    //if there is a depthAttempt
    if (score && score != 0) {
      return (
        <View
          style={[
            styles.overAllScoreContainer,
            { backgroundColor: SCORE_BG[score] },
          ]}
        >
          <Text style={styles.overallScore}>{score}</Text>
        </View>
      );
    }

    return (
      <View
        style={[styles.overAllScoreContainer, { backgroundColor: SCORE_BG[0] }]}
      >
        <Text style={[styles.overallScore]}>0</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <ScoringBar score={overallScore} />
      </View>
      {displayOverallScore(overallScore)}
      <Text style={styles.text}>Z : {z.toFixed(1)}</Text>
      <Text style={styles.text}>Compression Depth: {depth} in</Text>
      <Text style={styles.text}>Time: {timer}</Text>

      <TouchableOpacity onPress={toggleStartAndStop} style={styles.button}>
        <Text>{timerOn ? "Stop" : "Start"}</Text>
      </TouchableOpacity>

      <Text
        style={{
          color: "white",
          fontSize: 30,
          fontWeight: "bold",
          position: "absolute",
          bottom: "44%",
          right: 58,
        }}
      >
        {depthAttempt}
      </Text>
      {displayTimingAttemptFeedback(timingAttempt)}
      <Text style={[styles.attemptFeedbackLabel, { left: 58 }]}>TIMING</Text>
      {displayDepthAttemptFeedback(depthAttempt)}
      <Text style={[styles.attemptFeedbackLabel, { right: 58 }]}>DEPTH</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#121212",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
  },
  button: {
    width: 300,
    maxWidth: "90%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  feedbackContainer: {
    position: "absolute",
    bottom: 24,
    height: 150,
    width: 150,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
  timingFeedback: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  depthFeedback: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  attemptFeedbackLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    position: "absolute",
    bottom: 0,
  },
  overAllScoreContainer: {
    position: "absolute",
    top: 20,
    left: "45%",
    height: 50,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
    borderWidth: 1,
  },
  overallScore: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
