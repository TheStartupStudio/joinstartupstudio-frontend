import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import config from '../config.json'

dotenv.config()

const configureAwsSdk = () => {
  const region = process.env.REACT_APP_CLIENT_BASE_URL.includes('dev')
    ? config.cognitoDemo.REGION
    : config.cognito.REGION
  const userPoolId = process.env.REACT_APP_CLIENT_BASE_URL.split(
    '/'
  )[2].includes('dev')
    ? config.cognitoDemo.USER_POOL_ID
    : config.cognito.USER_POOL_ID

  AWS.config.update({
    region,
    accessKeyId: 'AKIAX7ZH434ALT2XTETW',
    secretAccessKey: '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'
  })

  return new AWS.CognitoIdentityServiceProvider({ UserPoolId: userPoolId })
}

export default configureAwsSdk
