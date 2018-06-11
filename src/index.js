import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { displayList, cexList } from "./initData";

ReactDOM.render(
  <App
    cexList={cexList}
    displayList={displayList}
  />, document.getElementById('root'));
registerServiceWorker();
