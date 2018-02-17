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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Message type used for dispatch events
// from the Proxy Stores to background
var DISPATCH_TYPE = exports.DISPATCH_TYPE = 'chromex.dispatch';

// Message type used for dispatch events from the 
// Proxy Stores to background when Store is created.
var STORE_INIT = exports.STORE_INIT = 'proxyInit';

// Message type for state update events from
// background to Proxy Stores
var STATE_TYPE = exports.STATE_TYPE = 'chromex.state';

// Message type for state patch events from
// background to Proxy Stores
var PATCH_STATE_TYPE = exports.PATCH_STATE_TYPE = 'chromex.patch_state';

// The `change` value for updated or inserted fields resulting from shallow diff
var DIFF_STATUS_UPDATED = exports.DIFF_STATUS_UPDATED = 'updated';

// The `change` value for removed fields resulting from shallow diff
var DIFF_STATUS_REMOVED = exports.DIFF_STATUS_REMOVED = 'removed';

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reactSafariRedux = __webpack_require__(2);

console.log('!!!!!!!!!!! STORE:', _reactSafariRedux.Store);

var timerID = void 0;
var portName = '__SAFARI_EXT__';

function runToolbar() {

  if (window !== window.top) {
    return;
  }

  // Initializing a proxyStore takes a portname and a string to indicate where it is being initialized.
  var proxyStore = new _reactSafariRedux.Store({ portName: portName }, 'TOOLBAR');

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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapStore = exports.Store = undefined;

var _Store = __webpack_require__(3);

var _Store2 = _interopRequireDefault(_Store);

var _wrapStore = __webpack_require__(6);

var _wrapStore2 = _interopRequireDefault(_wrapStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Store = _Store2.default;
exports.wrapStore = _wrapStore2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var backgroundErrPrefix = '\nLooks like there is an error in the background page. ' + 'You might want to inspect your background page for more details.\n';

var Store = function () {
  /**
   * Creates a new Proxy store
   * @param  {object} options An object of form {portName, state, extensionId}, where `portName` is a required string and defines the name of the port for state transition changes, `state` is the initial state of this store (default `{}`) `extensionId` is the extension id as defined by chrome when extension is loaded (default `''`)
   */
  function Store(_ref, from) {
    var _this = this;

    var portName = _ref.portName,
        _ref$state = _ref.state,
        state = _ref$state === undefined ? {} : _ref$state,
        _ref$extensionId = _ref.extensionId,
        extensionId = _ref$extensionId === undefined ? '' : _ref$extensionId;

    _classCallCheck(this, Store);

    if (!portName) {
      throw new Error('portName is required in optionssss');
    }

    this.portName = portName;
    this.readyResolved = false;
    this.readyPromise = new Promise(function (resolve) {
      return _this.readyResolve = resolve;
    });
    this.extensionId = extensionId; // keep the extensionId as an instance variable
    this.listeners = [];
    this.state = state;
    this.id = Date.now().toString();
    this.from = from;

    this.init(); // emulating chrome.runtime.connect by sending a "proxyInit" msg to the wrapStore

    safari.self.addEventListener("message", function (msg) {

      if (msg.message.from === "promiseResponder") {
        var _msg$message = msg.message,
            error = _msg$message.error,
            value = _msg$message.value;

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

        case _constants.STATE_TYPE:
          // 'chromex.state'
          _this.replaceState(msg.message.payload);

          if (!_this.readyResolved) {
            _this.readyResolved = true;
            _this.readyResolve();
          }
          break;

        case _constants.PATCH_STATE_TYPE:
          // 'chromex.patch_state'
          _this.patchState(msg.message.payload);
          break;

        default:
          console.log('DEFAULT BIN', msg);
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


  _createClass(Store, [{
    key: 'init',
    value: function init() {
      if (window.top === window) {
        safari.self.tab.dispatchMessage("proxyInit", { port: this.portName, type: "proxy-init", proxyStoreID: this.id, href: document.location.href, from: this.from });
      }
    }
  }, {
    key: 'ready',
    value: function ready() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

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

  }, {
    key: 'subscribe',
    value: function subscribe(listener) {
      var _this2 = this;

      this.listeners.push(listener);
      return function () {
        _this2.listeners = _this2.listeners.filter(function (l) {
          return l !== listener;
        });
      };
    }

    /**
     * Replaces the state for only the keys in the updated state. Notifies all listeners of state change.
     * @param {object} state the new (partial) redux state
     */

  }, {
    key: 'patchState',
    value: function patchState(difference) {
      // console.log('diff in store', difference)
      var state = Object.assign({}, this.state);

      difference.forEach(function (_ref2) {
        var change = _ref2.change,
            key = _ref2.key,
            value = _ref2.value;

        switch (change) {
          case _constants.DIFF_STATUS_UPDATED:
            state[key] = value;
            break;

          case _constants.DIFF_STATUS_REMOVED:
            Reflect.deleteProperty(state, key);
            break;

          default:
          // do nothing
        }
      });

      this.state = state;
      this.listeners.forEach(function (l) {
        return l();
      });
    }

    /**
     * Replace the current state with a new state. Notifies all listeners of state change.
     * @param  {object} state The new state for the store
     */

  }, {
    key: 'replaceState',
    value: function replaceState(state) {
      this.state = state;
      this.listeners.forEach(function (l) {
        return l();
      });
    }

    /**
     * Get the current state of the store
     * @return {object} the current store state
     */

  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }

    /**
     * Dispatch an action to the background using messaging passing
     * @param  {object} data The action data to dispatch
     * @return {Promise}     Promise that will resolve/reject based on the action response from the background
     */

  }, {
    key: 'dispatch',
    value: function dispatch(data) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        safari.self.tab.dispatchMessage(_constants.DISPATCH_TYPE, {
          type: _constants.DISPATCH_TYPE,
          portName: _this3.portName,
          payload: data
        });
      });
    }
  }]);

  return Store;
}();

exports.default = Store;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var ID_COUNTER = 1;
exports.default = {
	checkAllTabsForID: function checkAllTabsForID() {
		if (safari.application.activeBrowserWindow) {
			safari.application.activeBrowserWindow.tabs.forEach(function (tab, i) {
				if (!safari.application.activeBrowserWindow.tabs[i].id) {
					tab.id = ID_COUNTER;
					ID_COUNTER++;
				}
			});
		}
	},
	getTab: function getTab(tabID, cb) {
		var tabs = safari.application.activeBrowserWindow.tabs;
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].id === tabID) {
				if (cb) {
					cb(tabs[i]);
				}
				return tabs[i];
			}
		}
	}
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shallowDiff;

