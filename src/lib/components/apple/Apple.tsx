import React from 'react';
import styles from './apple.module.scss';

import { NB_OF_COLUMNS } from '../../constants';

interface AppleProps {
  gameBoardWidth: number;
  applePosition: { x: number; y: number };
}

const Apple = ({ gameBoardWidth, applePosition }: AppleProps) => (
  <div
    className={styles.apple}
    style={{
      bottom: applePosition.y * (gameBoardWidth / NB_OF_COLUMNS + 1),
      left: applePosition.x * (gameBoardWidth / NB_OF_COLUMNS + 1),
    }}
  ></div>
);

export default Apple;
