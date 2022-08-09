import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Header from './Header'
import './index.css'
import JournalsBody from './JournalsBody'
const StudentJournals = (props) => {
  const [fetchingUserData, setFetchingUserData] = useState(true)
  const [data, setData] = useState()

  // console.log(data, 'props')
  // useEffect(() => {
  //   getUSerJournals()
  // }, [])

  // const getUSerJournals = async () => {
  //   await axiosInstance
  //     .get('/fromInstructor?category=lts&platform=student&from=userJournals')
  //     .then((data) => {
  //       setData(data)
  //       setFetchingUserData(false)
  //     })
  //     .catch((err) => {
  //       setFetchingUserData(false)
  //       console.log(err)
  //     })
  //     .finally(() => {
  //       setFetchingUserData(false)
  //     })
  // }

  return (
    <>
      <>
        {/* <div className='container-fluid'>
            <div className='account-page-padding'>
              <div className='row'>
                <div className='col-12 col-md-6'>
                  <h3 className='page-title-inner'>STUDENT JOURNAL VIEW</h3>
                  <span className='title-description'>
                    View your student journals.
                  </span>
                </div>
                <div className='col-12 col-md-6 ps-4'>
                  <div className='user-info'>
                    <img
                      className='rounded-circle user-image'
                      src={data?.data?.loggedInUser?.profile_image}
                      alt={data?.data?.loggedInUser?.profile_image}
                    />
                    <span className='user-name ps-2'>{props?.user?.name}</span>
                  </div>
                </div> */}
        <JournalsBody
          data={data?.data?.journals}
          user={data}
          {...props}
          setFetchingUserData={setFetchingUserData}
        />
        {/* </div>
            </div>
          </div> */}
        {console.log(typeof fetchingUserData)}
      </>
    </>
  )
}

export default StudentJournals
