import Form from 'react-bootstrap/Form';
import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Auth.css';
import LoaderButton from '../../LoaderButton';

const Register = () => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function validateForm() {
    return email.length > 0 && username.length > 0 && password.length > 0;
  }

  const registerUser = async () => {
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password_hash: password,
        password_salt: 'sample_salt',
        email_address: email,
      }),
    };
    const x = await fetch('localhost:8000/api/user/create', reqOptions);
    console.log(x);
    const response = await x.json();
    console.log(response);
    return response.code === 200;
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);
    if (!await registerUser()) {
      alert('Invalid');
      return;
    }

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
          Sign up
        </LoaderButton>
      </Form>
    </div>
  );
};

export default Register;