var _constants = __webpack_require__(0);

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
  var difference = [];

  Object.keys(newObj).forEach(function (key) {
    if (oldObj[key] !== newObj[key]) {
      difference.push({
        key: key,
        value: newObj[key],
        change: _constants.DIFF_STATUS_UPDATED
      });
    }
  });

  Object.keys(oldObj).forEach(function (key) {
    if (!newObj[key]) {
      difference.push({
        key: key,
        change: _constants.DIFF_STATUS_REMOVED
      });
    }
  });

  return difference;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = __webpack_require__(0);

var _shallowDiff = __webpack_require__(5);

var _shallowDiff2 = _interopRequireDefault(_shallowDiff);

var _safariTabID = __webpack_require__(4);

var _safariTabID2 = _interopRequireDefault(_safariTabID);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// handles attaching tab IDs to safari tabs and getting a tab.


// console.log('******' , shallowDiff)
/**
 * Responder for promisified results
 * @param  {object} dispatchResult The result from `store.dispatch()`
 * @param  {function} send         The function used to respond to original message
 * @return {undefined}
 */

var promiseResponder = function promiseResponder(dispatchResult, send) {
  Promise.resolve(dispatchResult).then(function (res) {
    send({
      error: null,
      value: res,
      from: "promiseResponder"
    });
  }).catch(function (err) {
    send({
      error: err.message,
      value: null,
      from: "promiseResponder"
    });
  });
};

