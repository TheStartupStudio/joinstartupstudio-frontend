import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { StudentCountContext } from '../../components/MyStudents/studentCountContext'
import axiosInstance from '../../utils/AxiosInstance'

export default function StudentData(props) {
  const { state, dispatch } = useContext(StudentCountContext)

  useEffect(() => {
    if (props?.fetchStudents) {
      getStudents()
    }
  }, [])

  const getStudents = async () => {
    await axiosInstance
      .get('/instructor/my-students')
      .then((res) => {
        if (res.data.students.length) {
          console.log('res.data.students.length :>> ', res.data.students.length)
          dispatch({
            type: 'studentsCount',
            studentsCount: res.data.students.length
          })
          var today = moment().startOf('day')

          const count = res.data.students.filter((student) => {
            var createdDate = moment(student.createdAt, 'YYYY-MM-DD').startOf(
              'day'
            )
            var diff = today.diff(createdDate, 'days')

            if (diff <= 7) {
              return true
            }

            return false
          }).length

          dispatch({ type: 'recentlyActive', recentlyActive: count })
        }
      })
      .catch((e) => e)
  }

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
