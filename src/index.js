import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Amplify from 'aws-amplify'
import App from './App'
import store from './redux/store'
import config from './config.json'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/style.css'
import './assets/css/media.css'
import './assets/css/extra.css'
import './assets/css/ltsUiItems.css'

const { PUBLIC_URL } = process.env

// Enhanced ResizeObserver error suppression - place this at the very top
const suppressResizeObserverErrors = () => {
  // Override console.error to filter ResizeObserver errors
  const originalError = console.error;
  console.error = function(...args) {
    if (args[0] && typeof args[0] === 'string' && 
        args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
      return;
    }
    originalError.apply(console, args);
  };

  // Handle window errors
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return false;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      event.preventDefault();
    }
  });

  // Override ResizeObserver constructor
  const OriginalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class extends OriginalResizeObserver {
    constructor(callback) {
      super((entries, observer) => {
        try {
          callback(entries, observer);
        } catch (error) {
          if (!error.message.includes('ResizeObserver loop completed with undelivered notifications')) {
            throw error;
          }
        }
      });
    }
  };
};

// Call immediately
suppressResizeObserverErrors();

// Amplify.configure({
//   Auth: {
//     region: process.env.REACT_APP_CLIENT_BASE_URL.includes('dev')
//       ? config.cognitoDemo.REGION
//       : config.cognito.REGION,
//     userPoolId: process.env.REACT_APP_CLIENT_BASE_URL.split('/')[2].includes(
//       'dev'
//     )
//       ? config.cognitoDemo.USER_POOL_ID
//       : config.cognito.USER_POOL_ID,
//     userPoolWebClientId: process.env.REACT_APP_CLIENT_BASE_URL.split(
//       '/'
//     )[2].includes('dev')
//       ? config.cognitoDemo.APP_CLIENT_ID
//       : config.cognito.APP_CLIENT_ID
//   }
// })

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <App basename={PUBLIC_URL} />
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
)
