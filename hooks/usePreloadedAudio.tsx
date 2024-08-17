import { useEffect, useRef } from "react";
import { ToastAndroid } from "react-native";
import { Audio, AVPlaybackSource } from "expo-av";
import { type TSoundRef, type SoundFile } from "./useCpr.types";

const PushAudio = require("../assets/audio/push.mp3") as AVPlaybackSource;
const PushFasterAudio =
  require("../assets/audio/pushFaster.mp3") as AVPlaybackSource;
const PushHarderAudio =
  require("../assets/audio/pushHarder.mp3") as AVPlaybackSource;
const PushSoftlyAudio =
  require("../assets/audio/pushSoftly.mp3") as AVPlaybackSource;

const usePreloadedAudio = () => {
  const soundsRef = useRef<TSoundRef>({
    push: new Audio.Sound(),
    pushFaster: new Audio.Sound(),
    pushHarder: new Audio.Sound(),
    pushSoftly: new Audio.Sound(),
  });

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
      for (const key in soundsRef.current) {
        const keyName = key as keyof TSoundRef;
        soundsRef.current[keyName].unloadAsync();
      }
    };
  }, []);

  return soundsRef;
};

export default usePreloadedAudio;
