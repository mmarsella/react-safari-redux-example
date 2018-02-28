/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Message type used for dispatch events
// from the Proxy Stores to background
const DISPATCH_TYPE = 'chromex.dispatch';
/* harmony export (immutable) */ __webpack_exports__["a"] = DISPATCH_TYPE;


// Message type used for dispatch events from the 
// Proxy Stores to background when Store is created.
const STORE_INIT = 'proxyInit';
/* harmony export (immutable) */ __webpack_exports__["d"] = STORE_INIT;


// Message type for state update events from
// background to Proxy Stores
const STATE_TYPE = 'chromex.state';
/* harmony export (immutable) */ __webpack_exports__["c"] = STATE_TYPE;


// Message type for state patch events from
// background to Proxy Stores
const PATCH_STATE_TYPE = 'chromex.patch_state';
/* harmony export (immutable) */ __webpack_exports__["b"] = PATCH_STATE_TYPE;


// The `change` value for updated or inserted fields resulting from shallow diff
const DIFF_STATUS_UPDATED = 'updated';
/* harmony export (immutable) */ __webpack_exports__["e"] = DIFF_STATUS_UPDATED;


// The `change` value for removed fields resulting from shallow diff
const DIFF_STATUS_REMOVED = 'removed';
/* harmony export (immutable) */ __webpack_exports__["f"] = DIFF_STATUS_REMOVED;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _src = __webpack_require__(2);

var timerID = void 0;
var portName = '__SAFARI_EXT__';

function runToolbar() {

  if (window !== window.top) {
    return;
  }

  // Initializing a proxyStore takes a portname and a string to indicate where it is being initialized.
  var proxyStore = new _src.Store({ portName: portName }, 'TOOLBAR');

  proxyStore.ready().then(function () {
    clearTimeout(timerID);
    proxyStore.dispatch({ type: 'ADD_TAB' });
  });
}

if (window === window.top) {
  timerID = setTimeout(runToolbar, 700);
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store_Store__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wrap_store_wrapStore__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return __WEBPACK_IMPORTED_MODULE_0__store_Store__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "wrapStore", function() { return __WEBPACK_IMPORTED_MODULE_1__wrap_store_wrapStore__["a"]; });





/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);


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

        case __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* STATE_TYPE */]: // 'chromex.state'
          this.replaceState(msg.message.payload);

          if (!this.readyResolved) {
            this.readyResolved = true;
            this.readyResolve();
          }
          break;

        case __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* PATCH_STATE_TYPE */]: // 'chromex.patch_state'
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
    if(window.top === window && this.from === "TOOLBAR"){
      console.log("TOOLBAR INIT")
      safari.self.tab.dispatchMessage("proxyInit", {port: this.portName, type: "proxy-init", proxyStoreID: this.id, href: document.location.href, from: this.from}); 
    }

    if(this.from === "POPOVER"){
      console.log("POPOVER INIT")
      safari.extension.globalPage.contentWindow.capturePopoverMessage('proxyInit', 
      {port: this.portName, type: 'proxy-init', proxyStoreID: this.id, href: document.location.href, from: this.from});
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
        case __WEBPACK_IMPORTED_MODULE_0__constants__["e" /* DIFF_STATUS_UPDATED */]:
          state[key] = value;
          break;

        case __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* DIFF_STATUS_REMOVED */]:
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
        __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* DISPATCH_TYPE */],
        {
          type: __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* DISPATCH_TYPE */],
          portName: this.portName,
          payload: data
        }
      )
    }
  )}
}

