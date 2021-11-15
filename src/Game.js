import { useState, useEffect } from "react";
import Board from "./components/board/Board";
import Info from "./components/info/Info";
import "./Game.css";
// let notAllowed = [];

const Game = () => {
  const marblesArray = Array(100)
    .fill("")
    .map((marble, index) => {
      const row = Math.floor(index / 10);
      const col = index % 10;
      if (row % 2 === 0 && col % 2 === 0 && index < 40) {
        return {
          marble: "O",
          position: index,
          color: "black",
          direction: "down",
          row,
          col,
        };
      } else if (row % 2 === 1 && col % 2 === 1 && index < 40) {
        return {
          marble: "O",
          position: index,
          color: "black",
          direction: "down",
          row,
          col,
        };
      } else if (row % 2 === 0 && col % 2 === 0 && index > 59) {
        return {
          marble: "O",
          position: index,
          color: "white",
          direction: "up",
          row,
          col,
        };
      } else if (row % 2 === 1 && col % 2 === 1 && index > 59) {
        return {
          marble: "O",
          position: index,
          color: "white",
          direction: "up",
          row,
          col,
        };
      }
      return { marble, position: index, color: "", direction: "", row, col };
    });
  const [marbles, setMarbles] = useState(marblesArray);
  const [isBlackTurn, setIsBlackTurn] = useState(false);
  const [isMarbleSel, setIsMarbleSel] = useState(false);
  const [selMarble, setSelMarble] = useState({});
  const [highlightPos, setHighlightPos] = useState([]);
  const [restrictMove, setRestrictMove] = useState({
    ans: false,
    value: [],
    possSelection: [],
  });
  const [countMoves, setCountMoves] = useState(0);
  const [clickedMarble, setClickedMarble] = useState(-1);
  const [carryOutChopping, setCarryOutChopping] = useState(false);
  // setMarbles([])
  // console.log(marbles);

  useEffect(() => {
    // console.log(countMoves);
    if (countMoves < 2) return;
    // console.log(countMoves);

    console.log("check for possible chopping");
    checkForChopping();
  }, [countMoves]);

  useEffect(() => {
    if (restrictMove.ans) {
      if (restrictMove.value.includes(clickedMarble)) {
        // console.log(marbles);
        handleMove(selMarble, marbles[clickedMarble]);
        // console.log(marbles);
      }
      // return;
    }
  }, [clickedMarble]);

  useEffect(() => {
    if (restrictMove.ans) {
      // console.log(marbles);
      removeMarble(selMarble.position, marbles[clickedMarble].position);
      setCountMoves(countMoves + 1);
    }
  }, [marbles]);

  const handleClick = (i) => {
    // notAllowed.push(i);
    // console.log(notAllowed);
    // console.log(checkIfAllowed(i));

    //Disable all movement
    if (restrictMove.ans) {
      if (restrictMove.possSelection.includes(i) && !isMarbleSel) {
        setHighlightPos([i]);
        setSelMarble(marbles[i]);
        setIsMarbleSel(true);
        return;
        // setClickedMarble(i);
        // console.log(marbles);
        // handleMove(selMarble, marbles[i]);
        // console.log(marbles);
        // removeMarble(selMarble.position, marbles[clickedMarble].position);
      } else if (restrictMove.value.includes(i) && isMarbleSel) {
        setClickedMarble(i);
        return;
      }
    }

    // Rule to prevent selecting light square
    if (!checkIfAllowed(i)) {
      return;
    }

    //Rule to prevent selecting squares with no marbles
    if (!isMarbleSel && marbles[i].marble === "") return;

    // Rule to make sure it is marble's turn
    if (isBlackTurn && marbles[i].color === "white") {
      return;
    } else if (!isBlackTurn && marbles[i].color === "black") {
      return;
    }

    setHighlightPos([i]);
    if (isMarbleSel) {
      // console.log(selMarble.row, marbles[i].row);
      // console.log(selMarble.col, marbles[i].col);

      if (selMarble.color === marbles[i].color) {
        setIsMarbleSel(true);
        setSelMarble(marbles[i]);
        return;
      }
      if (
        preventBackwardsMove(selMarble, marbles[i]) &&
        preventJumpingMove(selMarble, marbles[i])
      ) {
        handleMove(selMarble, marbles[i]);
        // console.log(countMoves.length);
        // const newPosToCheck = countMoves.slice();
        // newPosToCheck.push(i);
        // setCountMoves(newPosToCheck);
        // if (countMoves.length < 1) return;
        // checkForChopping(
        //   marbles,
        //   !isBlackTurn,
        //   newPosToCheck,
        //   setHighlightPos,
        //   setRestrictMove,
        //   setSelMarble
        // );

        return;
      } else {
        setHighlightPos([selMarble.position]);
        setIsMarbleSel(true);
        setSelMarble(selMarble);
        return;
      }
    }
    setIsMarbleSel(true);
    setSelMarble(marbles[i]);
  };

  const checkForChopping = () => {
    // const possibleChop = [];
    const blackOrWhite = isBlackTurn ? "black" : "white";
    // console.log(countMoves.length);
    // const currentMarPos = countMoves[countMoves.length - 2];
    // console.log(currentMarPos);
    // const diagonals = [];
    const possiblePos = [];
    marbles.map((marble) => {
      // console.log(marble);
      if (marble.color === blackOrWhite) {
        possiblePos.push(marble.position);
      }
      return null;
    });
    console.log(possiblePos);
    // console.log(countMoves);
    const neighbors = [];
    const posForChop = [];
    possiblePos.map((position) => {
      const diagonal = getDiagonals(position);
      console.log(diagonal);
      const neighbor = getNeighbors(diagonal, position);
      console.log(neighbor);
      const isTrue = neighbor.some((element) => {
        return (
          marbles[element].color !== "" &&
          marbles[position].color !== marbles[element].color
        );
      });
      console.log(isTrue);
      if (isTrue) {
        neighbors.push(neighbor);
        posForChop.push(position);
      }
      // console.log(neighbors);
      return null;
    });
    console.log(neighbors);
    console.log(posForChop);

    const possibleChop = [];
    const possSelection = [];
    for (let i = 0; i < posForChop.length; i++) {
      neighbors.map((neighbor) => {
        neighbor.map((element) => {
          // console.log(marbles[element].color);
          if (
            marbles[element].color !== "" &&
            marbles[element].color !== marbles[posForChop[i]].color
          ) {
            const diff = posForChop[i] - element;
            const posToCheck = element - diff;
            if (marbles[posToCheck].color === "") {
              possibleChop.push(posToCheck);
              possSelection.push(posForChop[i]);
              setRestrictMove({
                ans: true,
                value: possibleChop,
                possSelection,
              });
              setIsMarbleSel(false);
            }
          }
        });

        return null;
      });
    }

    console.log(possibleChop, possSelection);
    // if (possibleChop.length > 0) {
    //   possibleChop.push()
    // }
    setHighlightPos(possibleChop);
  };

  const removeMarble = (position, newPosition) => {
    // console.log(position, newPosition);
    const difference = (position - newPosition) / 2;
    const posToRemove = position - difference;
    // console.log(posToRemove);
    const newMarbles = marbles.slice();
    // console.log(newMarbles[position]);
    newMarbles[posToRemove] = {
      marble: "",
      position: posToRemove,
      color: "",
      direction: "",
      row: Math.floor(posToRemove / 10),
      col: posToRemove % 10,
    };
    // console.log(newMarbles[position]);
    setRestrictMove({
      ans: false,
      value: [],
      possSelection: [],
    });
    setMarbles(newMarbles);
  };

  const handleMove = (selMarble, newMarble) => {
    // console.log(selMarble, newMarble);
    const newMarbles = marbles.slice();
    newMarbles[selMarble.position] = {
      ...newMarble,
      position: selMarble.position,
      row: selMarble.row,
      col: selMarble.col,
    };
    newMarbles[newMarble.position] = {
      ...selMarble,
      position: newMarble.position,
      row: newMarble.row,
      col: newMarble.col,
    };
    if (!restrictMove.ans) {
      // const newPosToCheck = countMoves.slice();
      // newPosToCheck.push(newMarble.position);
      // console.log(newPosToCheck);
      setCountMoves(countMoves + 1);
    }

    setMarbles(newMarbles);

    setIsMarbleSel(false);
    setIsBlackTurn(!isBlackTurn);
    setHighlightPos([]);
  };

  const status = (isBlackTurn ? "Black" : "White") + " turn";
  return (
    <div className="game">
      <div className="game-board">
        <Board
          marbles={marbles}
          onClick={(i) => handleClick(i)}
          highlightPos={highlightPos}
        />
      </div>
      <div className="game-info">
        <Info status={status} />
      </div>
    </div>
  );
};

