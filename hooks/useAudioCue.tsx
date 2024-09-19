import { useEffect, useRef } from "react";
import { ToastAndroid } from "react-native";
import { Audio, AVPlaybackSource } from "expo-av";
import { type TSoundRef, type SoundFile } from "./useCpr.types";

import { MutableRefObject } from "react";
import { Compression, SoundCue } from "./useCpr.types";

const PushAudio = require("../assets/audio/push.mp3") as AVPlaybackSource;
const PushFasterAudio =
  require("../assets/audio/pushFaster.mp3") as AVPlaybackSource;
const PushHarderAudio =
  require("../assets/audio/pushHarder.mp3") as AVPlaybackSource;
const PushSoftlyAudio =
  require("../assets/audio/pushSoftly.mp3") as AVPlaybackSource;

const useAudioCue = () => {
  const soundsRef = useRef<TSoundRef>({
    push: new Audio.Sound(),
    pushFaster: new Audio.Sound(),
    pushHarder: new Audio.Sound(),
    pushSoftly: new Audio.Sound(),
  });

  // Preload all sounds
  useEffect(() => {
    const preloadAudio = async () => {
      try {
        const soundFiles: Array<SoundFile> = [
          { name: "push", file: PushAudio },
          { name: "pushFaster", file: PushFasterAudio },
          { name: "pushHarder", file: PushHarderAudio },
          { name: "pushSoftly", file: PushSoftlyAudio },
        ];

        for (const { name, file } of soundFiles) {
          await soundsRef.current[name].loadAsync(file);
          await soundsRef.current[name].setStatusAsync({ shouldPlay: false });
        }
      } catch (err: unknown) {
        const error = err as Error;
        ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
      }
    };

    preloadAudio();

    return () => {
      // Unload all sounds when the component is unmounted
      for (const key in soundsRef.current) {
        const keyName = key as keyof TSoundRef;
        soundsRef.current[keyName].unloadAsync();
      }
    };
  }, []);

  const playAudioCue = async (compressionScore: Compression): Promise<void> => {
    const { depthScore, timingScore } = compressionScore;
    let soundCue: SoundCue = "push";

    if (depthScore === "Perfect" && timingScore === "Perfect") {
      soundCue = "push";
    } else if (depthScore === "Too Shallow") {
      soundCue = "pushHarder";
    } else if (depthScore === "Too Deep") {
      soundCue = "pushSoftly";
    } else if (timingScore === "Too Late") {
      soundCue = "pushSoftly";
    } else if (timingScore === "Too Early") {
      soundCue = "pushFaster";
    } else if (timingScore === "Missed") {
      soundCue = "push";
    } else {
      soundCue = "push";
    }

    try {
      const sound = soundsRef.current[soundCue];
      if (sound) {
        await sound.replayAsync();
      } else {
        ToastAndroid.show(`Sound not found: ${soundCue}`, ToastAndroid.SHORT);
      }
    } catch (err: unknown) {
      const error = err as Error;
      ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    }
  };

  return { playAudioCue };
};

export default useAudioCue;
