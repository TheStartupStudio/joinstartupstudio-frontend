import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { TextEditor, TextInput } from '../../../../ui/ContentItems'
import { useForm } from '../../../../hooks/useForm'
import { useValidation } from '../../../../hooks/useValidation'
import useIsFormEmpty from '../../../../hooks/useIsFormEmpty'
import { toast } from 'react-toastify'
import {
  createLesson,
  deleteLesson,
  editLesson
} from '../../../../redux/taskLessons/actions'
import { useDispatch } from 'react-redux'

const AddLessonModal = ({
  show,
  data,
  onHide,
  mode,
  journalId,
  user,
  type,
  category
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    type,
    category,
    taskJournalId: category === 'task' ? journalId : null,
    weekJournalId: category === 'week' ? journalId : null,
    userId: user.id,
    title: '',
    lessonPlan: '',
    assignment: ''
  }

  const { formData, handleChange, handleChangeEditor } = useForm(
    initialState,
    data,
    mode,
    loading
  )

  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted)

  const deleteLessonHandler = () => {
    const res = dispatch(deleteLesson(formData.id))

    if (res) {
      toast.success('Lesson deleted successfully!')
      onHide()
    } else {
      toast.error('Something went wrong')
    }
  }

  const submitHandler = () => {
    handleSubmit(async () => {
      setLoading(true)
      if (mode === 'add') {
        const lessonData = {
          ...formData,
          type,
          category,
          ...(type === 'task'
            ? { taskJournalId: journalId }
            : { taskJournalId: null }),
          ...(type === 'week'
            ? { weekJournalId: journalId }
            : { weekJournalId: null })
        }
        const res = dispatch(createLesson(lessonData))
        if (res) {
          toast.success('Lesson addedd successfully!')
          onHide()
          setLoading(false)
        } else {
          toast.error('Something went wrong!')
        }
      } else {
        const res = dispatch(
          editLesson(formData.id, { ...formData, journalId })
        )
        if (res) {
          toast.success('Lesson updated successfully!')
          onHide()
          setLoading(false)
        } else {
          toast.error('Something went wrong!')
        }
      }
    })
  }

  const isFormEmpty = useIsFormEmpty(formData)
  const isFormEdited = JSON.stringify(formData) === JSON.stringify(data)
  const isDisabled = mode === 'edit' ? isFormEdited : isFormEmpty

  return (
    <Modal
      show={show}
      onHide={onHide}
      keyboard={false}
      size="lg"
      id="edit_briefing-modal"
    >
      <Modal.Header className="position-relative ">
        <Modal.Title className="px-3 py-3">
          {mode === 'add' ? 'ADD LESSON' : 'EDIT LESSON'}
        </Modal.Title>
        <di
          className={`check-button  ${isDisabled ? 'disabled' : ''}`}
          onClick={!isDisabled ? submitHandler : null}
        >
          <FontAwesomeIcon icon={faCheck} />
        </di>
      </Modal.Header>
      <Modal.Body className="briefing-modal-body">
        <Row>
          <Col className="me-auto col-12">
            <TextInput
              title="Title"
              name="title"
              value={formData.title}
              handleChange={handleChange}
              showError={formSubmitted}
              error={errors.title}
            />
          </Col>
        </Row>
        <Row>
          <Col className="me-auto col-12">
            <TextEditor
              title="Lesson Plan / Task"
              name="lessonPlan"
              value={formData.lessonPlan}
              handleChange={handleChangeEditor}
              showError={formSubmitted}
              error={errors.lessonPlan}
            />
          </Col>
        </Row>
        <Row>
          <Col className="me-auto col-12">
            <TextEditor
              title="Assignment"
              name="assignment"
              value={formData.assignment}
              handleChange={handleChangeEditor}
              showError={formSubmitted}
              error={errors.assignment}
            />
          </Col>
        </Row>
        {mode === 'edit' && (
          <p
            className="d-flex justify-content-end cursor-pointer pt-3"
            onClick={() => deleteLessonHandler()}
          >
            DELETE LESSON
          </p>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default AddLessonModal
