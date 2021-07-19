import React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ExitButton from '../ExitButton';

const GameMenu = () => {
  const surrender = () => {
    // TODO
  };

  return (
    <>
      <div className="game__menu">
        <button className="surrender-btn" type="button" onClick={surrender}>Surrender</button>
        <ExitButton />
      </div>
      <div className="secret" />
    </>
  );
};

export default GameMenu;
