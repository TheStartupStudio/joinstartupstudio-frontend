import React, { useState } from 'react'
import { ActiveStudents } from '../../components/ActiveStudents'
import StudentsTable from '../../components/Students/studentsTable'
import AddStudentsModal from '../../components/MyStudents/AddStudentsModal/addStudentsModal'
import EditBlunk from '../../components/MyStudents/AddStudentsModal/editBlunk'
import './index.css'
const MyStudents = () => {
  const [addStudent, setAddStudents] = useState(false)
  const [editBlunk, setEditBlunk] = useState(false)

  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-xl-9'>
            <div className='account-page-padding page-border'>
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
                <p
                  className='setAddStudents'
                  role={'button'}
                  onClick={() => setAddStudents(true)}
                >
                  Add Users
                </p>

                <p
                  className='setAddStudents'
                  role={'button'}
                  onClick={() => setEditBlunk(true)}
                >
                  Edit Blunk
                </p>
              </div>
              <div>
                <StudentsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddStudentsModal
        show={addStudent}
        onHide={() => setAddStudents(false)}
      />
      <EditBlunk show={editBlunk} onHide={() => setEditBlunk(false)} />
    </div>
  )
}

export default MyStudents
