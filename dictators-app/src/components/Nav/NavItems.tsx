import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';
import { appState } from '../../store/atoms';

const NavItems = () => {
  const history = useHistory();
  const [{ authenticated, username }, setAppState] = useRecoilState(appState);

  function handleLogout() {
    setAppState({ authenticated: false });
    document.cookie = 'username=';
    history.push('/confirm');
  }

  return (
    <>
      {!authenticated && (
      <LinkContainer to="/">
        <li className="navigation__item navigation__item--home">Home</li>
      </LinkContainer>
      )}
      {authenticated && <li className="navigation__username">{username}</li>}
      {authenticated ? (
        <li className="navigation__item" onClick={handleLogout}>Logout</li>
      ) : (
        <>
          <LinkContainer to="/signup">
            <li className="navigation__item">Signup</li>
          </LinkContainer>
          <LinkContainer to="/login">
            <li className="navigation__item">Login</li>
          </LinkContainer>
        </>
      )}
    </>
  );
};

export default NavItems;
