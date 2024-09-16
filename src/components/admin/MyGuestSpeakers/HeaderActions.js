import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { CustomDropdown, CustomSearchBar } from '../MySchool/ContentItems'
import useModalState from '../../../hooks/useModalState'
import ArchiveAppModal from './ArchiveAppModal'
import TransferModal from './TransferModal'

const HeaderActions = ({
  setSearchQuery,
  selectedRows,
  cohorts,
  programs,
  levels,
  instructors
}) => {
  console.log('selectedRows', selectedRows)
  const [modals, setModalState] = useModalState()
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
              value: 'transfer-user'
            },
            { name: 'Archive App', value: 'archive-app' }
          ]}
          // onClick={(newValue) => {
          //   newValue?.value === 'transfer-user'
          //     ? setModalState('transferAcademyUserModal', true)
          //     : setModalState('archiveApplicationModal', true)
          // }}
          btnClassName={'gray-border'}
        />
      </Col>

      {modals.transferAcademyUserModal && (
        <TransferModal
          show={modals.transferAcademyUserModal}
          onHide={() => setModalState('transferAcademyUserModal', false)}
          user={selectedRows.user}
          selectedRows={selectedRows}
          instructors={instructors}
          levels={levels}
          programs={programs}
          cohorts={cohorts}
        />
      )}

      {modals.archiveApplicationModal > 0 && (
        <>
          <ArchiveAppModal
            show={modals.archiveApplicationModal}
            onHide={() => setModalState('archiveApplicationModal', false)}
            message={'Student(s) updated.'}
          />
        </>
      )}
    </Row>
  )
}

export default HeaderActions
