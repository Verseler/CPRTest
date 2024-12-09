const COMPRESSION_THRESHOLD = 1.15;
const GRAVITY = 9.81; // Gravity constant in m/s^2
const TIME_INTERVAL = 0.01667; // 60Hz = 16.67ms
const INCHES_PER_METER = 39.3701;
const CALIBRATION_FACTOR = 28.5; // Adjust based on real-world testing

export function calculateDepth(z) {
  const verticalAcceleration = Math.abs(z - GRAVITY);

  // Convert acceleration to displacement (depth)
  // depth = (1/2) * acceleration * (time^2), where time is approximated per sensor update
  const depth = 0.5 * (verticalAcceleration * z) * Math.pow(TIME_INTERVAL, 2);
  console.log("d: ", depth * INCHES_PER_METER * CALIBRATION_FACTOR);
  return (depth * INCHES_PER_METER * CALIBRATION_FACTOR).toFixed(2);
}

export function isCompression(magnitude, lastCompressionTime) {
  const now = Date.now();

  return (
    magnitude > COMPRESSION_THRESHOLD &&
    (!lastCompressionTime || now - lastCompressionTime > 300) // Prevent double-counting
  );
}

export function calculateMagnitude({ x, y, z }) {
  return Math.sqrt(x * x + y * y + z * z).toFixed(2);
}

export function getDepthScore(depth) {
  if (depth > 2.5) {
    return "Too Deep";
  } else if (depth < 2) {
    return "Too Shallow";
  } else {
    return "Perfect";
  }
}
