import pubsub from 'sweet-pubsub';

function add({ type, message, duration }) {
  pubsub.emit('toast', { type, message, duration });
}

export default { add };
