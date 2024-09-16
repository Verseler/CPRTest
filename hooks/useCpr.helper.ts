import { type Score, type TimingScore } from "./useCpr.types";

export const getTimingScore = (depth: number): TimingScore => {
  // if(depth === 0) return "gray";
  // else if(depth > 0 && depth < 0.2) return "red";
  if(depth < 0.2) return "red";
 
   //else depth is greater than or equal to 0.2
  return "green";
};

export const getDepthScore = (depth: number): Score => {
  if(depth === 0) return "gray";
  else if(depth >= 0 && depth < 2) return "yellow";
  else if(depth >= 2 && depth <= 2.5) return "green";

  //else depth is greater than 2.5
  return "red";
};

export const getOverallScore = (depthScore: Score, timingScore: TimingScore): Score => {
  // if(depthScore === "gray" && timingScore === "gray") return "gray";
  if(depthScore === "gray" && timingScore === "green") return "gray"; //! impossible to meet the condition
  else if(depthScore === "gray" && timingScore === "red") return "gray"; 
  // else if(depthScore === "yellow" && timingScore === "gray") return "yellow";
  // else if(depthScore === "green" && timingScore === "gray") return "yellow"; //! impossible to meet the condition
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
