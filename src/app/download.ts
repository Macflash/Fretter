import { round, fractionString } from "./units";

export function downloadSVG(
  id: string,
  {
    topScale,
    botScale,
    useSlant,
  }: { topScale: number; botScale: number; useSlant: boolean }
) {
  const svg = document.getElementById(id);
  if (!svg) throw "Didn't find svg";
  const data = svg.outerHTML;
  download({
    data,
    filename: `fretboard-${topScale}${useSlant ? "_" + botScale : ""}.svg`,
    type: "image/svg+xml;charset=utf-8",
  });
}

export function downloadCSV(
  fretPositions: { top: number; bot: number }[],
  {
    useDecimals,
    useSlant,
    topScale,
    botScale,
    offset,
  }: {
    useDecimals: boolean;
    useSlant: boolean;
    topScale: number;
    botScale: number;
    offset: number;
  }
) {
  const format = useDecimals ? round : fractionString;
  const data =
    "Fret," +
    (useSlant ? "Low,High" : "Position") +
    "\n" +
    fretPositions
      .map(
        ({ top, bot }, i) =>
          `${i || "Nut"}${useSlant ? "," + format(bot) : ""},${format(top)}`
      )
      .join("\n") +
    "\nBridge" +
    (useSlant ? "," + botScale : "") +
    "," +
    (topScale + offset);
  download({
    data,
    filename: `frets-${topScale}${useSlant ? "_" + botScale : ""}.csv`,
    type: "data:text/csv;charset=utf-8",
  });
}

export function download({
  data,
  filename,
  type,
}: {
  data: string;
  filename: string;
  type: string;
}) {
  const blob = new Blob([data], { type });
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