/* harmony default export */ __webpack_exports__["a"] = (Store);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let ID_COUNTER = 1;
/* harmony default export */ __webpack_exports__["a"] = ({
	checkAllTabsForID: function(){
		if(safari.application.activeBrowserWindow){
			safari.application.activeBrowserWindow.tabs.forEach(function(tab,i){
				if(!safari.application.activeBrowserWindow.tabs[i].id){
					tab.id = ID_COUNTER;
					ID_COUNTER++;
				}
			})
		}
	},
	getTab: function(tabID, cb){
		const tabs = safari.application.activeBrowserWindow.tabs;
		for(let i=0; i < tabs.length; i++){
			if(tabs[i].id === tabID){
				if(cb){
					cb(tabs[i]);
				}
				return tabs[i];
			}	
		}
	}
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = shallowDiff;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);


/**
 * Returns a new Object containing only the fields in `new` that differ from `old`
 *
 * @param {Object} old
 * @param {Object} new
 * @return {Array} An array of changes. The changes have a `key`, `value`, and `change`.
 *   The change is either `updated`, which is if the value has changed or been added,
 *   or `removed`.
 */
function shallowDiff(oldObj, newObj) {
  const difference = [];

  Object.keys(newObj).forEach((key) => {
    if (oldObj[key] !== newObj[key]) {
      difference.push({
        key,
        value: newObj[key],
        change: __WEBPACK_IMPORTED_MODULE_0__constants__["e" /* DIFF_STATUS_UPDATED */],
      });
    }
  });

  Object.keys(oldObj).forEach(key => {
    if (!newObj[key]) {
      difference.push({
        key,
        change: __WEBPACK_IMPORTED_MODULE_0__constants__["f" /* DIFF_STATUS_REMOVED */],
      });
    }
  });

  return difference;
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shallowDiff__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__safariTabID__ = __webpack_require__(4);



  // handles attaching tab IDs to safari tabs and getting a tab.


// console.log('******' , shallowDiff)
/**
 * Responder for promisified results
 * @param  {object} dispatchResult The result from `store.dispatch()`
 * @param  {function} send         The function used to respond to original message
 * @return {undefined}
 */

const promiseResponder = (dispatchResult, send) => {
  Promise
    .resolve(dispatchResult)
    .then((res) => {
      send({
        error: null,
        value: res,
        from: "promiseResponder"
      });
    })
    .catch((err) => {
      send({
        error: err.message,
        value: null,
        from: "promiseResponder"
      });
    });
};

/* harmony default export */ __webpack_exports__["a"] = ((store, {
  portName,
  dispatchResponder
}) => {

  // array of objs that contain:  tabID, unsubscribe()
  let proxyStores = [];
  __WEBPACK_IMPORTED_MODULE_2__safariTabID__["a" /* default */].checkAllTabsForID();

  if (!portName) {
    throw new Error('portName is required in options');
  }

  // set dispatch responder as promise responder
  if (!dispatchResponder) {
    dispatchResponder = promiseResponder;
  }

  /**
   * Respond to dispatches from UI components
   */
  const dispatchResponse = (request, sender, sendResponse) => {
    if (request.type === __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* DISPATCH_TYPE */] && request.portName === portName) {
      const action = Object.assign({}, request.payload, {
        // sender will always be null
        _sender: sender
      });

      let dispatchResult = null;

      try {
        dispatchResult = store.dispatch(action);
      } catch (e) {
        dispatchResult = Promise.reject(e.message);
        console.error(e);
      }

      dispatchResponder(dispatchResult, sendResponse);
      return;
    }
  };

  /*
    * Setup for state updates
  */
  const connectState = (evt, tab) => {
    if (evt.port !== portName) {
      return;
    }

    if(!tab.id){
      __WEBPACK_IMPORTED_MODULE_2__safariTabID__["a" /* default */].checkAllTabsForID();
    }

    let prevState = store.getState();

    const patchState = () => {
      const state = store.getState();
      const diff = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__shallowDiff__["a" /* default */])(prevState, state);

      if (diff.length) {
        prevState = state;

        dispatchAllTabs({
          type: __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* PATCH_STATE_TYPE */],
          payload: diff,
        })
      }
    };

    // Send patched state down connected port on every redux store state change
    const unsubscribe = store.subscribe(patchState);
    proxyStores.push({tabID: tab.id, unsubscribe, from:evt.from});

    
    safari.extension.settings.proxyStores = proxyStores;  // for testing only --> uncomment to check on the current state of proxyStores off of the safari.extension.settings obj
    
    
    __WEBPACK_IMPORTED_MODULE_2__safariTabID__["a" /* default */].getTab(tab.id, (curTab) => {
      // Send store's initial state through port
      curTab.page.dispatchMessage(
        portName, 
        {
          type: __WEBPACK_IMPORTED_MODULE_0__constants__["c" /* STATE_TYPE */],
          payload: prevState,
        }
      );      
    });
  };

  // when the port disconnects, unsubscribe the sendState listener    
  function disconnectStore(evt){
    let tab = evt.target;
    proxyStores = findAndRemoveProxyStore(tab.id);
    safari.extension.settings.proxyStores = proxyStores;
  }

  // listen for any URL CHANGE or CLOSE EVENT. Unsubscribe stores.
  safari.application.addEventListener("close", disconnectStore, true);
  safari.application.addEventListener("beforeNavigate", disconnectStore, true);


  const dispatchAllTabs = (details) => {
    // dispatch message to all tabs in active browser window
    let tabLength = safari.application.activeBrowserWindow.tabs.length; 
    let tabs = safari.application.activeBrowserWindow.tabs.slice();
    tabs.forEach(function(tab,i){

      // Check if this is a blank Safari page
      if(tab.page){
        tab.page.dispatchMessage(portName,details);
      }
    })
  }

  /**
   * Setup action handler
   */  

  const handleMsg = (msg) => {

    // Check if this is a blank Safari page
    if(!msg.target.url){
      return;
    }

    switch(msg.name){
      case __WEBPACK_IMPORTED_MODULE_0__constants__["d" /* STORE_INIT */]:
        connectState(msg.message, msg.target);
        break;
      case __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* DISPATCH_TYPE */]:
        dispatchResponse(msg.message, null, dispatchAllTabs);
        break;
      default:
        return;  
    }
  }


  // Handles 2 things
  // 1)  Handle initial INIT EVENT when a new Store is created  -->  response is connectState (needs to replace chrome.runtime.onConnect.addListener(connectState))
  // 2)  Handle incoming messages from existing Stores 
  safari.application.addEventListener("message", handleMsg, false);
  window.capturePopoverMessage = (name, message) => { 

    console.log('CAPTURE POPOVER MSG:', name, message)
    handleMsg({ name, message, target:{ url: 'popover'}}); 
  };


  // Finds and removes a proxyStore. Also unsubscribes the store.
  function findAndRemoveProxyStore(tabID){
    let arr = proxyStores.filter((store, idx) => {
      if(store.tabID === tabID){
        store.unsubscribe();
      }
      return store.tabID !== tabID; 
    });
    return arr;
  }


  /**
   * Setup external action handler
   */

  // if (chrome.runtime.onMessageExternal) {
  //   chrome.runtime.onMessageExternal.addListener(dispatchResponse);
  // } else {
  //   console.warn('runtime.onMessageExternal is not supported');
  // }

  /**
   * Setup extended connection
   */


  /**
   * Setup extended external connection
   */
  // if (chrome.runtime.onConnectExternal) {
  //   chrome.runtime.onConnectExternal.addListener(connectState);
  // } else {
  //   console.warn('runtime.onConnectExternal is not supported');
  // }
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);