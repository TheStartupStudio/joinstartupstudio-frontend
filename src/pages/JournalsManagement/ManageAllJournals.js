import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { changeSidebarState } from '../../redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditJournals from '../../components/JournalsManagement/editJournals'
import EditAllJournals from '../../components/JournalsManagement/editAllJournals'

function ManageAllJournals() {
  const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(changeSidebarState(false))
  // }, [])

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12'>
          <div className='account-page-padding'>
            <h3 className='page-title'>Edit Journals</h3>
            <EditAllJournals />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageAllJournals
