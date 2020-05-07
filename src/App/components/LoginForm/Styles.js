import styled from 'styled-components';

import Spinner from '../Spinner';

export const Container = styled.form`
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

export const Input = styled.input`
  display: block;
  width: 300px;
  height: 60px;
  padding: 10px;
  margin-top: 2px;
  font-weight: 500;
  border: 2px solid #8474a2;
  border-radius: 4px;
`;

export const Label = styled.label`
  color: #8374a2;
  font-weight: 600;
`;

export const Button = styled.button`
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

export const StyledSpinner = styled(Spinner)`
  position: absolute;
`;
