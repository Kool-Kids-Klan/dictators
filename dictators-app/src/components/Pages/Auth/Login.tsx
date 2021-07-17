import React, { FormEvent, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import './Auth.css';
import { useRecoilState } from 'recoil';
import { appState } from '../../../store/atoms';
import LoaderButton from '../../LoaderButton';
import sha256 from '../../../utils/crypting';

const Login = () => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setAppState] = useRecoilState(appState);

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const authenticate = async () => {
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        username,
        password_hash: sha256(password),
        password_salt: 'sample_salt',
      }),
    };
    const x = await fetch('http://localhost:8000/api/user/authenticate', reqOptions);
    return x.status === 200;
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);
    if (await authenticate()) {
      setAppState({ authenticated: true, username });
      const DAY7 = 1000 * 60 * 60 * 24 * 7;
      document.cookie = `username=${username}; expires=${new Date(new Date().getTime() + DAY7)}`;
      history.push('/confirm');
    } else {
      alert('invalid');
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <LoaderButton block type="submit" isLoading={isLoading} disabled={!validateForm()}>
          Login
        </LoaderButton>
      </Form>
    </div>
  );
};

export default Login;
