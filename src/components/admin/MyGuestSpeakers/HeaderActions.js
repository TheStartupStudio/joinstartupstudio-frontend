import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { CustomDropdown, CustomSearchBar } from '../MySchool/ContentItems'
import useModalState from '../../../hooks/useModalState'
import ArchiveAppModal from './ArchiveAppModal'

const HeaderActions = ({ setSearchQuery, selectedRows }) => {
  const [modals, setModalState] = useModalState()
  return (
    <Row className='py-3 m-0 justify-content-end'>
      <Col md='4'>
        <CustomSearchBar onChange={(e) => setSearchQuery(e.target.value)} />
      </Col>
      <Col md='2' className='d-flex '>
        <CustomDropdown
          title='Bulk Actions'
          options={[{ name: 'Archive App', value: 'archive-app' }]}
          // onClick={() => {
          //   setModalState('archiveApplicationModal', true)
          // }}
          btnClassName={'gray-border'}
        />
      </Col>

      {modals.archiveApplicationModal > 0 && (
        <>
          <ArchiveAppModal
            show={modals.archiveApplicationModal}
            onHide={() => setModalState('archiveApplicationModal', false)}
            message={'Student(s) updated.'}
            selectedRows={selectedRows}
          />
        </>
      )}
    </Row>
  )
}

export default HeaderActions
