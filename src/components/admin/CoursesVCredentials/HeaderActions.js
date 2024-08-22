import React from 'react'
import { Col, Row } from 'react-bootstrap'
import {
  CustomDropdown,
  CustomGradientButton,
  CustomSearchBar
} from '../MySchool/ContentItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import useModalState from '../MySchool/useModalState'
import CourseVCredentialsActions from './CourseVCredentialsActions'

const HeaderActions = ({ setSearchQuery }) => {
  const [modals, setModalState] = useModalState()
  return (
    <>
      <Row className='py-3 m-0 justify-content-end'>
        <Col md='4'>
          <CustomSearchBar
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search by course name'
          />
        </Col>
        <Col md='2' className='d-flex justify-content-end'>
          <CustomDropdown
            title='Bulk Actions'
            options={[
              {
                name: 'Deactivate',
                value: 'deactivate'
              },
              { name: 'Remove', value: 'remove' }
            ]}
            // onClick={(newValue) => {
            //   newValue?.value === 'edit'
            //     ? handleBulkEditAction()
            //     : newValue?.value === 'deactivate'
            //     ? handleBulkDeactiveAction()
            //     : handleBulkNextYearAction()
            // }}
            btnClassName={'instructor'}
          />
        </Col>

        <CustomGradientButton
          className={'me-2 '}
          onClick={() => setModalState('addCoursesVCredentialModal', true)}
        >
          <p className='m-0 p-0'>Add Courses & Credentials</p>
          <FontAwesomeIcon icon={faPlus} className='me-2' />
        </CustomGradientButton>
      </Row>

      {modals.addCoursesVCredentialModal && (
        <CourseVCredentialsActions
          show={modals.addCoursesVCredentialModal}
          onHide={() => setModalState('addCoursesVCredentialModal', false)}
          mode='add'
        />
      )}
    </>
  )
}

export default HeaderActions
