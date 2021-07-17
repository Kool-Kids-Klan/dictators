import Form from 'react-bootstrap/Form';
import React, { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';
import { usersState } from '../../../store/atoms';
import './Auth.css';
import LoaderButton from '../../LoaderButton';

const Register = () => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useRecoilState(usersState);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);
    setUsers([...users, { email, password }]);

    setIsLoading(false);
    history.push('/confirm');
  }

  return (
    <div className="Register Login">
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
          Sign up
        </LoaderButton>
      </Form>
    </div>
  );
};

export default Register;
