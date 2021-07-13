import React, { FormEvent, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Login.css';
import { useRecoilState } from 'recoil';
import { appState, usersState } from '../../../store/atoms';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setAppState] = useRecoilState(appState);
  const [users] = useRecoilState(usersState);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (users.some((user) => user.email === email && user.password === password)) {
      setAppState({ authenticated: true });
    } else {
      alert('invalid');
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
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
