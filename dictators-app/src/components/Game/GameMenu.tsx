import React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useRecoilValue } from 'recoil';
import ExitButton from '../ExitButton';
import { appState, gameState } from '../../store/atoms';
import { currentGameSocket } from '../../store/selectors';

const GameMenu = () => {
  const { username } = useRecoilValue(appState);
  const { isOver, winner } = useRecoilValue(gameState);
  const gameSocket = useRecoilValue(currentGameSocket);

  const surrender = () => {
    const data = {
      event: 'SURRENDER',
      message: username,
    };
    gameSocket.send(JSON.stringify(data));
  };

  const first = (isOver) ? (
    <span>
      And the winner is:&nbsp;
      {winner}
    </span>
  ) : (
    <Button type="button" onClick={surrender}>Surrender</Button>
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
