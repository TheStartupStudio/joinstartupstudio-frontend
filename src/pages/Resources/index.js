import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Calendar from '../../components/Calendar'
import { changeSidebarState } from '../../redux'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/AxiosInstance'
import ResourceCard from '../../components/Resources/resourceCard'

function Dashboard() {
  const dispatch = useDispatch()
  const [resources, setResources] = useState([])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  useEffect(() => {
    getResources()
  }, [])

  const getResources = async () => {
    await axiosInstance
      .get('/resources')
      .then((res) => {
        console.log({ res })
        setResources(res.data)
      })
      .catch((e) => e)
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 col-xl-9 pe-0 me-0'>
          <div className='account-page-padding page-border'>
            <h3 className='page-title'>Resources</h3>
            <p className='page-description'>
              Resources for setting up your Learn to Start classrooms.
            </p>
            <div className='resource-cards-container my-4'>
              {/* <ActiveStudents /> */}
              {resources[0] && <ResourceCard data={resources[0]} />}
              {resources[0] && <ResourceCard data={resources[0]} />}
              {resources[0] && <ResourceCard data={resources[0]} />}
              {resources[0] && <ResourceCard data={resources[0]} />}
              {resources[0] && <ResourceCard data={resources[0]} />}
              {resources[0] && <ResourceCard data={resources[0]} />}
              {resources[0] && <ResourceCard data={resources[0]} />}
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-3 px-0'>
          <div className='account-page-padding' style={{ paddingLeft: '20px' }}>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