const checkIfAllowed = (position) => {
  const notAllowed = [
    1, 3, 5, 7, 9, 10, 12, 14, 16, 18, 21, 23, 25, 27, 29, 30, 32, 34, 36, 38,
    41, 43, 45, 47, 49, 50, 52, 54, 56, 58, 61, 63, 65, 67, 69, 70, 72, 74, 76,
    78, 81, 83, 85, 87, 89, 90, 92, 94, 96, 98,
  ];
  const some = notAllowed.some((element) => {
    return element === position;
  });

  return !some;
};

// Rule to prevent moving marble backwards
const preventBackwardsMove = (marblePos, marbleNewPos) => {
  if (
    (marblePos.direction === "down" &&
      marblePos.position < marbleNewPos.position) ||
    (marblePos.direction === "up" && marblePos.position > marbleNewPos.position)
  ) {
    return true;
  } else {
    return false;
  }
};

// Rule to prevent jumping
const preventJumpingMove = (marble, newMarble) => {
  if (
    (marble.color === "white" &&
      marble.row === newMarble.row + 1 &&
      newMarble.col + 1 === marble.col) ||
    newMarble.col - 1 === marble.col
  ) {
    return true;
  } else if (
    (marble.color === "black" &&
      marble.row === newMarble.row - 1 &&
      newMarble.col + 1 === marble.col) ||
    newMarble.col - 1 === marble.col
  ) {
    return true;
  } else {
    return false;
  }
};

