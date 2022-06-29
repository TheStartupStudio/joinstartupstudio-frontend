import React, { useState, useEffect, useContext } from 'react'
import { StudentCountContext } from '../../components/MyStudents/studentCountContext'

export default function StudentData(props) {
  const { state } = useContext(StudentCountContext)

  return (
    <div
      style={{
        backgroundColor: '#F8F7F7',
        borderRadius: 0
      }}
      className={`dashboard-notification py-3 mb-2`}
    >
      <h3 className='py-2 px-3 mb-0 text-lg-center'>Student Data</h3>
      <div className='row px-3'>
        <div className='col-10'>
          <p className='mt-2 mb-0'>Total Students</p>
        </div>
        <div className='col-1 text-left'>
          <p className='mt-2 mb-0'>{state.studentsCount}</p>
        </div>
      </div>
      <div className='row px-3'>
        <div className='col-10'>
          <p className='mt-2 mb-0'>Active in Last 7 Days</p>
        </div>
        <div className='col-1 text-left'>
          <p className='mt-2 mb-0'>{state.recentlyActive}</p>
        </div>
      </div>
    </div>
  )
}
