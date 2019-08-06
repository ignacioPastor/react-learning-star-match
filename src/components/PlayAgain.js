import React from 'react';
import { GameStatus } from './../utils';

const PlayAgain = props => (
  <div className="game-done">
    <div 
        className="message"
        style={{ color: props.gameStatus === GameStatus.Lost ? 'red' : 'green'}}
      >
      {props.gameStatus === GameStatus.Lost ? 'Game Over' : 'Nice'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

export default PlayAgain;