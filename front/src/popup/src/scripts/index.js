import React from 'react';
import {render} from 'react-dom';

import App from './components/app/App';

import {Provider} from 'react-redux';
import {Store} from '../../../../../react-safari-redux/src';

console.log('YOOO')
const portName = '__SAFARI_EXT__';

// safari.extension.globalPage.contentWindow.console.log()


const proxyStore = new Store({portName: portName}, 'POPOVER');

render(
    <Provider store={proxyStore}><App /></Provider>
  , document.getElementById('app'));


// render(<Provider><App /></Provider>, document.getElementById('app'));
