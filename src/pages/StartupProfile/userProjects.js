import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import MyProjects from './MyProjects'

const UserProjects = () => {
  const [width, setWidth] = useState(null)
  const [myProjects, setMyProjects] = useState([])
  const [Loading, setLoading] = useState(false)
  const [user, setUser] = useState()
  const uid = useParams().uid

  const getMyProject = async () => {
    setLoading(true)
    await axiosInstance
      .get('/business/ByUId/' + uid)
      .then((res) => {
        setMyProjects(res.data.data)
        setUser(res.data.user)
        setLoading(false)
      })
      .catch((err) => setLoading(false))
  }

  useEffect(() => {
    getMyProject()
  }, [])

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className='row'>
      <div className='pt-5 px-md-4 col-lg-9 page-border'>
        <div className='px-2 rounded mx-3 mx-md-auto row'>
          {!Loading ? (
            <>
              {myProjects.length > 0 ? (
                <MyProjects
                  width={width}
                  MyProjects={myProjects && myProjects}
                  editAble={false}
                  user={user}
                  from={'UserProject'}
                />
              ) : (
                <div className='d-flex justify-content-center mt-5'>
                  <h1 className='page-title mt-5'>
                    {/* This User Had Not Published Any Project */}
                    This User Has Not Published Any Project
                    {/* This User Has Not Published A Project Yet */}
                  </h1>
                </div>
              )}
            </>
          ) : (
            <>
              <div className='d-flex justify-content-center'>
                <span className='spinner-border spinner-border-sm' />
                <h1>Loading </h1>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProjects
