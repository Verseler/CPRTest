import { DepthScore, TimingScore } from "./useCpr.types";

const ACCELERATION_THRESHOLD = 0.3;

export const isCompressionStarted = (prevZ: number, currentZ: number) => {
  return prevZ - currentZ > ACCELERATION_THRESHOLD;
};

export const isCompressionEnded = (prevZ: number, currentZ: number, isCompressing: boolean) => {
  return currentZ - prevZ > ACCELERATION_THRESHOLD && isCompressing;
};

export const isCompressionMissed = (previousTime: number, currentTime: number, isCompressing: boolean) => {
  const timeInSeconds = getTimeGap(previousTime, currentTime);
  const timeDecimal = Number((timeInSeconds % 1).toFixed(1));

  //if time exceed with compression rate of 0.6 and isCompressing state is false, it means the compression is missed
  return   timeDecimal === 0.6 && !isCompressing;
}

export const getTimeGap = (previousTime: number, currentTime: number) => {  
  const timeGap = currentTime - previousTime;
  const timeGapInSeconds = timeGap / 1000;   
  return timeGapInSeconds;
};

export const getLowestZ = (lowestZ: number, currentZ: number) => {  
  const lowestZValue = Math.min(lowestZ, currentZ);
  return lowestZValue;
};


export const getTimingScore = (timeGap: number) => {
    //compression rate is 0.6 milliseconds
    //if compression is performed between 0.5 and 0.7 milliseconds it is a perfect timing
    if (timeGap >= 0.5 && timeGap <= 0.7) {
      return "Perfect"
    } else if (timeGap < 0.5) {
      return "Too Early"
    } else  if(timeGap > 0.7) {
      return "Too Late"
    }

    return null;
}

export const getDepthScore = (depth: number) => {
  if (depth >= 2 && depth <= 2.5) {
    return "Perfect"
  } else if (depth < 2) {
    return "Too Shallow"
  } else  if(depth > 2.5) {
    return "Too Deep"
  }

  return null;
}

export const getOverallScore = (timingScore: TimingScore | null, depthScore: DepthScore | null) => {
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
    return "red"
  }
  else if (timingScore === "Too Late" && depthScore === "Too Deep") {
    return "red"
  }
  else if (timingScore === "Too Late" && depthScore === "Too Shallow") {
    return "yellow"
  }
  else if(timingScore === "Missed") {
    return "red"
  }

  return "gray";
}