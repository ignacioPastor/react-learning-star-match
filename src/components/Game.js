import React, { useState, useEffect } from 'react';
import { GameStatus, NumberStatus, utils } from './../utils';
import PlayNumber from './PlayNumber';
import PlayAgain from './PlayAgain';
import StarsDisplay from './StarsDisplay';


const Game = (props) => {
  const { stars, availableNums, candidateNums, secondsLeft, setGameState } = useGameState();

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = availableNums.length === 0
    ? GameStatus.Won
    : secondsLeft === 0 ? GameStatus.Lost : GameStatus.Active

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return NumberStatus.Used;
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? NumberStatus.Wrong : NumberStatus.Candidate;
    }
    return NumberStatus.Available;
  };

  const onNumberClick = (number, currentStatus) => {
    if (gameStatus !== GameStatus.Active || currentStatus === NumberStatus.Used) {
      return;
    }
    const newCandidateNums =
      currentStatus === NumberStatus.Available
      ? candidateNums.concat(number)
      : candidateNums.filter(cn => cn !== number);

    setGameState(newCandidateNums);
  };
  
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== GameStatus.Active ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
          ) : (
            <StarsDisplay count={stars}/>
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number => 
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// Custom Hook
const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);;
    }
  });

  const setGameState = (newCandidateNums) => {
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }
  return { stars, availableNums, candidateNums, secondsLeft, setGameState };
}

export default Game;