import React, { useEffect } from 'react';
import styled from 'styled-components';

import endpoints from 'utils/endpoints';
import { storeAuthTokens } from 'utils/authTokens';
import useAsync from 'hooks/useAsync';
import { useGlobalState } from 'App/GlobalStateProvider';
import Spinner from './Spinner';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled.button`
  width: 250px;
  height: 60px;
  padding: 20px;
  font-family: sans-serif;
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

export default function LoginButton() {
  const { dispatch } = useGlobalState();
  const { state, send } = useAsync({
    method: 'POST',
    url: endpoints.login,
    headers: { 'content-type': 'application/json' },
    body: { email: 'andrej.premrn@gmail.com', password: 'preAnd04' },
  });

  useEffect(() => {
    if (state.response) {
      storeAuthTokens(state.response);
      dispatch({ type: 'LOGIN' });
    }
  }, [state.response, dispatch]);

  return (
    <Wrapper>
      <StyledButton onClick={send} disabled={state.isLoading}>
        {state.isLoading ? <Spinner size="30px" /> : 'Login as Andrej Premrn'}
      </StyledButton>
      {state.error ? 'Something went wrong, please try again.' : null}
    </Wrapper>
  );
}
