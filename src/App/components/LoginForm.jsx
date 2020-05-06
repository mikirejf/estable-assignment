import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';

import { storeAuthTokens } from 'utils/authTokens';
import { useGlobalState } from 'App/GlobalStateProvider';
import toast from 'utils/toast';
import useApi from 'hooks/useApi';
import Spinner from './Spinner';

const Container = styled.form`
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-family: sans-serif;
  padding: 40px 20px;
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -7px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  display: block;
  width: 300px;
  height: 60px;
  padding: 10px;
  margin-top: 2px;
  font-weight: 500;
  border: 2px solid #8474a2;
  border-radius: 4px;
`;

const Label = styled.label`
  color: #8374a2;
  font-weight: 600;
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

const StyledSpinner = styled(Spinner)`
  position: absolute;
`;

function generateErrorToastMessage(errorMessage) {
  const errorObj = JSON.parse(errorMessage);
  const errorResponseFields = Object.keys(errorObj.response);
  const errors = errorResponseFields.reduce((temp, field) => {
    const fieldErrors = errorObj.response[field];
    return [...temp, ...fieldErrors];
  }, []);

  return errors.map((error) => (
    <Fragment key={error}>
      - {error}
      <br />
    </Fragment>
  ));
}

export default function LoginForm() {
  const { dispatch } = useGlobalState();
  const [
    { isLoading, response, error },
    submitForm,
  ] = useApi.post('/users/account/login', { lazy: true });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm({ email, password });
  };

  useEffect(() => {
    if (response) {
      storeAuthTokens(response);
      dispatch({ type: 'LOGIN' });
    }
  }, [response, dispatch]);

  useEffect(() => {
    if (error) {
      toast.add({
        type: 'error',
        message: generateErrorToastMessage(error.message),
        duration: 5,
      });
    }
  }, [error]);

  return (
    <Container onSubmit={handleSubmit}>
      <Label>
        Email
        <Input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Label>
      <Label>
        Password
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Label>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <StyledSpinner size="30px" /> : 'Login'}
      </Button>
    </Container>
  );
}
