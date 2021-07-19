import Form from 'react-bootstrap/Form';
import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Auth.css';
import LoaderButton from '../../LoaderButton';
import sha256 from '../../../utils/crypting';
import { CREATE_USER_URL, reqOptions } from '../../../utils/endpoints';

const Register = () => {
  const history = useHistory();

  const [loginError, setLoginError] = useState([false, '']);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function validateForm() {
    return email.length > 0 && username.length > 0 && password.length > 0;
  }

  const registerUser = async () => {
    const body = {
      username,
      password_hash: sha256(password),
      password_salt: 'sample_salt',
      email_address: email,
    };
    return fetch(CREATE_USER_URL, reqOptions(body))
      .then((res) => res)
      .catch((error) => setLoginError([true, error]));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);
    try {
      const res = await registerUser();
      if (!res) return;
      if (res.status !== 204) {
        const { error } = await res.json();
        setLoginError([true, error]);
        return;
      }

      history.push('/confirm');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="Register Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label className="form__label">Username</Form.Label>
          <Form.Control
            className="form__input"
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label className="form__label">Email</Form.Label>
          <Form.Control
            className="form__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="form__label">Password</Form.Label>
          <Form.Control
            className="form__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <LoaderButton block type="submit" isLoading={isLoading} disabled={!validateForm()}>
          Sign up
        </LoaderButton>
        {loginError[0] && <span className="login__error-msg">{loginError[1]}</span>}
      </Form>
    </div>
  );
};

export default Register;
