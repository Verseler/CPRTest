const ACCELERATION_THRESHOLD = 0.25; // Minimum z-value to be considered compression
const INCHES_PER_METER = 39.3701;

export function isCompressionStarted(prevZ, currentZ) {
  return prevZ - currentZ > ACCELERATION_THRESHOLD;
}

export function isCompressionEnded(prevZ, currentZ, isCompressing) {
  return currentZ - prevZ > ACCELERATION_THRESHOLD && isCompressing;
}

export function calculateDistance(velocity, time) {
  //* Calibration factor is not part of the formula but it is used to tune the output
  const calibrationFactor = 1.0; //1.35

  //* KINEMATIC FORMULA: `Δd = ((v0 + v) / 2) * t`
  const distanceInMeters = (velocity / 2) * time;
  const distanceInInches =
    distanceInMeters * calibrationFactor * INCHES_PER_METER; //convert distance in meters to inches

  return distanceInInches.toFixed(2);
}
