import React from 'react';

import Snake from '../snake/Snake';
import Apple from '../apple/Apple';

import styles from './game.module.scss';

interface GameProps {
  handlePauseClick: () => void;
  handleStartClick: () => void;
  isStartOverlayVisible: boolean;
  gameBoardWidth: number;
  snakeParts: Array<{ x: number; y: number }>;
  applePosition: { x: number; y: number };
  startBtnText: string;
  score: number;
}

const Game = ({
  handlePauseClick,
  isStartOverlayVisible,
  handleStartClick,
  gameBoardWidth,
  snakeParts,
  applePosition,
  startBtnText,
  score,
}: GameProps) => {
  return (
    <div className={styles.game_container}>
      <div className={styles.snake_container}>
        <button className={styles.pause_button} onClick={handlePauseClick}>
          Pause
        </button>
        {isStartOverlayVisible ? (
          <div className={styles.start_overlay}>
            <button className={styles.start_button} onClick={handleStartClick}>
              {startBtnText}
            </button>
          </div>
        ) : null}

        <Snake gameBoardWidth={gameBoardWidth} parts={snakeParts} />
      </div>
      <div className={styles.score}>{score}</div>
      <Apple gameBoardWidth={gameBoardWidth} applePosition={applePosition} />
    </div>
  );
};

export default Game;
