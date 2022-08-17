import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

import Web3Provider from './store/Web3Provider';
import CollectionProvider from './store/CollectionProvider';

import { Web3ReactProvider } from '@web3-react/core';

import App from './App';
import { Provider } from 'react-redux';
import store from './redux';

import { getLibrary } from './utils/helper' ;

ReactDOM.render(
  <Provider store={store}>
    <Web3Provider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <CollectionProvider>
          <App />
        </CollectionProvider>
      </Web3ReactProvider> ,
    </Web3Provider>
  </Provider>,
  document.getElementById('root')
);