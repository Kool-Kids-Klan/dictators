import React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useRecoilValue } from 'recoil';
import ExitButton from '../ExitButton';
import { gameState } from '../../store/atoms';

const GameMenu = () => {
  const { isOver, winner } = useRecoilValue(gameState);

  const surrender = () => {
    // TODO
  };

  const first = (isOver) ? (
    <span>
      And the winner is:&nbsp;
      {winner}
    </span>
  ) : (
    <button className="surrender-btn" type="button" onClick={surrender}>Surrender</button>
  );

  return (
    <>
      <div className="game__menu">
        <ButtonGroup vertical>
          {first}
          <ExitButton />
        </ButtonGroup>
      </div>
      <div className="secret" />
    </>
  );
};

export default GameMenu;
