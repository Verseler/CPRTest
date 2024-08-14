import { Audio } from "expo-av";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

const usePreloadedAudio = () => {
  const soundsRef = useRef({});

  useEffect(() => {
    const preloadAudio = async () => {
      try {
        const soundFiles = [
          { name: "push", file: require("../assets/audio/push.mp3") },
          {
            name: "pushFaster",
            file: require("../assets/audio/pushFaster.mp3"),
          },
          {
            name: "pushHarder",
            file: require("../assets/audio/pushHarder.mp3"),
          },
          {
            name: "pushSoftly",
            file: require("../assets/audio/pushSoftly.mp3"),
          },
        ];

        for (const { name, file } of soundFiles) {
          soundsRef.current[name] = new Audio.Sound();
          await soundsRef.current[name].loadAsync(file);
          await soundsRef.current[name].setStatusAsync({ shouldPlay: false });
        }
      } catch (error) {
        Alert.alert(`Error preloading sound: ${error}`);
      }
    };

    preloadAudio();

    return () => {
      for (const key in soundsRef.current) {
        soundsRef.current[key].unloadAsync();
      }
    };
  }, []);

  return soundsRef;
};

export default usePreloadedAudio;
