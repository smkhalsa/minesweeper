import React from "react";

import { Board, Block, bootstrapBoard, adjacentBlocks } from "./helpers";

const revealAdjacent = (block: Block, board: Board) => {
  const adjacent = adjacentBlocks(block, board);
  if (adjacent.filter(block => block.isFlagged).length < block.numAdjacentBombs)
    return;
  const hidden = adjacent.filter(block => !block.isFlagged && !block.isVisible);
  if (!hidden.length) return;
  hidden.forEach(block => (block.isVisible = true));
  hidden
    .filter(block => !block.isBomb && block.numAdjacentBombs === 0)
    .forEach(block => revealAdjacent(block, board));
};

export const boardReducer: React.Reducer<Board, any> = (state, action) => {
  switch (action.type) {
    case "click": {
      const newState = [...state];
      const {
        rowIndex,
        colIndex,
        isVisible,
        numAdjacentBombs,
        isBomb,
        isFlagged
      } = action.block;
      if (isVisible) {
        revealAdjacent(action.block, newState);
        return newState;
      } else {
        newState[rowIndex][colIndex].isVisible = true;
        if (!isBomb && !isFlagged && numAdjacentBombs === 0)
          revealAdjacent(action.block, newState);
        return newState;
      }
    }
    case "long click": {
      const newState = [...state];
      const { rowIndex, colIndex, isVisible } = action.block;
      if (isVisible) {
        revealAdjacent(action.block, newState);
        return newState;
      } else {
        newState[rowIndex][colIndex].isFlagged = !newState[rowIndex][colIndex]
          .isFlagged;
        return newState;
      }
    }
    case "reset": {
      return bootstrapBoard(
        action.numRows,
        action.numCols,
        action.bombProbability
      );
    }
    case "reveal all": {
      return state.map(row =>
        row.map(block => {
          block.isVisible = true;
          return block;
        })
      );
    }
    default:
      throw new Error(`Action not recognized \n${JSON.stringify(action)}`);
  }
};
