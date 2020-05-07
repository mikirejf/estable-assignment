import React, { useState, useEffect } from 'react';
import pubsub from 'sweet-pubsub';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import getUniqueId from 'utils/getUniqueId';

import { ToastsContainer, Toast, CloseButton } from './Styles';

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
