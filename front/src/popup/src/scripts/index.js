import React from 'react';
import {render} from 'react-dom';

import App from './components/app/App';

import {Store} from 'react-safari-redux';
import {Provider} from 'react-redux';

console.log('YOOO')


safari.extension.globalPage.contentWindow.console.log()


// const proxyStore = new Store({portName: 'example'});

// render(
//     <Provider store={proxyStore}><App /></Provider>
//   , document.getElementById('app'));


render(
    <Provider><App /></Provider>
  , document.getElementById('app'));
