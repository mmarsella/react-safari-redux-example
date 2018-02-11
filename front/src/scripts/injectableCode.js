import Store from '../messaging/Store';

let timerID;
const portName = '__SAFARI_EXT__';

function runToolbar(){

  if(window !== window.top){
    return;
  }

  // Initializing a proxyStore takes a portname and a string to indicate where it is being initialized.
  const proxyStore = new Store({ portName: portName}, 'TOOLBAR');

  proxyStore.ready().then(() => {
    clearTimeout(timerID);
    proxyStore.dispatch({type:'ADD_TAB'});
  });

} 

if(window === window.top){
	timerID = setTimeout(runToolbar, 700);
}
