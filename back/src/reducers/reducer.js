import * as constants from './constants';

const initialState = {};

export default (state = initialState, action) => {
	
	let stateCopy;
  switch (action.type) {

    case constants.INCREMENT:

    	stateCopy = {...state}; 
    	stateCopy[action.tabId].count += 1;
      return stateCopy;
      break;

    case constants.ADD_TAB:

	    stateCopy = {...state};
    	let activeTabId = safari.application.activeBrowserWindow.activeTab.id;
    	stateCopy[activeTabId] = {
    		count: 0
    	};
      stateCopy.currentTab = activeTabId;

      return stateCopy;
      break;

    case constants.REMOVE_TAB:
 		   
      stateCopy = {...state};
      if(stateCopy[action.tabId]){
        delete stateCopy[action.tabId];
      }

      return stateCopy;

    case constants.SET_CURRENT_TABID:
      stateCopy = {...state};
      stateCopy.currentTab = action.tabId

      return stateCopy;

    default:
      return state;
  }
};
