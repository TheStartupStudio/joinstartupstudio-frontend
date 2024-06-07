import React from 'react'
import { useParams } from 'react-router-dom'
import MyPerformanceData from '../../../pages/MyPerformanceData'
import StudentsTable from '../../StudentsTable/studentsTable'

const InstructorData = () => {
  const { id } = useParams()

  return (
    <div>
      <MyPerformanceData instructorId={id} />
      <div className="col-12">
        <div className="account-page-padding pt-0">
          <h3 className="page-title">INSTRUCTOR STUDENTS</h3>
          <StudentsTable instructorId={id} />
        </div>
      </div>
    </div>
  )
}

export default InstructorData
