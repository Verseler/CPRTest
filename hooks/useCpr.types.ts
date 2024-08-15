import { Audio, AVPlaybackSource } from "expo-av";

export type Compression = {
  depthAttempt: number;
  depthScore: string;
  timingScore: string;
  overallScore: string;
};

export type CompressionScore = Omit<Compression, "depthAttempt">;

export type SoundCue = "push" | "pushFaster" | "pushHarder" | "pushSoftly";

export type TSoundRef = Record<SoundCue, Audio.Sound>;

export type SoundFile = {
  name: SoundCue;
  file: AVPlaybackSource;
}