const getNeighbors = (diagonals, position) => {
  const neighbors = [];
  // console.log(diagonals);
  const firstIndex = diagonals[0].findIndex((element) => {
    return element === position;
  });
  if (firstIndex > 0) {
    neighbors.push(diagonals[0][firstIndex - 1]);
  }
  if (firstIndex < diagonals[0].length - 1) {
    neighbors.push(diagonals[0][firstIndex + 1]);
  }
  if (diagonals.length > 1) {
    const secondIndex = diagonals[1].findIndex((element) => {
      return element === position;
    });
    if (secondIndex > 0) {
      neighbors.push(diagonals[1][secondIndex - 1]);
    }
    if (secondIndex < diagonals[1].length - 1) {
      neighbors.push(diagonals[1][secondIndex + 1]);
    }
  }

  return neighbors;
};

const getDiagonals = (position) => {
  const diagonals = {
    left: [
      [2, 11, 20],
      [4, 13, 22, 31, 40],
      [6, 15, 24, 33, 42, 51, 60],
      [8, 17, 26, 35, 44, 53, 62, 71, 80],
      [19, 28, 37, 46, 55, 64, 73, 82, 91],
      [39, 48, 57, 66, 75, 84, 93],
      [59, 68, 77, 86, 95],
      [79, 88, 97],
    ],
    right: [
      [93, 82, 71, 60],
      [95, 84, 73, 62, 51, 40],
      [97, 86, 75, 64, 53, 42, 31, 20],
      [99, 88, 77, 66, 55, 44, 33, 22, 11, 0],
      [79, 68, 57, 46, 35, 24, 13, 2],
      [59, 48, 37, 26, 15, 4],
      [39, 28, 17, 6],
    ],
  };

  const newDiagonals = [];
  diagonals.left.some((diagonal) => {
    if (diagonal.includes(position)) {
      newDiagonals.push(diagonal);
      // newDiagonals.
      return null;
    }
    return null;
  });

  diagonals.right.some((diagonal) => {
    if (diagonal.includes(position)) {
      newDiagonals.push(diagonal);
      return null;
    }
    return null;
  });
  // console.log(newDiagonals);

  return newDiagonals;
};

export default Game;
