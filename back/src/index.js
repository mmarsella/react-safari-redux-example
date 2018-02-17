import {applyMiddleware, createStore, compose} from 'redux';
import rootReducer from './reducers';
import * as actions from './reducers/actions';
import {logger} from 'redux-logger';
// import wrapStore from './messaging/wrapStore.js';
import {wrapStore} from 'react-safari-redux'


console.log('wrapStore', wrapStore)

const portName = '__SAFARI_EXT__';

// create redux store
const store = createStore(
  rootReducer,
  applyMiddleware(logger)
);

wrapStore(store, { portName: portName});

safari.application.addEventListener("command", (evt) => {
	const activeTab = safari.application.activeBrowserWindow.activeTab;
	store.dispatch(actions.increment(activeTab.id));
}, false);


safari.application.addEventListener("navigate", (evt) => {
  let tab;

  // BROWSER EVENT
  if(evt.target.activeTab && evt.target.activeTab.url){
    tab = evt.target.activeTab;
  }
  // TAB EVT
  else if(evt.target.browserWindow && evt.target.url){
    tab = evt.target;
  }
  else{
    return;
  }

}, true);


// Grab a content script and inject it into every tab
fetch(`./contentScript.js`)
.then(res => res.text())
.then((fetchRes) => {
  safari.extension.addContentScript(fetchRes,["http://*","https://*"],["favorites://"],true);
});


safari.application.addEventListener("close", (evt) => {
  if(evt.target.browserWindow){
    let tab = evt.target;
    store.dispatch(actions.removeTab(tab.id));
  }
}, true);


// On tab activate, set currentTabId in store.
safari.application.addEventListener("activate", (evt) => {
  if(evt.target.browserWindow && evt.target.url){
    let tab = evt.target;
    store.dispatch(actions.setCurrentTabId(tab.id));
  }else{
    return;
  }
}, true);