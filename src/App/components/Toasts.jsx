import React, { useState, useEffect } from 'react';
import pubsub from 'sweet-pubsub';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import getUniqueId from 'utils/getUniqueId';

const colors = {
  error: '#ce4844',
  info: '#4889d0',
};
const ToastsContainer = styled.div`
  position: fixed;
  z-index: 60;
  top: 30px;
  right: 50px;
  width: 350px;
`;
const Toast = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 5px;
  padding: 20px 10px 20px 10px;
  font-weight: 400;
  color: #382423;
  background-color: ${(props) => colors[props.type]};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;
  transition: all 0.15s;
  transform: translateZ(0);

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
const CloseButton = styled.div`
  position: absolute;
  top: 3px;
  right: 5px;
  line-height: 0.9;
  font-size: 20px;
  font-weight: 800;
  color: #382423;

  &:before {
    content: '×';
  }
`;

export default function Toasts() {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  useEffect(() => {
    const addToast = ({ message, type, duration }) => {
      const id = getUniqueId('toast');
      setToasts((currentToasts) => [...currentToasts, { id, message, type }]);

      if (duration) {
        setTimeout(() => removeToast(id), duration * 1000);
      }
    };

    pubsub.on('toast', addToast);

    return () => {
      pubsub.off('toast', addToast);
    };
  }, []);

  return (
    <ToastsContainer>
      <TransitionGroup>
        {toasts.map((toast) => (
          <CSSTransition key={toast.id} classNames="toast" timeout={200}>
            <Toast onClick={() => removeToast(toast.id)} type={toast.type}>
              <CloseButton />
              {toast.message}
            </Toast>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ToastsContainer>
  );
}
