import { useState, useRef, useEffect } from "react";
import { Audio } from "expo-av";

const TimingAudio = require("../../assets/audio/CprTimingMusic.mp3");

const useTimingAudio = () => {
  const audioRef = useRef(new Audio.Sound());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const status = await audioRef.current.getStatusAsync();

        if (!status.isLoaded) {
          setIsLoading(true);
          await audioRef.current.loadAsync(TimingAudio);
          await audioRef.current.setIsLoopingAsync(true);
        }
      } catch (error) {
        console.error("Error loading audio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      const unloadAudio = async () => {
        try {
          const status = await audioRef.current.getStatusAsync();
          if (status.isLoaded) {
            await audioRef.current.stopAsync();
            await audioRef.current.unloadAsync();
          }
        } catch (error) {
          console.error("Error unloading audio:", error);
        }
      };

      unloadAudio();
    };
  }, []);

  const playAudio = async () => {
    try {
      const status = await audioRef.current.getStatusAsync();
      if (status.isLoaded) {
        await audioRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const pauseAudio = async () => {
    try {
      const status = await audioRef.current.getStatusAsync();
      if (status.isLoaded) {
        await audioRef.current.replayAsync(); // This will restart the audio
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error pausing audio:", error);
    }
  };

  const restartAudio = async () => {
    try {
      const status = await audioRef.current.getStatusAsync();
      if (status.isLoaded) {
        await audioRef.current.replayAsync(); // This will restart the audio
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error restarting audio:", error);
    }
  };

  return { isPlaying, isLoading, playAudio, pauseAudio, restartAudio };
};

export default useTimingAudio;
