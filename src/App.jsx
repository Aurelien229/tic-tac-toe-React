import { useState } from 'react';

function Square({ value, onSquareClick }) {
  let squareClass = "square w-20 h-20 mb-2 md:mb-4 bg-transparent border-none outline-none text-2xl md:text-3xl flex items-center justify-center rounded-full p-2 bg-[#171717] shadow-[inset_2px_5px_10px_rgb(5,5,5)]";

  if (value === 'X') {
    squareClass += " text-red-500"; 
  } else if (value === 'O') {
    squareClass += " text-green-500";
  }

  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay, playerNames }) {
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
  let winnerName = '';
  let status;
  if (winner) {
    winnerName = winner === 'X' ? playerNames.player1 : playerNames.player2;
    status = <span className="text-blue-400">{winnerName} a gagné</span>;
  } else {
    status = 'Prochain tour : ' + (xIsNext ? playerNames.player1 : playerNames.player2);
  }

  return (
    <div className="text-center mb-2 md:mb-4 text-lg md:text-2xl font-bold">
      {status}
      <div className="grid grid-cols-3 gap-1 md:gap-2 justify-center">
        {squares.map((square, index) => (
          <Square key={index} value={square !== null ? square : index + 1} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
  const [playersSet, setPlayersSet] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [changePlayers, setChangePlayers] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

   
    const winner = calculateWinner(nextSquares);
    if (winner || nextSquares.every(square => square)) {
      setGameOver(true);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setGameOver(false);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Aller au coup #' + move;
    } else {
      description = 'Revenir au début';
    }
    return (
      <li key={move}>
        <button className="btn" onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const handleStartGame = () => {
    if (playerNames.player1 && playerNames.player2) {
      setPlayersSet(true);
    }
  };

  const handleNewGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setGameOver(false);
  };

  const toggleChangePlayers = () => {
    setChangePlayers(!changePlayers);
  };

  const handleResetPlayers = () => {
    setPlayerNames({ player1: '', player2: '' });
    setPlayersSet(false);
    setChangePlayers(false);
    handleNewGame();
  };

  const handlePlayerNameChange = (player, event) => {
    setPlayerNames({ ...playerNames, [player]: event.target.value });
  };

  return (
    <div className="px-5 bg-gray-800 text-violet-500 min-h-screen flex justify-center items-center">
      <div className="container mx-auto">
      
        <div className="py-4 mb-8 md:py-8 text-center text-lg md:text-6xl font-bold">Jeu de Tic Tac Toe</div>
        {!playersSet || changePlayers ? (
          <div className="flex flex-col items-center">
            <div className="mb-2 md:mb-4">
              <input type="text" id="player1" value={playerNames.player1} onChange={(e) => handlePlayerNameChange('player1', e)} className="input w-full md:w-72 mb-2 md:mb-4 bg-transparent border-none outline-none text-xl md:text-3xl flex items-center justify-center rounded-full p-2 bg-[#171717] shadow-[inset_2px_5px_10px_rgb(5,5,5)]" placeholder=" Nom du joueur X" />
            </div>
            <div className="mb-2 md:mb-4">
              <input type="text" id="player2" value={playerNames.player2} onChange={(e) => handlePlayerNameChange('player2', e)} className="input w-full md:w-72 mb-2 md:mb-4 bg-transparent border-none outline-none text-xl md:text-3xl flex items-center justify-center rounded-full  p-2 bg-[#171717] shadow-[inset_2px_5px_10px_rgb(5,5,5)]" placeholder=" Nom du joueur O" />
            </div>
            {!playersSet && (
              <button onClick={handleStartGame} className="btn  md:w-72 mt-2 md:mt-4 bg-transparent border-none outline-none text-xl md:text-3xl flex items-center justify-center rounded-full p-2 bg-[#171717] shadow-[inset_2px_5px_10px_rgb(5,5,5)]">Commencer le jeu</button>
            )}
            
          </div>
        ) : (
          <div className="flex justify-center flex-col">
            <div className="w-full  flex justify-center">
              <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} playerNames={playerNames} />
            </div>
            <div className="w-full ">
              <div className="text-center mb-2 md:mb-4 font-bold">Historique des mouvements</div>
              <ol className="text-center list-inside list-disc">{moves}</ol>
            </div>
          </div>
        )}
       <div className="flex justify-center flex-col">
  {gameOver && (
    <button onClick={handleNewGame} className="btn md:w-72 mt-2 md:mt-4 bg-transparent border-none outline-none text-xl md:text-3xl flex items-center justify-center rounded-full p-2 bg-[#171717] shadow-[inset_2px_5px_10px_rgb(5,5,5)]">Nouvelle partie</button>
  )}
  {playersSet && gameOver && (
    <button onClick={handleResetPlayers} className="btn md:w-72 mt-2 md:mt-4 bg-transparent border-none outline-none text-xl md:text-3xl flex items-center justify-center rounded-full p-2 bg-[#171717] shadow-[inset_2px_5px_10px_rgb(5,5,5)]">Changer les joueurs</button>
  )}
</div>

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
      return squares[a];
    }
  }
  return null;
}


