export function interpolate({
  input,
  maxIn,
  minOut,
  maxOut,
}: {
  input: number;
  maxIn: number;
  minOut: number;
  maxOut: number;
}) {
  return minOut + (input * (maxOut - minOut)) / maxIn;
}
