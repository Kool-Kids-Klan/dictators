import React, { FormEvent, useState } from 'react';
import Form from 'react-bootstrap/Form';
import sha256 from 'crypto-js/sha256';
import { useHistory } from 'react-router-dom';
import './Auth.css';
import { useRecoilState } from 'recoil';
import { appState, usersState } from '../../../store/atoms';
import LoaderButton from '../../LoaderButton';

const Login = () => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setAppState] = useRecoilState(appState);
  const [users] = useRecoilState(usersState);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);
    console.log(sha256(password));
    if (users.some((user) => user.email === email && user.password === password)) {
      setAppState({ authenticated: true });
      history.push('/confirm');
    } else {
      alert('invalid');
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
