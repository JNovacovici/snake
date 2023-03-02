import React, { useState, useRef } from 'react';
import './App.css';
import AppleLogo from './apple.png';
import useInterval from './useInterval';

const boardX = 1000;
const boardY = 1000;
const initialSnake = [[4, 10], [4, 10]];
const initialApple = [14, 10];
const scale = 50;
const timeDelay = 100;


function App() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => runGame(), delay);

  function runGame() {
    const newSnake = [...snake];
    const newSnakeHead= [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]]
  }

  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <img src={AppleLogo} alt="snakeFood" width="30"/>
      <canvas className="playArea" ref={canvasRef} width={`${boardX}px`} height={`${boardY}px`}/>
      {gameOver && <div className="gameOver"> Game Over </div>}
      <button onClick={startGame} className="startButton"> Play </button>
      <div className ="scoreList">
        <h2>Score: {score}</h2>
        <h2>High Score: {localStorage.getItem("snakeScore")}</h2>
      </div>
    </div>
  );
}

export default App;
