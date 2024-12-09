export function getMagnitude(accelerometerData) {
  return Math.sqrt(
    accelerometerData.x ** 2 +
      accelerometerData.y ** 2 +
      accelerometerData.z ** 2
  ).toFixed(2);
}
