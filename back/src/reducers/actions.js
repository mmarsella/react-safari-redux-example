import * as constants from './constants';

export function setCurrentTabId(tabId) {
  return { type: constants.SET_CURRENT_TABID, tabId };
}

export function increment(tabId) {
  return { type: constants.INCREMENT, tabId };
}

export function addTab(tabId) {
  return { type: constants.ADD_TAB, tabId };
}

export function removeTab(tabId) {
  return { type: constants.REMOVE_TAB, tabId };
}
