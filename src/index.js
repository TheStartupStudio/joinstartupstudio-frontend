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
import '@progress/kendo-theme-default/dist/all.css'

const { PUBLIC_URL } = process.env

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_CLIENT_BASE_URL.includes('dev')
      ? config.cognitoDemo.REGION
      : config.cognito.REGION,
    userPoolId: process.env.REACT_APP_CLIENT_BASE_URL.split('/')[2].includes(
      'dev'
    )
      ? config.cognitoDemo.USER_POOL_ID
      : config.cognito.USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_BASE_URL.split(
      '/'
    )[2].includes('dev')
      ? config.cognitoDemo.APP_CLIENT_ID
      : config.cognito.APP_CLIENT_ID
  }
})

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <App basename={PUBLIC_URL} />
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
)
