export enum GameState {
  Playing,
  Won,
  Lost
}

export interface Block {
  isBomb: boolean;
  isVisible: boolean;
  isFlagged: boolean;
  rowIndex: number;
  colIndex: number;
  numAdjacentBombs: number;
}
export interface Board extends Array<Array<Block>> {}

export const adjacentBlocks = (block: Block, board: Board): Block[] => {
  const numRows = board.length;
  const numCols = board[0].length;
  const minRow = Math.max(block.rowIndex - 1, 0);
  const maxRow = Math.min(block.rowIndex + 2, numRows);
  const minCol = Math.max(block.colIndex - 1, 0);
  const maxCol = Math.min(block.colIndex + 2, numCols);
  return board
    .slice(minRow, maxRow)
    .reduce((rows, row) => rows.concat(row.slice(minCol, maxCol)), [])
    .filter(current => current !== block);
};

export const bootstrapBoard = (
  numRows: number,
  numCols: number,
  bombProbability: number
): Board => {
  const board: Board = [...Array(numRows)].map((row, rowIndex) =>
    [...Array(numCols)].map((item, colIndex) => ({
      isVisible: false,
      isFlagged: false,
      isBomb: !!Math.floor(Math.random() + bombProbability),
      rowIndex,
      colIndex,
      numAdjacentBombs: 0
    }))
  );
  return board.map(row =>
    row.map(block => {
      block.numAdjacentBombs = adjacentBlocks(block, board).filter(
        block => block.isBomb
      ).length;
      return block;
    })
  );
};
