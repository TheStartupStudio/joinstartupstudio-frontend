import React, { useEffect, useState } from 'react'
import ArchiveSelector from '../../../components/ArchiveSelector/ArchiveSelector'
import ArchiveModal from '../../../components/Modals/ArchiveModal'
import DeleteArchiveModal from '../../../components/Modals/DeleteArchiveModal'

const ArchiveManager = (props) => {
  const archiveOptionTitle = () => {
    if (props.title === 'teamMeeting') {
      return 'Team Meeting'
    } else if (props.title === 'feedback') {
      return 'Feedback'
    } else if (props.title === 'mentorMeeting') {
      return 'Mentor Meeting'
    }
  }

  return (
    <>
      <div className='col-12'>
        <div>{props.tableContent}</div>
        <div
          className={'d-flex justify-content-between py-1 mt-2'}
          style={{ gap: '20px' }}
        >
          <div
            className='col-md-6 px-1 d-flex justify-content-center align-items-center'
            style={{
              width: '47%'
            }}
          >
            <ArchiveSelector
              archiveTitle={props.title}
              archives={props.archives}
              selectedArchive={props.selectedArchive}
              handleSelectedArchive={props.handleSelectedArchive}
            />
          </div>
          {props.isEditable && (
            <div
              className='col-md-6 px-1'
              style={{
                width: '50%'
              }}
            >
              <button
                style={{
                  backgroundColor: '#51c7df',
                  color: '#fff',
                  fontSize: 14,
                  padding: 10,
                  fontWeight: 500
                }}
                onClick={
                  props.hasUnsavedChanges
                    ? props.onOpenArchiveModal
                    : props.onAdd
                }
                className='px-4 py-2 border-0 color transform text-uppercase  w-100 my-1 team-add-btn'
              >
                Add a new {archiveOptionTitle()}
              </button>
            </div>
          )}
          {props.showArchiveModal && props.hasUnsavedChanges && (
            <ArchiveModal
              show={props.showArchiveModal}
              onHide={props.onCloseArchiveModal}
              saveChanged={props.saveChanged}
              saveUnChanged={props.saveUnChanged}
              onSave={props.onAdd}
              title={props.title}
            />
          )}
          {props.showDeleteArchiveModal && (
            <DeleteArchiveModal
              show={props.showDeleteArchiveModal}
              onHide={props.onCloseDeleteArchiveModal}
              onDelete={props.onDelete}
              title={props.title}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ArchiveManager
