import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useRecoilState, useRecoilValue } from 'recoil';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { connectEventState, gameSocketUrlState, lobbyState } from '../../store/atoms';
import { makeId } from '../../utils/utils';
import { connectionString } from '../../store/selectors';

const MainMenu = () => {
  const history = useHistory();

  const [, setGameSocketUrl] = useRecoilState(gameSocketUrlState);
  const [, setConnectEvent] = useRecoilState(connectEventState);
  const { id } = useRecoilValue(lobbyState);
  const [lobbyId, setLobbyId] = useState('');
  const [showLobbyInput, setShowLobbyInput] = useState(false);
  const [lobbyError, setLobbyError] = useState(false);

  const connectSocket = (event: string, url: string) => {
    setGameSocketUrl(url);
    setConnectEvent(event);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    connectSocket('JOIN_ROOM', `${connectionString}${lobbyId}/`);
    // if (id === '') {
    //   setLobbyError(true);
    //   return;
    // }
    history.push('/lobby');
  };

  return (
    <div className="menu">
      {showLobbyInput
        ? (
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <FormControl
                pattern="[A-Za-z0-9]{5,5}"
                title="Five letter lobby code alfanumeric"
                required
                className="form__input"
                placeholder="Lobby Code"
                type="text"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value)}
              />
              <Button className="join-btn" type="submit">
                Go!
              </Button>
            </InputGroup>
          </Form>
        ) : (
          <button className="menu__btn" type="button" onClick={() => { setShowLobbyInput(true); }}>Join Lobby</button>
        )}
      {lobbyError && <span className="menu__error">Error connecting to lobby...</span>}
      <LinkContainer to="/lobby">
        <button className="menu__btn" type="button" onClick={() => connectSocket('CREATE_ROOM', `${connectionString}${makeId(5)}/`)}>Create Lobby</button>
      </LinkContainer>

      <LinkContainer to="/leaderboard">
        <button className="menu__btn" type="button">Leaderboard</button>
      </LinkContainer>
    </div>
  );
};
export default MainMenu;
