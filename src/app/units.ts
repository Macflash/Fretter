export function round(num: number, factor = 1000): number {
  return Math.round(num * factor) / factor;
}

export function frac(num: number, f = 8): number {
  const remainder = num - Math.floor(num);
  return Math.floor(remainder * f);
}

export function findFrac(
  num: number,
  max = 32
): { whole?: number; sup?: number; sub?: number } {
  const whole = Math.floor(num);
  const decimal = num - whole;
  if (decimal < 1 / max) return { whole };

  for (let sub = 1; sub <= max; sub *= 2) {
    const sup = frac(decimal, sub);
    const err = Math.abs(decimal - sup / sub); // % gets funky up top. Should likely just set an acceptable amount off.
    if (sup && (err < ACCPETABLE_ERROR || sub == max)) {
      return whole ? { whole, sup, sub } : { sup, sub };
    }
  }

  // if it is less than 1 of the max, then it is OK to omit.
  // FYI this shouldn't happen.
  return { whole };
}
const ACCPETABLE_ERROR = 0.05; // Very arbitrary. Slightly less than a 16th.

export function fractionString(num: number, max = 32): string {
  const { whole, sup, sub } = findFrac(num, max);
  if (!sub || !sup) return whole + "";

  const frac = `${sup}/${sub}`;
  return whole ? `${whole} ${frac}` : frac;
}
