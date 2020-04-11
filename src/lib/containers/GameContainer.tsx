import React, { useState, useEffect } from 'react';
import useWindowDimensions from '../hooks/useWindowDimension';
import useInterval from '../hooks/useInterval';

import getRandomInt from '../utils/getRandomInt';

import Game from '../components/game/Game';

import { GameStatus } from '../enums/GameStatus';
import { Move } from '../enums/Move';

import {
  LEVELS,
  APPLE_VALUE,
  SNAKE_GRID_SIZES,
  NB_OF_COLUMNS,
} from '../constants';

const INITIAL_SNAKE = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
];

const GameContainer = () => {
  const [applePosition, changeApplePosition] = useState({ x: 12, y: 12 });
  const [parts, changeParts] = useState(INITIAL_SNAKE);
  const [moveDirection, changeMoveDirection] = useState(Move.Right);
  const [difficulty, changeDifficulty] = useState(LEVELS[0].speed);
  const [status, changeStatus] = useState(GameStatus.NotRunning);
  const [score, changeScore] = useState(0);
  const [gameBoardWidth, changeGameBoardWidth] = useState(350);
  const [startBtnText, changeStartBtnText] = useState(
    'Start ' + String.fromCharCode(9658)
  );
  const [isStartOverlayVisible, toggleStartOverlay] = useState(true);

  const { width } = useWindowDimensions();

  const getAppleRandomPosition = () => {
    const x = getRandomInt(0, NB_OF_COLUMNS - 1);
    const y = getRandomInt(0, NB_OF_COLUMNS - 1);

    return { x, y };
  };

  const hasAppleCollisionWithSnake = (newApple: { x: number; y: number }) => {
    return (
      parts.findIndex(
        (part) => part.y === newApple.y && part.x === newApple.x
      ) !== -1
    );
  };

  const generateNewApple = () => {
    let newApplePosition = getAppleRandomPosition();

    while (hasAppleCollisionWithSnake(newApplePosition)) {
      newApplePosition = getAppleRandomPosition();
    }

    changeApplePosition(() => newApplePosition);
  };

  const moveSnake = () => {
    changeParts((prevParts) => {
      const newSnake = [...prevParts];
      const initialHeadX = newSnake[newSnake.length - 1].x;
      const initialHeadY = newSnake[newSnake.length - 1].y;

      let newHeadX = initialHeadX;
      let newHeadY = initialHeadY;

      switch (moveDirection) {
        case Move.Right: {
          newHeadX++;
          break;
        }
        case Move.Left: {
          newHeadX--;
          break;
        }
        case Move.Top: {
          newHeadY++;
          break;
        }
        case Move.Bottom: {
          newHeadY--;
          break;
        }
      }

      if (newHeadX >= NB_OF_COLUMNS - 1) {
        newHeadX = 0;
      }

      if (newHeadX < 0) {
        newHeadX = NB_OF_COLUMNS - 2;
      }

      if (newHeadY >= NB_OF_COLUMNS - 1) {
        newHeadY = 0;
      }

      if (newHeadY < 0) {
        newHeadY = NB_OF_COLUMNS - 2;
      }

      newSnake.push({ x: newHeadX, y: newHeadY });
      newSnake.shift();

      return newSnake;
    });
  };

  const checkCollision = () => {
    const head = parts[parts.length - 1];
    const body = [...parts];
    body.pop();

    return (
      body.findIndex((part) => part.y === head.y && part.x === head.x) !== -1
    );
  };

  const increaseScore = () => {
    changeScore((prevScore) => (prevScore += APPLE_VALUE));

    if (score === 400) {
      //this.displayRoundEnd(1);
      //this.pause();
    } else if (score === 800) {
      //this.displayRoundEnd(2);
      //this.pause();
    } else if (score === 1200) {
      //this.displayRoundEnd(3);
      //this.pause();
    }

    const level = LEVELS.find((lvl) => lvl.score === score);

    if (level !== undefined) {
      changeDifficulty(level.speed);
    }
  };

  const snakeEatsApple = () => {
    const canSnakeEatsApple =
      applePosition.x === parts[parts.length - 1].x &&
      applePosition.y === parts[parts.length - 1].y;

    if (canSnakeEatsApple) {
      // Make snake grow 1 part by copying his tail
      changeParts((prevParts) => {
        const newParts = [...prevParts];
        newParts.unshift({ ...prevParts[0] });

        return newParts;
      });

      increaseScore();
      generateNewApple();
    }
  };

  const computeNextStep = () => {
    if (status !== GameStatus.Running) {
      return;
    }

    moveSnake();

    if (checkCollision()) {
      changeStatus(GameStatus.Lost);
      changeStartBtnText('Retry ?');
      toggleStartOverlay(true);
      return;
    }

    snakeEatsApple();
  };

  const updateMoveDirection = (key: string) => {
    switch (key) {
      case 'ArrowUp':
        if (moveDirection === Move.Bottom) {
          break;
        }
        changeMoveDirection(Move.Top);
        break;
      case 'ArrowDown':
        if (moveDirection === Move.Top) {
          break;
        }
        changeMoveDirection(Move.Bottom);
        break;
      case 'ArrowLeft':
        if (moveDirection === Move.Right) {
          break;
        }
        changeMoveDirection(Move.Left);
        break;
      case 'ArrowRight':
        if (moveDirection === Move.Left) {
          break;
        }
        changeMoveDirection(Move.Right);
        break;
      default:
        break;
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    updateMoveDirection(event.key);
  };

  const start = () => {
    changeStatus(GameStatus.Running);
    toggleStartOverlay(false);
  };

  const reinit = () => {
    changeParts(INITIAL_SNAKE);
    generateNewApple();
    changeMoveDirection(Move.Right);
    changeDifficulty(LEVELS[0].speed);
    changeStatus(GameStatus.NotRunning);
    changeScore(0);
  };

  const handleStartClick = () => {
    if (status === GameStatus.NotRunning) {
      start();
    } else if (status === GameStatus.Lost) {
      reinit();
      start();
    }
  };

  const handlePauseClick = () => {
    if (status === GameStatus.Lost) {
      return;
    }

    changeStatus(GameStatus.NotRunning);
    changeStartBtnText('Continue ' + String.fromCharCode(9658));
    toggleStartOverlay(true);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });

  useEffect(() => {
    if (width) {
      if (width > 992) {
        changeGameBoardWidth(SNAKE_GRID_SIZES.desktop);
      } else if (width > 576) {
        changeGameBoardWidth(SNAKE_GRID_SIZES.tablet);
      } else {
        changeGameBoardWidth(SNAKE_GRID_SIZES.mobile);
      }
    }
  }, [width]);

  useInterval(computeNextStep, difficulty);

  return (
    <Game
      handlePauseClick={handlePauseClick}
      handleStartClick={handleStartClick}
      isStartOverlayVisible={isStartOverlayVisible}
      gameBoardWidth={gameBoardWidth}
      snakeParts={parts}
      applePosition={applePosition}
      startBtnText={startBtnText}
      score={score}
    />
  );
};

export default GameContainer;
