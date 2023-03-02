import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import AppleLogo from './apple.png';
import arcadeMachine from './gameboy.png';
import useInterval from './useInterval';

const boardX = 1000;
const boardY = 1000;
const initialSnake = [[4, 10], [4, 10]];
const initialApple = [14, 10];
const scale = 50;
const timeDelay = 100;


function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => runGame(), delay);

  useEffect(() => {
    let food = document.getElementById('apple') as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#73e600";
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        ctx.drawImage(food, apple[0], apple[1], 1, 1);
      }
    }
  }, [snake, apple, gameOver]);

  const startGame = () => {
    setSnake(initialSnake);
    setApple(initialApple);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setGameOver(false);
    setScore(0);
  }

  const handleSetScore = () => {
    if (score > Number(localStorage.getItem("snakeScore"))) {
      localStorage.setItem("snakeScore", JSON.stringify(score));
    }
  }

  const checkCollision = (head: number[]) => {
    for (var i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= boardX) {
        return true;
      }
    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) {
        return true;
      }
    }
    return false;
  }

  const eatApple = (newSnake: number[][]) => {
    let coord = apple.map(() => Math.floor(Math.random() * boardX / scale));
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = coord;
      setScore(score + 1);
      setApple(newApple);
      return true;
    }
    return false;
  }

  const changeDirection = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowLeft":
        setDirection([-1, 0]);
        break;
      case "ArrowRight":
        setDirection([1, 0]);
        break;
      case "ArrowUp":
        setDirection([0, -1]);
        break;
      case "ArrowDown":
        setDirection([0, 1]);
        break;
    }
  }

  const runGame = () => {
    const newSnake = [...snake];
    const newSnakeHead= [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];
    newSnake.unshift(newSnakeHead);

    if (checkCollision(newSnakeHead)) {
      setDelay(null);
      setGameOver(true);
      handleSetScore();
    }

    if(!eatApple(newSnake)) {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <img id ="apple" src={AppleLogo} alt="snakeFood" width="30"/>
      <img src={arcadeMachine} alt="arcade play area" width="400" className="arcadeMachine" />
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
