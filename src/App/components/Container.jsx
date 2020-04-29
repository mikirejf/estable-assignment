import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-items: center;
  align-items: center;
`;

export default function Container({ children }) {
  return <StyledContainer>{children}</StyledContainer>;
}

Container.defaultProps = {
  children: null,
};

Container.propTypes = {
  children: PropTypes.node,
};
