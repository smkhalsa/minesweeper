import React, { useReducer, useMemo, useEffect } from "react";
import flatten from "lodash/flatten";

import { bootstrapBoard, GameState, adjacentBlocks } from "./helpers";
import { boardReducer } from "./reducers";
import ClickContainer from "./ClickContainer";
import smileImage from "./images/smile_small.png";
import bombImage from "./images/bomb.png";
import flagImage from "./images/flag.png";

export const colors = [
  "blue",
  "green",
  "red",
  "purple",
  "maroon",
  "turquoise",
  "black",
  "grey"
];

const numRows = 20;
const numCols = 20;
const bombProbability = 0.2;
const blockSize = 20; // in pixels

const App: React.SFC = () => {
  const [board, dispatch] = useReducer(
    boardReducer,
    bootstrapBoard(numRows, numCols, bombProbability)
  );
  const gameState: GameState = useMemo(() => {
    const blocks = flatten(board);
    if (blocks.find(block => block.isBomb && block.isVisible))
      return GameState.Lost;
    if (blocks.filter(block => !block.isBomb).every(block => block.isVisible))
      return GameState.Won;
    return GameState.Playing;
  }, [board]);
  const bombsRemaining: number = useMemo(
    () =>
      flatten(board).filter(block => block.isBomb && !block.isFlagged).length,
    [board]
  );
  useEffect(() => {
    if (gameState === GameState.Lost) {
      dispatch({ type: "reveal all" });
    }
  }, [gameState]);
  return (
    <div style={{ width: blockSize * numCols }}>
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <img
          onClick={() =>
            dispatch({ type: "reset", numRows, numCols, bombProbability })
          }
          style={{ height: 50, width: 50 }}
          src={smileImage}
        />
        <p>
          Bombs Remaining: {bombsRemaining}
          {gameState === GameState.Won && " You Won! :)"}
          {gameState === GameState.Lost && " You Lost :("}
        </p>
      </header>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {board.map((row, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((block, j) => (
              <ClickContainer
                key={`${i}, ${j}`}
                style={{
                  height: blockSize,
                  width: blockSize,
                  overflow: "hidden",
                  border: "1px solid grey",
                  backgroundColor: block.isVisible ? "lightGrey" : "silver"
                }}
                onHoldDuration={500}
                onHold={() => dispatch({ type: "long click", block })}
                onClick={() => dispatch({ type: "click", block })}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {block.isFlagged && (
                    <img
                      style={{ height: blockSize, width: blockSize }}
                      src={flagImage}
                    />
                  )}
                  {block.isVisible && block.isBomb && (
                    <img
                      style={{ height: blockSize, width: blockSize }}
                      src={bombImage}
                    />
                  )}
                  {block.isVisible && !block.isBomb && (
                    <span
                      style={{
                        fontWeight: "bold",
                        color: colors[block.numAdjacentBombs - 1]
                      }}
                    >
                      {block.numAdjacentBombs > 0 && block.numAdjacentBombs}
                    </span>
                  )}
                </div>
              </ClickContainer>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
