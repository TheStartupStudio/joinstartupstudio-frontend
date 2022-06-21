import React, { useState } from 'react'
import { ActiveStudents } from '../../components/ActiveStudents'
import AddStudentsModal from '../../components/MyStudents/AddStudentsModal/addStudentsModal'

const MyStudents = () => {
  const [addStudent, setAddStudents] = useState(false)

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
                  className='testsetAddStudents'
                  onClick={() => setAddStudents(true)}
                >
                  test
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddStudentsModal
        show={addStudent}
        onHide={() => setAddStudents(false)}
      />
    </div>
  )
}

export default MyStudents
