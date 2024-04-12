import { round, findFrac } from "./units";

export function Num({
  num,
  useDecimals,
}: {
  num: number;
  useDecimals: boolean;
}) {
  return useDecimals ? <span>{round(num, 100)}</span> : <Frac num={num} />;
}

export function Frac({ num }: { num: number }) {
  const { whole, sup, sub } = findFrac(num);
  const frac = <SupSub sup={sup} sub={sub} />;

  return whole !== undefined ? (
    <span className="whole">
      {whole} {sup && sub ? frac : null}
    </span>
  ) : (
    <span>{frac}</span>
  );
}

export function SupSub({ sup, sub }: { sup?: number; sub?: number }) {
  return (
    <>
      <sup>{sup}</sup>/<sub>{sub}</sub>
    </>
  );
}
