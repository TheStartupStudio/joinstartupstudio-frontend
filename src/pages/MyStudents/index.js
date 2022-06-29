import React, { useState } from 'react'
import { ActiveStudents } from '../../components/ActiveStudents'
import StudentsTable from '../../components/StudentsTable/studentsTable'
import StudentData from '../../components/MyStudents/studentData'
import './index.css'
import { StudentCountProvider } from '../../components/MyStudents/studentCountContext'

const MyStudents = () => {
  return (
    <StudentCountProvider>
      <div id='main-body'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12 col-md-12 col-xl-9'>
              <div className='account-page-padding'>
                <h3 className='page-title'>STUDENT MANAGEMENT</h3>
                <h3 className='page-description '>
                  Manage your student enrollment.
                </h3>
                <div className='mt-5 pt-1'>
                  <div className='row'>
                    <div className='col-md-12 col-lg-8'>
                      <h3
                        className='page-title'
                        style={{ textTransform: 'capitalize' }}
                      >
                        Recently Active Students
                      </h3>
                    </div>
                    <ActiveStudents />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-xl-3'>
              <div className='account-page-padding'>
                <StudentData />
              </div>
            </div>
            <div className='col-12'>
              <div className='account-page-padding pt-0'>
                <h3 className='page-title'>VIEW ALL STUDENTS</h3>
                <StudentsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentCountProvider>
  )
}

export default MyStudents
