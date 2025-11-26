// calculates the speed in meters per second
/*The input data are integers as follows:
 Distance in meters
 Hours
 Minutes
 Seconds

Use the formult V = S/T where V - speed, S - distance, T - time */

const calculateSpeed = function (distanceMeters, hours, minutes, seconds) {
  const time = hours * 3600 + minutes * 60 + seconds;
  const speed = distanceMeters / time;

  console.log(`The speed in meters per seconds is: ${speed.toFixed(6)}`);
};

calculateSpeed(2500, 5, 56, 23);
