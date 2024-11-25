import { DepthScore, OverallScore, TimingScore } from "./useCpr.types";

const ACCELERATION_THRESHOLD = 0.3;

export const isCompressionStarted = (prevZ: number, currentZ: number): boolean => {
  return prevZ - currentZ > ACCELERATION_THRESHOLD;
};

export const isCompressionEnded = (prevZ: number, currentZ: number, isCompressing: boolean): boolean => {
  return currentZ - prevZ > ACCELERATION_THRESHOLD && isCompressing;
};


export const getTimeGap = (previousTime: number, currentTime: number): number => {  
  const timeGap: number = currentTime - previousTime;
  const timeGapInSeconds: number = timeGap / 1000;   

  return timeGapInSeconds;
};

export const getLowestZ = (lowestZ: number, currentZ: number): number => {  
  const lowestZValue: number = Math.min(lowestZ, currentZ);
  return lowestZValue;
};


export const getTimingScore = (timeGap: number): TimingScore => {
    if (timeGap >= 0.3 && timeGap <= 0.7) {
      return "Perfect"
    } else if (timeGap < 0.3) {
      return "Too Early"
    } 
    else if(timeGap > 0.7) {
      return "Too Late"
    }
    console.log(3)
    return "Missed";
}

export const getDepthScore = (depth: number | null): DepthScore | null => {
  if(null === depth) return null;
 
  if (depth >= 2 && depth <= 2.5) {
    return "Perfect"
  } else if (depth < 2) {
    return "Too Shallow"
  } else  if(depth > 2.5) {
    return "Too Deep"
  }

  return null;
}

export const getOverallScore = (timingScore: TimingScore | null, depthScore: DepthScore | null): OverallScore => {
  if (timingScore === "Perfect" && depthScore === "Perfect") {
    return "green"
  } 
  else if (timingScore === "Perfect" && depthScore === "Too Shallow") {
    return "yellow"
  }
  else if(timingScore === "Perfect" && depthScore === "Too Deep") {
    return "red"
  }
  else if (timingScore === "Too Early" && depthScore === "Perfect") {
    return "yellow"
  } 
  else if(timingScore === "Too Early" && depthScore === "Too Shallow") {
    return "yellow"
  }
  else if(timingScore === "Too Early" && depthScore === "Too Deep") {
    return "red"
  }
  else if(timingScore === "Too Late" && depthScore === "Perfect") {
    return "yellow"
  }
  else if(timingScore === "Too Late" && depthScore === "Too Shallow") {
    return "yellow"
  }
  else if(timingScore === "Too Late" && depthScore === "Too Deep") {
    return "red"
  }
  else if(timingScore === "Missed") {
    return "red"
  }

  return "gray";
}

export const formatTime = (time: number): string => {
  const totalSeconds: number = Math.floor(time / 1000);
  const minutes: number = Math.floor(totalSeconds / 60);
  const seconds: number = totalSeconds % 60;

  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};