import { Auth } from 'aws-amplify'
import React, { useState } from 'react'
import csvToArray from './csvToArray'
import './style.css'

import axiosInstance from '../../utils/AxiosInstance'
import { generateString } from '../../utils/helpers'

function CSVUpload(props) {
  const [loading, setLoading] = useState(false)

  // if (prompt('Password:') !== 'lts111') {
  //   return (
  //     <div>
  //       <h1>No Access!</h1>
  //     </div>
  //   )
  // }

  async function req(results) {
    if (results.length <= 0) {
      setLoading(false)
      return
    }

    const item = results.pop()
    if (!item['UserEmail']) {
      return req(results)
    }

    const randomPassword = generateString()
    // Auth.signUp({
    //   username: item['UserEmail'],
    //   password: randomPassword,
    //   attributes: {
    //     'custom:universityCode': 'dev2020',
    //     'custom:isVerified': '1',
    //     'custom:language': 'en',
    //     'custom:email': item['UserEmail'],
    //     'custom:password': randomPassword,
    //     name: item['First Name'] + ' ' + item['Surname']
    //   }
    // })
    //   .then(async (res) => {
    const params = {
      name: item['First Name'] + ' ' + item['Surname'],
      email: item['UserEmail'],
      universityId: {}.hasOwnProperty.call(item, 'University')
        ? parseInt(item['University'])
        : 1,
      instructor_id:
        !{}.hasOwnProperty.call(item, 'Type') || item['Type'] !== 'Instructor'
          ? 553
          : null,
      // cognito_Id: res.userSub,
      level: item['Level'],
      year: item['Year'],
      stripe_subscription_id: 'true',
      payment_type: 'school',
      is_active: 1,
      type: {}.hasOwnProperty.call(item, 'Type') ? item['Type'] : null,
      role_id: {}.hasOwnProperty.call(item, 'Role')
        ? parseInt(item['Role'])
        : 1,
      profession: {}.hasOwnProperty.call(item, 'Profession')
        ? item['Profession']
        : 'Student'
    }
    await registerUser(params)
    localStorage.setItem('email', item['UserEmail'])
    req(results)
    // })
    // .catch((err) => {
    //   console.log(err)
    //   setLoading(false)
    //   //   setButtonLoading(false)
    //   //   if (err.code === 'UsernameExistsException') {
    //   //     toast.error(<IntlMessages id='alerts.user_exist' />)
    //   //   } else {
    //   //     toast.error(<IntlMessages id='alerts.something_went_wrong' />)
    //   //   }
    // })
  }

  const csvSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    const input = document.getElementById('csvFile').files[0]
    const reader = new FileReader()

    reader.onload = function (e) {
      const results = csvToArray(e.target.result, ',')
      req(results)
    }

    reader.readAsText(input)
  }

  const registerUser = async (user) => {
    await axiosInstance
      .post('/register', user)
      .then((data) => {
        // console.log('registered', data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <form onSubmit={csvSubmit}>
        <input type='file' name='csv' id='csvFile' />
        <button type='submit'>Submit</button>
      </form>
      {loading && <p>loading data...</p>}
    </div>
  )
}

export default CSVUpload
