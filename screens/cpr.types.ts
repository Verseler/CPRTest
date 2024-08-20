import { type TimingScore, type Score } from "../hooks/useCpr.types";

export enum Color  {
  black = "#000000",   
  white = "#FFFFFF",  
  gray = "gray",   
  yellow = "#F59E0B",  
  green = "#22C55E", 
  red = "#DC2626",   
};

export type ScoreProps = {
  score: Score | null
}

export type ScoringBarProps = ScoreProps;

export type DepthScoreUIProps = ScoreProps;

export type TimingScoreUIProps = {
  score: TimingScore | null
}