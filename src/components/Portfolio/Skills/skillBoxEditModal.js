import React from 'react'
import { Modal, ModalBody, Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import IntlMessages from '../../../utils/IntlMessages'
import SkillBoxButton from './skillBox'

export const SkillBoxEditModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className='edit-modal '
    >
      <Modal.Header className='edit-modal p-0 mx-4 general-modal-header'>
        <h3 className='mt-4 mb-0 edit-modal-box-title'>
          <IntlMessages id='portfolio.edit_top_skills' />
        </h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <ModalBody className={`mb-4 pb-0 px-4 mb-0`}>
        <Form.Group className='mb-5' controlId='formBasicEmail'>
          <Form.Label className='edit-modal-box-input-title'>
            <IntlMessages id='portfolio.Add_Skills' />
          </Form.Label>
          <FormattedMessage id='portfolio.Type_skill'>
            {(placeholder) => (
              <Form.Control
                className='mt-2 input py-2 ps-4'
                type='text'
                value={props.newSkill}
                placeholder={placeholder}
                onChange={(e) => props.setNewSkill(e.target.value)}
              />
            )}
          </FormattedMessage>
          {props.newSkill && (
            <button
              className={`px-4 py-2 btn border rounded me-2 my-2 skills-button`}
              style={{ wordBreak: 'break-all' }}
              value={props.newSkill}
              onClick={(data) => {
                let skillExists = false
                props.allSkill.forEach((element) => {
                  if (element.name === data.target.value) skillExists = true
                })

                if (!skillExists) {
                  props.setNewSkill()
                  props.setAllSkills((old) => [
                    ...old,
                    { name: data.target.value }
                  ])
                }
                props.setNewSkill('')
              }}
            >
              {props.newSkill}
            </button>
          )}
        </Form.Group>
        <div>
          <h6 className='edit-modal-box-suggested'>
            <IntlMessages id='portfolio.Suggested_Skills_Based_on_My_Profile' />
          </h6>
          {props.recomendetSkill &&
            props.recomendetSkill.map((data, index) => (
              <SkillBoxButton
                key={index}
                data={data}
                from={'addModal'}
                selcetedSkills={props.selcetedSkills}
                setSelectedSkills={(data) => props.setSelectedSkills(data)}
                editAddedSelectedSkill={(data) =>
                  props.editAddedSelectedSkill(data)
                }
              />
            ))}
        </div>
        <div className='row p-0 mb-2'>
          <div className='col-md-12'>
            <button
              className='float-end edit-account mt-2'
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
      </ModalBody>
    </Modal>
  )
}
