import React from "react";
import logo from "./logo.png";
import "./App.css";
import { calculateFrets, middleFret } from "./app/frets";
import { Num } from "./app/fractions";
import { Input } from "./app/inputs";
import { downloadSVG, downloadCSV } from "./app/download";

const GITHUB_URL = "https://github.com/macflash/fretter";

function App() {
  const [useDecimals, setUseDecimals] = React.useState(false);
  const [useSlant, setUseSlant] = React.useState(true);

  const [topScale, setTopScale] = React.useState(24);
  const [userBotScale, setbotScale] = React.useState(26);
  const botScale = useSlant ? userBotScale : topScale;

  const [frets, setFrets] = React.useState(24);
  const relativeTops = calculateFrets(topScale, 100);
  const bottoms = calculateFrets(botScale, 100);
  const middle = useSlant ? middleFret(bottoms, frets) : -1;
  const [straightFret, setStraightFret] = React.useState(middle);
  const offset =
    straightFret >= 99
      ? botScale - topScale
      : bottoms[straightFret] - relativeTops[straightFret];
  const tops = relativeTops.map((t) => t + offset);
  const fretPositions = tops
    .filter((_, i) => i <= frets)
    .map((top, i) => ({ top, bot: bottoms[i] }));

  // Used for displaying and drawing the edge of the fret board.
  const [neckWidth, setNeckWidth] = React.useState(2.5); // 1.65 nut, 2.125 bridge

  return (
    <div className="App">
      <header className="Header">
        <img src={logo} height={32} />
        <div
          style={{
            marginRight: "auto",
            marginLeft: 10,
          }}
        >
          <a href={GITHUB_URL} target="_blank">
            Fretter
          </a>
        </div>
        <select
          onChange={(e) => {
            setUseSlant(e.currentTarget.value == "fan");
          }}
        >
          <option>fan</option>
          <option>straight</option>
        </select>
        <select
          onChange={(e) => {
            setUseDecimals(e.currentTarget.value == "decimal");
          }}
        >
          <option>fraction</option>
          <option>decimal</option>
        </select>
      </header>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        <Input name="Width" value={neckWidth} onChange={setNeckWidth} />
        <Input name="Frets" value={frets} onChange={setFrets} />
        <Input
          name={useSlant ? "High Scale" : "Scale Length"}
          value={topScale}
          onChange={setTopScale}
        />
        {useSlant ? (
          <Input name="Low Scale" value={botScale} onChange={setbotScale} />
        ) : null}

        {useSlant ? (
          <Input
            name="Straight Fret"
            value={straightFret}
            onChange={(val) => {
              setStraightFret(val);
            }}
          />
        ) : null}
      </div>

      <svg
        id="fretboard-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinyMin slice"
        version="1.1"
        viewBox={`${Math.min(offset, 0) - 1} 0 ${
          Math.max(topScale, botScale) + 2
        } ${neckWidth}`}
        style={{
          margin: "10px 0",
          minHeight: 100,
          // height: `${neckWidth}in`,
          // width: `${Math.max(topScale + offset, botScale)}in`,
        }}
      >
        {/* Fret board */}
        <path
          fill="tan"
          stroke="none"
          d={`M ${offset} 0 
          h ${tops[frets + 1] - offset} 
          L ${bottoms[frets + 1]} ${neckWidth}
          L 0 ${neckWidth} z`}
        />

        {fretPositions.map(({ top, bot }, i) => (
          <>
            {/* Dots */}
            {i % 12 == 3 || i % 12 == 5 || i % 12 == 7 || i % 12 == 9 ? (
              <circle
                key={"dot" + i}
                cx={(tops[i] + tops[i - 1] + bottoms[i] + bottoms[i - 1]) / 4}
                cy={neckWidth / 2}
                r={0.1}
                fill="black"
              />
            ) : null}
            {i !== 0 && i % 12 == 0 ? (
              <>
                <circle
                  key={"topdot" + i}
                  cx={
                    (tops[i] + tops[i - 1]) / 3 +
                    (bottoms[i] + bottoms[i - 1]) / 6
                  }
                  cy={(0.67 * neckWidth) / 2}
                  r={0.1}
                  fill="black"
                />
                <circle
                  key={"botdot" + i}
                  cx={
                    (tops[i] + tops[i - 1]) / 6 +
                    (bottoms[i] + bottoms[i - 1]) / 3
                  }
                  cy={(1.33 * neckWidth) / 2}
                  r={0.1}
                  fill="black"
                />
              </>
            ) : null}

            {/* Frets */}
            <path
              key={i}
              stroke={
                i == straightFret
                  ? "#4AF"
                  : i == 0
                  ? "white"
                  : i % 12 == 0
                  ? "grey"
                  : i == middle
                  ? "lightgrey"
                  : "grey"
              }
              strokeWidth={i == 0 ? 0.2 : 0.1}
              d={`M ${top} 0 L ${bot} ${neckWidth}`}
              onClick={() => {
                setStraightFret(i);
              }}
            >
              <title>{i ? `Fret  ${i}` : "Nut"}</title>
            </path>
          </>
        ))}
        <path
          stroke="brown"
          strokeWidth={0.2}
          d={`M ${topScale + offset} 0 L ${botScale} ${neckWidth}`}
          onClick={() => {
            setStraightFret(99);
          }}
        >
          <title>Bridge</title>
        </path>
      </svg>

      <div className="table-wrapper">
        <table className="fret-table">
          <thead>
            <tr>
              <th>Fret #</th>
              {useSlant ? (
                <>
                  <th>Low</th>
                  <th>High</th>
                </>
              ) : (
                <th>Distance</th>
              )}
            </tr>
          </thead>
          <tbody>
            {fretPositions.map(({ top, bot }, i) => (
              <tr
                key={i}
                className={i % 12 === 0 ? "mark" : ""}
                style={{ color: useSlant && top == bot ? "#4AF" : undefined }}
              >
                <td>{i ? i : "Nut"}</td>
                <td>
                  <Num num={bot} useDecimals={useDecimals} />
                </td>
                {useSlant ? (
                  <td>
                    <Num num={top} useDecimals={useDecimals} />
                  </td>
                ) : null}
              </tr>
            ))}
            <tr style={{ color: straightFret >= 99 ? "#4AF" : undefined }}>
              <th>Bridge</th>
              <td>
                <Num num={botScale} useDecimals={useDecimals} />
              </td>
              {useSlant ? (
                <td>
                  <Num num={topScale + offset} useDecimals={useDecimals} />
                </td>
              ) : null}
            </tr>
          </tbody>
        </table>
      </div>

      <footer>
        <button
          onClick={() =>
            downloadSVG("fretboard-svg", { topScale, botScale, useSlant })
          }
        >
          Download SVG
        </button>
        <button
          onClick={() =>
            downloadCSV(fretPositions, {
              useDecimals,
              useSlant,
              topScale,
              botScale,
              offset,
            })
          }
        >
          Download CSV
        </button>
      </footer>
    </div>
  );
}

export default App;
