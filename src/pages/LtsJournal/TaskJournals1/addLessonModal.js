import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import {
  TextEditor,
  TextInput
} from '../../../components/Briefings/ContentItems'

const AddLessonModal = ({ show, onHide, mode }) => {
  const initialState = {
    title: '',
    lessonPlan: '',
    assignment: ''
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      keyboard={false}
      size="lg"
      id="edit_briefing-modal"
    >
      <Modal.Header className="position-relative ">
        <Modal.Title className="px-3 py-3">EDIT BRIEFING</Modal.Title>
        <div
          className={`close-briefing-editor p-3 `}
          // className={`close-briefing-editor p-3 ${
          //   isDisabled ? 'disabled' : ''
          // }`}
          // onClick={!isDisabled ? submitHandler : null}
        >
          <FontAwesomeIcon icon={faCheck} />
        </div>
      </Modal.Header>
      <Modal.Body className="briefing-modal-body">
        <Row>
          <Col className="me-auto col-12">
            <TextInput
              title="Title"
              name="title"
              // value={formData.link}
              // handleChange={handleChange}
              // showError={formSubmitted}
              // error={errors.link}
            />
          </Col>
        </Row>
        <Row>
          <Col className="me-auto col-12">
            <TextEditor
              title="Lesson Plan / Task"
              name="lessonPlan"
              //  value={formData.discussionPoints}
              //  handleChange={handleChangeEditor}
              //  showError={formSubmitted}
              //  error={errors.discussionPoints}
            />
          </Col>
        </Row>
        <Row>
          <Col className="me-auto col-12">
            <TextEditor
              title="Assignment"
              name="assignment"
              //  value={formData.discussionPoints}
              //  handleChange={handleChangeEditor}
              //  showError={formSubmitted}
              //  error={errors.discussionPoints}
            />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default AddLessonModal
