import React from 'react';
import styles from './snake.module.scss';

import { NB_OF_COLUMNS } from '../../constants';

interface SnakeProps {
  gameBoardWidth: number;
  parts: Array<{ x: number; y: number }>;
}

const Snake = ({ gameBoardWidth, parts }: SnakeProps) => {
  const drawOnBoard = () => {
    return parts.map((part, index) => {
      return (
        <div
          className={styles.snake_part}
          style={{
            bottom: part.y * (gameBoardWidth / NB_OF_COLUMNS + 1),
            left: part.x * (gameBoardWidth / NB_OF_COLUMNS + 1),
          }}
          key={index}
        ></div>
      );
    });
  };

  return <div>{drawOnBoard()}</div>;
};

export default Snake;
