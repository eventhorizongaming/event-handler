class EventHandler {
  listeners = {};

  addEventListener(type, listener) {
    if (!type || !listener) {
      return;
    }

    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);

    return this;
  }

  removeEventListener(type, listener) {
    if (!type || !listener) {
      return;
    }

    const listenerIndex = this.listeners[type].indexOf(listener);
    this.listeners[type].splice(listenerIndex);
    return this;
  }

  dispatchEvent(type, detail = {}) {
    if (!type) {
      return;
    }

    const listeners = this.listeners[type];

    if (!listeners) {
      return;
    }

    for (let listener of listeners) {
      try {
        listener(detail);
      } catch (e) {
        console.error(e);
      }
    }

    return this;
  }
}

export { EventHandler as default, EventHandler }