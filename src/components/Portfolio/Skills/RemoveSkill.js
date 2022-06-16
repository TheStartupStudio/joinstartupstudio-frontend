import React from 'react'
import { Modal, ModalBody, Form } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import SkillBoxButton from './skillBox'

export default function RemoveSkill(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className='edit-modal'
    >
      <Modal.Header className='edit-modal p-0 mx-4 edit-top-title'>
        <h4 className='mt-4 mb-0'>
          <IntlMessages id='portfolio.edit_top_skills' />
        </h4>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className='px-4'>
        <Form.Label className='edit-modal-box-input-title'>
          <span>Edit Skill</span>
        </Form.Label>
        <div className='mt-4'>
          {props?.userSkill &&
            props.userSkill.map((data) => (
              <SkillBoxButton
                from={'removeModal'}
                key={data.id}
                data={data}
                editRemoveSkill={(skill) => props.editRemoveSkill(skill)}
                setRemoveSkill={(data) => props.setRemoveSkill(data)}
                selcetedSkills={props.selcetedSkills}
                setSelectedSkills={(data) => props.setSelectedSkills(data)}
                onSave={() => props.onSave()}
              />
            ))}
        </div>
      </Modal.Body>
      <Modal.Footer className='border-0 py-0 my-0 mb-2 position-relative'>
        <div className='row p-0 mb-3'>
          <div className='col-md-11'>
            <button
              className='float-end edit-account mt-4 mb-4'
              disabled={props.loading}
              onClick={() => props.onSave()}
            >
              {props.loading ? (
                <IntlMessages id='general.loading' />
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
