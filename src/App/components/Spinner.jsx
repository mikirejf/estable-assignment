import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledSpinner = styled.div`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid gray;
  box-sizing: border-box;
  animation: 1s ${spin} linear infinite;
`;

export default function Spinner({ size, className }) {
  return <StyledSpinner size={size} className={className} />;
}

Spinner.defaultProps = {
  className: '',
};

Spinner.propTypes = {
  size: PropTypes.string.isRequired,
  className: PropTypes.string,
};
