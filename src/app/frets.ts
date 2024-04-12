// This is the Rule of 17.8 but not divided.
// Multiply a length by this to get the next fret position.
const FIRST_FRET = 1 - 1 / Math.pow(2, 1 / 12);

function nextFret(length: number): number {
  return length * FIRST_FRET;
}

/** @returns the distance of each fret from the nut. */
export function calculateFrets(scaleLength: number, frets = 24): number[] {
  const distances: number[] = [0];

  let remaining = scaleLength;
  for (let i = 0; i < frets; i++) {
    remaining -= nextFret(remaining);
    distances.push(scaleLength - remaining);
  }

  return distances;
}

/**
 * @returns the fret nearest the middle of the given fret positions.
 * @note this is usually a good starting location for the straight indexed fret.
 */
export function middleFret(fretPositions: number[], maxFret: number): number {
  const middle = (fretPositions[0] + fretPositions[maxFret]) / 2;
  let nearestIndex = 0;
  fretPositions.forEach((fretPosition, i) => {
    if (
      Math.abs(middle - fretPosition) <
      Math.abs(middle - fretPositions[nearestIndex])
    ) {
      nearestIndex = i;
    }
  });
  return nearestIndex;
}
