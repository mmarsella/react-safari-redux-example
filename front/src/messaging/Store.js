import {
  DISPATCH_TYPE,
  STATE_TYPE,
  PATCH_STATE_TYPE,
  DIFF_STATUS_UPDATED,
  DIFF_STATUS_REMOVED,
  STORE_INIT,
} from './constants';

const backgroundErrPrefix = '\nLooks like there is an error in the background page. ' +
  'You might want to inspect your background page for more details.\n';

class Store {
  /**
   * Creates a new Proxy store
   * @param  {object} options An object of form {portName, state, extensionId}, where `portName` is a required string and defines the name of the port for state transition changes, `state` is the initial state of this store (default `{}`) `extensionId` is the extension id as defined by chrome when extension is loaded (default `''`)
   */
  constructor({ portName, state = {}, extensionId = '' }, from) {
    if (!portName) {
      throw new Error('portName is required in optionssss');
    }

    this.portName = portName;
    this.readyResolved = false;
    this.readyPromise = new Promise(resolve => this.readyResolve = resolve);
    this.extensionId = extensionId; // keep the extensionId as an instance variable
    this.listeners = [];
    this.state = state;
    this.id = Date.now().toString();
    this.from = from;
    
    this.init();  // emulating chrome.runtime.connect by sending a "proxyInit" msg to the wrapStore

    safari.self.addEventListener("message", (msg) => {

      if(msg.message.from === "promiseResponder"){
        const { error, value } = msg.message;
        if (error) {
          console.error(error);
          // const bgErr = new Error(`${backgroundErrPrefix}${error}`);
          // reject(assignIn(bgErr, error));
        } else {
          Promise.resolve(value && value.payload);
        }
        return;
      }

      switch (msg.message.type) {

        case STATE_TYPE: // 'chromex.state'
          this.replaceState(msg.message.payload);

          if (!this.readyResolved) {
            this.readyResolved = true;
            this.readyResolve();
          }
          break;

        case PATCH_STATE_TYPE: // 'chromex.patch_state'
          this.patchState(msg.message.payload);
          break;

        default:
          console.log(`DEFAULT BIN`, msg)
      }
    }, false);

    this.dispatch = this.dispatch.bind(this); // add this context to dispatch
  }

  /**
  * Returns a promise that resolves when the store is ready. Optionally a callback may be passed in instead.
  * @param [function] callback An optional callback that may be passed in and will fire when the store is ready.
  * @return {object} promise A promise that resolves when the store has established a connection with the background page.
  */


  // Make sure to init Store at top level.
  init(){
    if(window.top === window){
      safari.self.tab.dispatchMessage("proxyInit", {port: this.portName, type: "proxy-init", proxyStoreID: this.id, href: document.location.href, from: this.from}); 
    }
  }

  ready(cb = null) {
    if (cb !== null) {
      return this.readyPromise.then(cb);
    }

    return this.readyPromise;
  }

  /**
   * Subscribes a listener function for all state changes
   * @param  {function} listener A listener function to be called when store state changes
   * @return {function}          An unsubscribe function which can be called to remove the listener from state updates
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Replaces the state for only the keys in the updated state. Notifies all listeners of state change.
   * @param {object} state the new (partial) redux state
   */
  patchState(difference) {
    // console.log('diff in store', difference)
    const state = Object.assign({}, this.state);

    difference.forEach(({ change, key, value }) => {
      switch (change) {
        case DIFF_STATUS_UPDATED:
          state[key] = value;
          break;

        case DIFF_STATUS_REMOVED:
          Reflect.deleteProperty(state, key);
          break;

        default:
          // do nothing
      }
    });

    this.state = state;
    this.listeners.forEach((l) => l());
  }

  /**
   * Replace the current state with a new state. Notifies all listeners of state change.
   * @param  {object} state The new state for the store
   */
  replaceState(state) {
    this.state = state;
    this.listeners.forEach((l) => l());
  }

  /**
   * Get the current state of the store
   * @return {object} the current store state
   */
  getState() {
    return this.state;
  }

  /**
   * Dispatch an action to the background using messaging passing
   * @param  {object} data The action data to dispatch
   * @return {Promise}     Promise that will resolve/reject based on the action response from the background
   */
  dispatch(data) {
    return new Promise((resolve, reject) => {
      safari.self.tab.dispatchMessage(
        DISPATCH_TYPE,
        {
          type: DISPATCH_TYPE,
          portName: this.portName,
          payload: data
        }
      )
    }
  )}
}

export default Store;
