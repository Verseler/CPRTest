import { getOverallScore } from "../cpr.helper";
import { Score, Feedback } from "../enum";

describe("getOverallScore", () => {
  it("should return Feedback.Push when both timingScore and depthScore are Score.Perfect", () => {
    expect(getOverallScore(Score.Perfect, Score.Perfect)).toBe(Feedback.Push);
  });

  it("should return Feedback.PushHarder when timingScore is Score.Perfect and depthScore is Score.TooShallow", () => {
    expect(getOverallScore(Score.Perfect, Score.TooShallow)).toBe(
      Feedback.PushHarder
    );
  });

  it("should return Feedback.PushSoftly when timingScore is Score.Perfect and depthScore is Score.TooDeep", () => {
    expect(getOverallScore(Score.Perfect, Score.TooDeep)).toBe(
      Feedback.PushSoftly
    );
  });

  it("should return Feedback.PushSlower when timingScore is Score.TooFast and depthScore is Score.Perfect", () => {
    expect(getOverallScore(Score.TooFast, Score.Perfect)).toBe(
      Feedback.PushSlower
    );
  });

  it("should return Feedback.PushSlowerHarder when timingScore is Score.TooFast and depthScore is Score.TooShallow", () => {
    expect(getOverallScore(Score.TooFast, Score.TooShallow)).toBe(
      Feedback.PushSlowerHarder
    );
  });

  it("should return Feedback.PushSlowerSoftly when timingScore is Score.TooFast and depthScore is Score.TooDeep", () => {
    expect(getOverallScore(Score.TooFast, Score.TooDeep)).toBe(
      Feedback.PushSlowerSoftly
    );
  });

  it("should return Feedback.PushFasterHarder when timingScore is Score.Missed and depthScore is Score.TooShallow", () => {
    expect(getOverallScore(Score.Missed, Score.TooShallow)).toBe(
      Feedback.PushFasterHarder
    );
  });

  it("should return Feedback.PushFaster when timingScore is Score.Missed and depthScore is Score.Perfect", () => {
    expect(getOverallScore(Score.Missed, Score.Perfect)).toBe(
      Feedback.PushFaster
    );
  });

  it("should return Feedback.PushFasterSoftly when timingScore is Score.Missed and depthScore is Score.TooDeep", () => {
    expect(getOverallScore(Score.Missed, Score.TooDeep)).toBe(
      Feedback.PushFasterSoftly
    );
  });

  it("should return Feedback.PushFaster when both timingScore and depthScore are Score.Missed", () => {
    expect(getOverallScore(Score.Missed, Score.Missed)).toBe(
      Feedback.PushFaster
    );
  });

  it("should return Feedback.Push for any other combination", () => {
    // You can test for unexpected input or edge cases if necessary
    expect(getOverallScore(undefined, Score.Perfect)).toBe(Feedback.Push);
    expect(getOverallScore(Score.Perfect, undefined)).toBe(Feedback.Push);
  });
});
