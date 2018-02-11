import {
  DISPATCH_TYPE,
  STATE_TYPE,
  PATCH_STATE_TYPE,
  STORE_INIT,
} from './constants';

import shallowDiff from './shallowDiff';
import tabAid from '../safariTabID/safariTabID.js';  // handles attaching tab IDs to safari tabs and getting a tab.


// console.log('******' , shallowDiff)
/**
 * Responder for promisified results
 * @param  {object} dispatchResult The result from `store.dispatch()`
 * @param  {function} send         The function used to respond to original message
 * @return {undefined}
 */

// array of objs that contain:  tabID, unsubscribe()
let proxyStores = [];
tabAid.checkAllTabsForID();

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

export default (store, {
  portName,
  dispatchResponder
}) => {

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
    if (request.type === DISPATCH_TYPE && request.portName === portName) {
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
      tabAid.checkAllTabsForID();
    }

    let prevState = store.getState();

    const patchState = () => {
      const state = store.getState();
      const diff = shallowDiff(prevState, state);

      if (diff.length) {
        prevState = state;

        dispatchAllTabs({
          type: PATCH_STATE_TYPE,
          payload: diff,
        })
      }
    };

    // Send patched state down connected port on every redux store state change
    const unsubscribe = store.subscribe(patchState);
    proxyStores.push({tabID: tab.id, unsubscribe, from:evt.from});

    
    // safari.extension.settings.proxyStores = proxyStores;  // for testing only --> uncomment to check on the current state of proxyStores off of the safari.extension.settings obj
    
    
    tabAid.getTab(tab.id, (curTab) => {
      // Send store's initial state through port
      curTab.page.dispatchMessage(
        portName, 
        {
          type: STATE_TYPE,
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
      case STORE_INIT:
        connectState(msg.message, msg.target);
        break;
      case DISPATCH_TYPE:
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
};
