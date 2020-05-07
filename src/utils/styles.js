export const colors = {
  error: '#ce4844',
  info: '#4889d0',
};

// This uses constructor syntax because that allows self-referential math
export const zIndex = new (function zIndex() {
  this.bigCalendar = 4;
  this.dimmer = this.bigCalendar + 1;
  this.toasts = 1000;
})();
