import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { CustomDropdown, CustomSearchBar } from '../MySchool/ContentItems'

const HeaderActions = ({ setSearchQuery }) => {
  return (
    <Row className='py-3 m-0 justify-content-end'>
      <Col md='4'>
        <CustomSearchBar onChange={(e) => setSearchQuery(e.target.value)} />
      </Col>
      <Col md='2' className='d-flex '>
        <CustomDropdown
          title='Bulk Actions'
          options={[
            {
              name: 'Transfer User',
              value: 'trasnfer-user'
            },
            { name: 'Delete App', value: 'delete-app' }
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
    </Row>
  )
}

export default HeaderActions
