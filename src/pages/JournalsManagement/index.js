import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { changeSidebarState } from '../../redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditJournals from '../../components/JournalsManagement/editJournals'

function JournalsManagement() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12'>
          <div className='account-page-padding'>
            <h3 className='page-title'>Edit Journals</h3>
            <EditJournals />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalsManagement
