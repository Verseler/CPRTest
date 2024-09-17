const ACCELERATION_THRESHOLD = 0.3;

export const isCompressionPerformed = (prevZ, currentZ) => {
  return prevZ - currentZ > ACCELERATION_THRESHOLD;
};

export const isCompressionEnded = (prevZ, currentZ, isCompressing) => {
  return currentZ - prevZ > ACCELERATION_THRESHOLD && isCompressing;
};

export const getAcceleration = (currentZ, previousZ, deltaT) => {
  return ((currentZ - previousZ) / deltaT).toFixed(2);
};

export const getDeltaTime = (previousTime, currentTime) => {
  return previousTime ? (currentTime - previousTime) / 1000 : 0;
};

export const getLowestZ = (lowestZ, currentZ) => {
  return lowestZ === null ? currentZ : Math.min(lowestZ, currentZ);
};
