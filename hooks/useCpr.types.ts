import { Audio, AVPlaybackSource } from "expo-av";
import { DepthScore, TimingScore } from "./new/useCpr.types";

export type SoundCue = "push" | "pushFaster" | "pushHarder" | "pushSoftly";

export type TSoundRef = Record<SoundCue, Audio.Sound>;

export type SoundFile = {
  name: SoundCue;
  file: AVPlaybackSource;
}

export type Score = "yellow" | "green" | "red" | "gray"

// export type TimingScore = Exclude<Score, "yellow" | "gray">

export type Compression = {
  compressionDepth: number | null;
  depthScore: DepthScore | null;
  timingScore:  TimingScore | null;
  overallScore: Score | null;
};
export type CompressionRecord = {
  score: Compression,
  time: string 
} 

export type CompressionScore = Omit<Compression, "depthAttempt">;
