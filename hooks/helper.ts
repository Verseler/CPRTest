import { MutableRefObject } from "react";
import { type Compression, type TSoundRef, type SoundCue, type Score, type TimingScore } from "./useCpr.types";
import { Alert } from "react-native";

/*
 * 
 * In playing audio cue, the timingScore is prioritize 
 * 
 * 
 */
export const playAudioCue = async (
  prevScores: MutableRefObject<Compression>,
  soundsRef: MutableRefObject<TSoundRef>
): Promise<void> => {
  const { depthScore, timingScore } = prevScores.current;
  let soundCue: SoundCue = "push";

  if(timingScore === "green" && depthScore === "yellow") {
    soundCue = "pushHarder";
  }
  else if(timingScore === "green" && depthScore === "red") {
    soundCue = "pushSoftly";
  }
  else if(timingScore === "red" && (depthScore === "green" || depthScore === "yellow" || depthScore === "red" || depthScore === "gray")) {
    soundCue = "pushFaster";
  }
  else if(timingScore === "gray" && depthScore === "gray") {
    soundCue = "push";
  }
  else {
    soundCue = "push";
  }

  try {
    const sound = soundsRef.current[soundCue];
    if (sound) {
      await sound.replayAsync();
    } else {
      Alert.alert(`Sound not found: ${soundCue}`);
    }
  } catch (error) {
    Alert.alert(`Error playing sound: ${error}`);
  }
};


export const getTimingScore = (depth: number): TimingScore => {
  if(depth === 0) return "gray";
  else if (depth >= 0.2) return "green";

  return "red";
};

export const getDepthScore = (depth: number): Score => {
  if(depth >= 0 && depth < 0.2) return "gray";
  else if(depth >= 0.2 && depth < 2) return "yellow";
  else if(depth >= 2 && depth <= 2.5) return "green";

  //else depth is greater than 2.5
  return "red";
};

export const getOverallScore = (depthScore: Score, timingScore: TimingScore): Score => {
  if(depthScore === "gray" && timingScore === "gray") return "gray";
  else if(depthScore === "gray" && timingScore === "green") return "gray"; //! impossible
  else if(depthScore === "gray" && timingScore === "red") return "gray"; 
  else if(depthScore === "yellow" && timingScore === "gray") return "yellow";
  else if(depthScore === "green" && timingScore === "gray") return "yellow"; //! impossible
  else if(depthScore === "green" && timingScore === "green") return "green";
  else if (depthScore === "green" && timingScore === "red") return "yellow";
  else if (depthScore === "yellow" && timingScore === "red") return "yellow";
  else if (depthScore === "yellow" && timingScore === "green") return "yellow";
  else if (depthScore === "red" && timingScore === "green") return "red";
  else if(depthScore === "red" && timingScore === "red") return "red";
 
  return "green";
};


export const formatTime = (time: number): string => {
  const totalSeconds: number = Math.floor(time / 1000);
  const minutes: number = Math.floor(totalSeconds / 60);
  const seconds: number = totalSeconds % 60;

  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};
