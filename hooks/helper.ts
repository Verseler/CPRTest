import { MutableRefObject } from "react";
import { type Compression, type TSoundRef, type SoundCue } from "./useCpr.types";
import { Alert } from "react-native";
export const playAudioCue = async (
  prevScores: MutableRefObject<Compression>,
  soundsRef: MutableRefObject<TSoundRef>
): Promise<void> => {
  const { depthScore, timingScore, overallScore } = prevScores.current;
  let soundCue: SoundCue = "push";

  if (overallScore === "0" || overallScore === "1") {
    soundCue = "pushFaster";
  } else if (depthScore == "Too little" && timingScore == "Perfect") {
    soundCue = "pushHarder";
  } else if (depthScore === "Perfect" && timingScore === "Bad") {
    soundCue = "pushFaster";
  } else if (overallScore >= "4") {
    soundCue = "pushSoftly";
  } else {
    soundCue = "push";
  }

  try {
    const sound = soundsRef.current[soundCue];
    if (sound) {
      await sound.replayAsync();
    } else {
      console.error("Sound not found:", soundCue);
      Alert.alert(`Sound not found: ${soundCue}`);
    }
  } catch (error) {
    console.error("Error playing sound:", error);
    Alert.alert(`Error playing sound: ${error}`);
  }
};

export const formatTime = (time: number): string => {
  const totalSeconds: number = Math.floor(time / 1000);
  const minutes: number = Math.floor(totalSeconds / 60);
  const seconds: number = totalSeconds % 60;

  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

export const getTimingScore = (depth: number): string => (depth >= 0.2 ? "Perfect" : "Bad");

export const getDepthScore = (depth: number): string => {
  if (depth >= 2 && depth <= 2.5) return "Perfect";
  else if (depth > 2.5) return "Too much";
  else if (depth >= 0.2 && depth < 2) return "Too little";
  return "Inactive";
};

export const getOverallScore = (depthScore: string, timingScore: string): string => {
  if (depthScore == "Inactive") return "0";
  else if (depthScore == "Too little" && timingScore == "Bad") return "1";
  else if (depthScore == "Too little" && timingScore == "Perfect") return "2";
  else if (depthScore == "Perfect" && timingScore == "Bad") return "2";
  else if (depthScore == "Perfect" && timingScore == "Perfect") return "3";
  else if (depthScore == "Too much" && timingScore == "Perfect") return "4";
  else if (depthScore == "Too much" && timingScore == "Bad") return "5";

  return "0";
};
