import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as actions from '../../redux/reflectionsTable/Actions'

export const TableReflectionModal = (props) => {
  const navigate = useHistory()
  const dispatch = useDispatch()
  const reflectionsTable = useSelector((state) => state.reflectionsTable)

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      id="table-reflections-modal"
      className="table-reflections-modal"
    >
      <Modal.Header className="connection-modal-header general-modal-header mx-5  mt-3">
        <h5 style={{ marginTop: 40 }} className={'d-flex align-items-end'}>
          {props.tableTitle}
        </h5>

        <button
          type="button"
          className="btn-close mb-2"
          aria-label="Close"
          onClick={props.onHide}
        ></button>
      </Modal.Header>
      <Modal.Body className={'pt-0 mx-5  p-0'}>
        <div className="mb-5 blocked-user-modal ">
          <h4>{props.title}</h4>
          <hr />
          <div>
            {reflectionsTable.subtitle ? (
              <h4>{reflectionsTable.subtitle}</h4>
            ) : null}
            <textarea
              style={{ width: '100%', height: '100px' }}
              onChange={(e) => dispatch(actions.setContent(e.target.value))}
              defaultValue={reflectionsTable.content}
            ></textarea>
          </div>
          <div className="text-end">
            <button
              className="cancel-subscription-button accept-request-button"
              style={{ backgroundColor: '#F2359D', width: '120px' }}
              onClick={() => {
                props.onSave()
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
