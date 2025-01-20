import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import './style.css'
import { useDispatch } from 'react-redux'
import {
  createBriefingStart,
  deleteBriefingStart,
  editBriefingStart
} from '../../redux/header/Actions'
import { useForm } from '../../hooks/useForm'
import { useValidation } from '../../hooks/useValidation'
import { DateInput, TextEditor, TextInput } from '../../ui/ContentItems'
import useIsFormEmpty from '../../hooks/useIsFormEmpty'
import { QuillEditorBox } from '../../ui/ContentItems'

const BriefingEditor = ({ briefing, user, mode, onHide, show, hideDelete }) => {
  const dispatch = useDispatch()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const initialState = {
    source: '',
    link: '',
    date: new Date(),
    title: '',
    synopsis: '',
    discussionPoints: '',
    discussionQuestion: '',
    user_id: user.id,
    isSelected: false
  }
  const { formData, handleChange, handleChangeEditor } = useForm(
    initialState,
    briefing,
    mode
  )
  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted)

  const submitHandler = () => {
    handleSubmit(() => {
      if (mode === 'edit') {
        dispatch(editBriefingStart(formData, briefing.id))
      } else {
        dispatch(createBriefingStart(formData))
        onHide()
      }
    })
  }

  const deleteBriefing = () => {
    dispatch(deleteBriefingStart(briefing.id))
    onHide()
  }

  const isFormEmpty = useIsFormEmpty(formData)
  const isFormEdited = JSON.stringify(formData) === JSON.stringify(briefing)
  const isDisabled = mode === 'edit' ? isFormEdited : isFormEmpty

  return (
    <Modal
      show={show}
      onHide={onHide}
      keyboard={false}
      size='lg'
      id='edit_briefing-modal'
    >
      <Modal.Header className='position-relative '>
        <Modal.Title className='px-3 py-3'>EDIT BRIEFING</Modal.Title>
        <div
          className={`check-button ${isDisabled ? 'disabled' : ''}`}
          onClick={!isDisabled ? submitHandler : null}
        >
          <FontAwesomeIcon icon={faCheck} />
        </div>
      </Modal.Header>
      <Modal.Body className='briefing-modal-body'>
        <Row>
          <Col className='me-auto col-3'>
            <TextInput
              title='Link'
              name='link'
              value={formData.link}
              handleChange={handleChange}
              showError={formSubmitted}
              error={errors.link}
            />
          </Col>
          <Col className=' col-3'>
            <TextInput
              title='Source'
              name='source'
              value={formData.source}
              handleChange={handleChange}
              showError={formSubmitted}
              error={errors.source}
            />
          </Col>
          <Col className='col-5'>
            <DateInput
              title='Date'
              name='date'
              value={formData.date}
              handleChange={handleChange}
              showError={formSubmitted}
              error={errors.date}
            />
          </Col>
        </Row>
        <Row>
          <Col className='col-12'>
            <TextInput
              title='Title'
              name='title'
              value={formData.title}
              handleChange={handleChange}
              showError={formSubmitted}
              error={errors.title}
            />
          </Col>
        </Row>
        <Row>
          <Col className='col-12'>
            <QuillEditorBox
              title='Synopsis'
              name='synopsis'
              value={formData.synopsis}
              onChange={handleChangeEditor}
              showError={formSubmitted}
              error={errors.synopsis}
            />
          </Col>
        </Row>
        <Row>
          <Col className='col-12'>
            <TextInput
              title='Discussion Question'
              name='discussionQuestion'
              value={formData.discussionQuestion}
              handleChange={handleChange}
              showError={formSubmitted}
              error={errors.discussionQuestion}
            />
          </Col>
        </Row>
        <Row>
          <Col className='col-12'>
            <QuillEditorBox
              title='Discussion Points'
              name='discussionPoints'
              value={formData.discussionPoints}
              onChange={handleChangeEditor}
              showError={formSubmitted}
              error={errors.discussionPoints}
            />
          </Col>
        </Row>
        {!hideDelete && ( 
        <p
          className='d-flex justify-content-end cursor-pointer pt-3'
          onClick={() => deleteBriefing()}
        >
          DELETE NEWS BRIEFINGS
        </p>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default BriefingEditor
