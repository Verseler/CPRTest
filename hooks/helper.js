export const formatTime = (time) => {
  const totalSeconds = Math.floor(time / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

export const getTimingScore = (depth) => (depth >= 0.2 ? "Perfect" : "Bad");

export const getDepthScore = (depth) => {
  if (depth >= 2 && depth <= 2.5) return "Perfect";
  else if (depth > 2.5) return "Too much";
  else if (depth >= 0.3 && depth < 2) return "Too little";
  return "Inactive";
};

export const getOverallScore = (depthScore, timingScore) => {
  if (depthScore == "Inactive") return 0;
  else if (depthScore == "Too little" && timingScore == "Bad") return 1;
  else if (depthScore == "Too little" && timingScore == "Perfect") return 2;
  else if (depthScore == "Perfect" && timingScore == "Bad") return 2;
  else if (depthScore == "Perfect" && timingScore == "Perfect") return 3;
  else if (depthScore == "Too much" && timingScore == "Perfect") return 4;
  else if (depthScore == "Too much" && timingScore == "Bad") return 5;

  return 0;
};

export const playAudioCue = (prevScores) => {
  if (prevScores.current.overallScore == 1) {
    console.log("audio cue: Push Faster");
  } else if (prevScores.current.overallScore == 2) {
    console.log("audio cue: Push Harder");
  } else if (
    prevScores.current.depthScore == "Perfect" &&
    prevScores.current.timingScore == "Bad"
  ) {
    console.log("audio cue: Push Faster");
  } else if (prevScores.current.overallScore >= 4) {
    console.log("audio cue: Push Softly");
  } else {
    //overallScore == 3 or else
    console.log("audio cue: Push");
  }
};
