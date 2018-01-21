import {Injectable} from '@angular/core';
import {config} from '../config';

@Injectable()
export class SocketService {
  private socketInstance;
  private listeners: Listeners = new Listeners();

  constructor() {}

  public async connect() {
    await this._connect();
  }

  private _handleMessage(msg: MessageEvent): void {
    let key = null;
    let msgData;
    if (msg && msg.data) {
      try {
        msgData = JSON.parse(msg.data);
        if (msgData.event) {
          key = msgData.event;
        }
      } catch (e) {}
    }
    if (key && this.listeners.isKeyRegistered(key)) {
      this.listeners.executeHandlers(key, msgData.payload);
    } else {
      console.log('Unhandled Message received', msg);
    }
  }

  public publish({event, payload}): void {
    this.socketInstance.send(JSON.stringify({event, payload}));
  }

  public publishAndRegister({event, payload, handler}) {
    this.publish({event, payload});
    this.registerListener({
      event: event + '_response',
      handler: (payload) => {
        handler(payload);
        this.listeners.remove(event + '_response')
      }
    })
  }

  private _connect() {
    return new Promise((resolve, reject) => {
      this.socketInstance = new WebSocket(config.SOCKET_URL);
      let interval;
      this.socketInstance.onopen = (event) => {
        this._setErrorHandlers();
        this.socketInstance.onmessage = this._handleMessage.bind(this);
        console.log('Connected to socket', event);
        clearInterval(interval);
        return resolve(event);
      };
      interval = setTimeout(() => {
        return reject('Connection failed');
      }, config.CONNECTION_TIMEOUT);
    });

  }

  private _setErrorHandlers(): void {
    this.socketInstance.onclose = this._reconnect.bind(this);
  }

  private _reconnect(): void {
    setTimeout(() => {
      this._connect();
    }, config.CONNECTION_TIMEOUT);
  }

  registerListener({event, handler}) {
    this.listeners.register(event, handler);
  }

  removeListener({event, handler}) {
    this.listeners.remove(event, handler);
  }
}

class Listeners {
  private myListeners = {};
  constructor() {}

  register(key: string, handler: Function): void {
    if (!this.myListeners.hasOwnProperty(key)) {
      this.myListeners[key] = new Set();
    }
    this.myListeners[key].add(handler);
  }

  remove(key: string, handler: Function = null): boolean {
    if (this.myListeners.hasOwnProperty(key)) {
      if (handler) {
        return this.myListeners[key].delete(handler);
      }
      return delete this.myListeners[key];
    }
    return false;
  }

  isKeyRegistered(key: string): boolean {
    return !!this.myListeners[key];
  }

  executeHandlers(key: string, payload: {}): void {
    if (this.myListeners.hasOwnProperty(key)) {
      this.myListeners[key].forEach(handler => handler(payload));
    }
  }
}
