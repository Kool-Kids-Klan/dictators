import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useRecoilState } from 'recoil';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { connectEventState, gameSocketUrlState } from '../../store/atoms';
import { makeId } from '../../utils/utils';

const webSocketUrl = 'localhost:8000';
const connectionString = `ws://${webSocketUrl}/ws/play/`;

const MainMenu = () => {
  const history = useHistory();

  const [, setGameSocketUrl] = useRecoilState(gameSocketUrlState);
  const [, setConnectEvent] = useRecoilState(connectEventState);
  const [lobbyId, setLobbyId] = useState('');
  const [showLobbyInput, setShowLobbyInput] = useState(false);
  const [lobbyError, setLobbyError] = useState([false, '']);

  const connectSocket = (event: string, url: string) => {
    if (event === 'JOIN_ROOM') {
      setGameSocketUrl(url);
    }
    setConnectEvent(event);
  };

  return (
    <div className="menu">
      {showLobbyInput
        ? (
          <Form onSubmit={() => { history.push('/lobby'); connectSocket('JOIN_ROOM', `${connectionString}${lobbyId}/`); }}>
            <InputGroup className="mb-3">
              <FormControl
                pattern="[A-Za-z0-9]{5,5}"
                title="Five letter lobby code alfanumeric"
                required
                className="form__input"
                placeholder="Lobby Code"
                type="text"
              />
              <Button className="join-btn" type="submit">
                Go!
              </Button>
            </InputGroup>
          </Form>
        ) : (
          <button className="menu__btn" type="button" onClick={() => { setShowLobbyInput(true); }}>Join Lobby</button>
        )}
      {lobbyError[0] && <span className="menu__error">{lobbyError[1]}</span>}
      <LinkContainer to="/lobby">
        <button className="menu__btn" type="button" onClick={() => connectSocket('CREATE_ROOM', '')}>Create Lobby</button>
      </LinkContainer>
      <button className="menu__btn" type="button">Leaderboards</button>
    </div>
  );
};
export default MainMenu;
