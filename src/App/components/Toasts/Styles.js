import styled from 'styled-components';

import { colors, zIndex } from 'utils/styles';

export const ToastsContainer = styled.div`
  position: fixed;
  z-index: ${zIndex.toasts};
  top: 30px;
  right: 50px;
  width: 350px;
`;

export const Toast = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 5px;
  padding: 20px;
  font-weight: 400;
  color: #f1eeee;
  background-color: ${(props) => colors[props.type]};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;
  transition: all 0.15s;
  transform: translateZ(0);
  border-radius: 3px;

  &.toast-enter,
  &.toast-exit.toast-exit-active {
    opacity: 0;
    right: -10px;
  }

  &.toast-exit,
  &.toast-enter.toast-enter-active {
    opacity: 1;
    right: 0;
  }
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 3px;
  right: 5px;
  line-height: 0.9;
  font-size: 20px;
  font-weight: 800;
  color: #f1eeee;

  &:before {
    content: '×';
  }
`;
