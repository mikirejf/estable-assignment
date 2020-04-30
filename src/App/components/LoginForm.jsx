import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import endpoints from 'utils/endpoints';
import { storeAuthTokens } from 'utils/authTokens';
import useAsync from 'hooks/useAsync';
import { useGlobalState } from 'App/GlobalStateProvider';
import Spinner from './Spinner';

const Container = styled.form`
  width: 500px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-family: sans-serif;
`;

const Input = styled.input`
  display: block;
  width: 300px;
  height: 60px;
  padding: 10px;
  font-weight: 500;
  border: 2px solid #8474a2;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 250px;
  height: 60px;
  padding: 20px;
  font-weight: 600;
  border: 2px solid #b9a64b;
  border-radius: 1px;
  background-color: #efb44a;
  box-shadow: 0px 10px 63px -32px rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

export default function LoginForm() {
  const { dispatch } = useGlobalState();
  const { state, send } = useAsync({
    method: 'POST',
    url: endpoints.login,
    headers: { 'content-type': 'application/json' },
  });
  const [email, setEmail] = useState('andrej.premrn@gmail.com');
  const [password, setPassword] = useState('preAnd04');

  const handleSubmit = (e) => {
    e.preventDefault();
    send({ email, password });
  };

  useEffect(() => {
    if (state.response) {
      storeAuthTokens(state.response);
      dispatch({ type: 'LOGIN' });
    }
  }, [state.response, dispatch]);

  return (
    <Container onSubmit={handleSubmit}>
      <label>
        Email
        <Input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <Button type="submit" disabled={state.isLoading}>
        {state.isLoading ? <Spinner size="30px" /> : 'Login'}
      </Button>
      {state.error ? 'Something went wrong, please try again.' : null}
    </Container>
  );
}
