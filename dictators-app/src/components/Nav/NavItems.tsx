import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';
import { appState } from '../../store/atoms';

const NavItems = () => {
  const history = useHistory();
  const [{ authenticated }, setAppState] = useRecoilState(appState);

  function handleLogout() {
    setAppState({ authenticated: false });
    history.push('/');
  }

  if (authenticated) {
    return (
      <Navbar.Collapse className="justify-content-end">
        <Nav activeKey={window.location.pathname}>
          <LinkContainer to="/logout">
            <Nav.Link onSelect={handleLogout}>Logout</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    );
  }

  return (
    <Navbar.Collapse className="justify-content-end">
      <Nav activeKey={window.location.pathname}>
        <LinkContainer to="/signup">
          <Nav.Link>Signup</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/login">
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  );
};

export default NavItems;
