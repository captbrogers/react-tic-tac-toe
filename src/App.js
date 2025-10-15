import {useState} from 'react';

const audioStream = new Audio('./celebration.mp3');

function Square({ id, value, onSquareClick, isWinningSquare }) {
  return (
    <button id={id} className={`square ${isWinningSquare ? 'winner' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner[3];
    audioStream.play();
    setInterval(() => {
      // next up, animate the green background to toggle on and off
    }, 1000);
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square id={'0'} value={squares[0]} onSquareClick={() => handleClick(0)} isWinningSquare={winner && winner.includes(0)} />
        <Square id={'1'} value={squares[1]} onSquareClick={() => handleClick(1)} isWinningSquare={winner && winner.includes(1)} />
        <Square id={'2'} value={squares[2]} onSquareClick={() => handleClick(2)} isWinningSquare={winner && winner.includes(2)} />
      </div>
      <div className="board-row">
        <Square id={'3'} value={squares[3]} onSquareClick={() => handleClick(3)} isWinningSquare={winner && winner.includes(3)} />
        <Square id={'4'} value={squares[4]} onSquareClick={() => handleClick(4)} isWinningSquare={winner && winner.includes(4)} />
        <Square id={'5'} value={squares[5]} onSquareClick={() => handleClick(5)} isWinningSquare={winner && winner.includes(5)} />
      </div>
      <div className="board-row">
        <Square id={'6'} value={squares[6]} onSquareClick={() => handleClick(6)} isWinningSquare={winner && winner.includes(6)} />
        <Square id={'7'} value={squares[7]} onSquareClick={() => handleClick(7)} isWinningSquare={winner && winner.includes(7)} />
        <Square id={'8'} value={squares[8]} onSquareClick={() => handleClick(8)} isWinningSquare={winner && winner.includes(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    if (nextMove === 0) {
      audioStream.pause();
      audioStream.currentTime = 0;
    }
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c, squares[a]];
    }
  }
  return null;
}