exports.default = function (store, _ref) {
  var portName = _ref.portName,
      dispatchResponder = _ref.dispatchResponder;


  // array of objs that contain:  tabID, unsubscribe()
  var proxyStores = [];
  _safariTabID2.default.checkAllTabsForID();

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
  var dispatchResponse = function dispatchResponse(request, sender, sendResponse) {
    if (request.type === _constants.DISPATCH_TYPE && request.portName === portName) {
      var action = Object.assign({}, request.payload, {
        // sender will always be null
        _sender: sender
      });

      var dispatchResult = null;

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
  var connectState = function connectState(evt, tab) {
    if (evt.port !== portName) {
      return;
    }

    if (!tab.id) {
      _safariTabID2.default.checkAllTabsForID();
    }

    var prevState = store.getState();

    var patchState = function patchState() {
      var state = store.getState();
      var diff = (0, _shallowDiff2.default)(prevState, state);

      if (diff.length) {
        prevState = state;

        dispatchAllTabs({
          type: _constants.PATCH_STATE_TYPE,
          payload: diff
        });
      }
    };

    // Send patched state down connected port on every redux store state change
    var unsubscribe = store.subscribe(patchState);
    proxyStores.push({ tabID: tab.id, unsubscribe: unsubscribe, from: evt.from });

    // safari.extension.settings.proxyStores = proxyStores;  // for testing only --> uncomment to check on the current state of proxyStores off of the safari.extension.settings obj


    _safariTabID2.default.getTab(tab.id, function (curTab) {
      // Send store's initial state through port
      curTab.page.dispatchMessage(portName, {
        type: _constants.STATE_TYPE,
        payload: prevState
      });
    });
  };

  // when the port disconnects, unsubscribe the sendState listener    
  function disconnectStore(evt) {
    var tab = evt.target;
    proxyStores = findAndRemoveProxyStore(tab.id);
    safari.extension.settings.proxyStores = proxyStores;
  }

  // listen for any URL CHANGE or CLOSE EVENT. Unsubscribe stores.
  safari.application.addEventListener("close", disconnectStore, true);
  safari.application.addEventListener("beforeNavigate", disconnectStore, true);

  var dispatchAllTabs = function dispatchAllTabs(details) {
    // dispatch message to all tabs in active browser window
    var tabLength = safari.application.activeBrowserWindow.tabs.length;
    var tabs = safari.application.activeBrowserWindow.tabs.slice();
    tabs.forEach(function (tab, i) {

      // Check if this is a blank Safari page
      if (tab.page) {
        tab.page.dispatchMessage(portName, details);
      }
    });
  };

  /**
   * Setup action handler
   */

  var handleMsg = function handleMsg(msg) {

    // Check if this is a blank Safari page
    if (!msg.target.url) {
      return;
    }

    switch (msg.name) {
      case _constants.STORE_INIT:
        connectState(msg.message, msg.target);
        break;
      case _constants.DISPATCH_TYPE:
        dispatchResponse(msg.message, null, dispatchAllTabs);
        break;
      default:
        return;
    }
  };

  // Handles 2 things
  // 1)  Handle initial INIT EVENT when a new Store is created  -->  response is connectState (needs to replace chrome.runtime.onConnect.addListener(connectState))
  // 2)  Handle incoming messages from existing Stores 
  safari.application.addEventListener("message", handleMsg, false);

  // Finds and removes a proxyStore. Also unsubscribes the store.
  function findAndRemoveProxyStore(tabID) {
    var arr = proxyStores.filter(function (store, idx) {
      if (store.tabID === tabID) {
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
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);