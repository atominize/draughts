import Square from "../square/Square";

const Board = (props) => {
  const renderSquare = (row, col) => {
    return (
      <Square
        key={row + col}
        value={row + col}
        row={row}
        col={col}
        marble={props.marbles[row + col]}
        highlightPos={props.highlightPos}
        onClick={() => props.onClick(row + col)}
      />
    );
  };

  return (
    <div>
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((row) => {
        return (
          <div key={row} className="board-row">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((column) => {
              return renderSquare(row, column);
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
