import React from 'react'
import { Modal, ModalBody, Form } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import SkillBox from './oldskillBox'

export default function AddPersonalSkill(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className='edit-modal'
      id=''
    >
      <Modal.Header className='edit-modal p-0 mx-5 general-modal-header'>
        <h3 className='mt-4 mb-0'>
          <IntlMessages id='my_account.add_my_personal_profile_tags' />
        </h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <ModalBody className={`px-5 mb-0 pb-0 mb-5`}>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>
            <IntlMessages id='my_account.add_my_profile_tags' />
          </Form.Label>
          <Form.Control
            className='mt-2'
            type='text'
            value={props.skillname}
            onChange={(e) => props.setskillname(e.target.value)}
          />
        </Form.Group>
        {props.skillname.length > 0 && (
          <SkillBox liveskillname={props.skillname} />
        )}
      </ModalBody>

      <Modal.Footer className='border-0 py-0 my-0 mb-2'>
        <div className='row p-0 mb-3'>
          <div className='col-md-11'>
            <button
              className='float-end edit-account mt-4'
              disabled={props.loading}
              onClick={() => {
                props.onSave()
              }}
            >
              {props.loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <IntlMessages id='general.save' />
              )}
            </button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
