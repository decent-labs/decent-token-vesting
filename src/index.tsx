import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3Provider } from './web3';
import { DataProvider } from './data';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Web3Provider>
        <DataProvider>
          <ToastContainer
            position="bottom-center"
            closeButton={false}
            newestOnTop={false}
            pauseOnFocusLoss={false}
            toastClassName={() => "shadow bg-purple-100 border border-purple-300 text-purple-500 relative flex min-h-10 p-2 m-2 rounded justify-between overflow-hidden cursor-pointer"}
          />
          <App />
        </DataProvider>
      </Web3Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
