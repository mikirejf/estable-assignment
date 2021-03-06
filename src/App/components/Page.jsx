import React from 'react';
import styled from 'styled-components';

import { useGlobalState } from 'App/GlobalStateProvider';
import LoginButton from 'App/components/LoginForm';
import EventCalendar from 'App/components/EventCalendar';

const StyledContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-items: center;
  align-items: center;
`;

export default function Page() {
  const { state } = useGlobalState();

  return (
    <StyledContainer>
      {state.authenticated ? <EventCalendar /> : <LoginButton />}
    </StyledContainer>
  );
}
