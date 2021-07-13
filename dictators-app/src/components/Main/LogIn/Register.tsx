import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { usersState } from '../../../store/atoms';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useRecoilState(usersState);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setUsers([...users, { email, password }]);
  }

  return (
    <div className="Register">
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
          Sign up
        </Button>
      </Form>
    </div>
  );
};

export default Register;
