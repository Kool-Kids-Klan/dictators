import React, { FormEvent, useState } from 'react';
import Form from 'react-bootstrap/Form';
import sha256 from 'crypto-js/sha256';
import { useHistory } from 'react-router-dom';
import './Auth.css';
import { useRecoilState } from 'recoil';
import { appState } from '../../../store/atoms';
import LoaderButton from '../../LoaderButton';

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
      },
      body: JSON.stringify({
        username: 'revolko',
        password_hash: 'sample_hash',
        password_salt: 'sample_salt',
      }),
    };
    const x = await fetch('localhost:8000/api/user/authenticate', reqOptions);
    console.log(x);
    const response = await x.json();
    console.log(response);
    return response.code === 200;
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);
    console.log(sha256(password));
    if (await authenticate()) {
      setAppState({ authenticated: true, username });
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
