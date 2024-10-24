import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { SelectInput, TextInput } from '../../../ui/ContentItems'
import { useForm } from '../../../hooks/useForm'
import { useValidation } from '../../../hooks/useValidation'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import useIsFormEmpty from '../../../hooks/useIsFormEmpty'

const AddSchool = ({ data, show, onHide, mode }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    code: '',
    name: '',
    domain: '',
    level: ''
  }

  const { formData, handleChange, handleChangeSelect } = useForm(
    initialState,
    null,
    mode,
    loading
  )
  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted)
  const isFormEmpty = useIsFormEmpty(formData)
  const isFormEdited = JSON.stringify(formData) === JSON.stringify(data)
  const isDisabled = mode === 'edit' ? isFormEdited : isFormEmpty

  const submitHandler = async (e) => {
    e.preventDefault()
    handleSubmit(async () => {
      setLoading(true)
      if (mode === 'edit') {
        console.log('edit mode')
      } else {
        await axiosInstance.post('/university', formData).then((res) => {
          if (res.status === 200) {
            toast.success('New school created successfully!')
          }
        })

        onHide()
        setLoading(false)
      }
    })
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      keyboard={false}
      size='lg'
      id='edit_briefing-modal'
    >
      <Modal.Header className='position-relative '>
        <Modal.Title className='px-3 py-3'>ADD NEW SCHOOL</Modal.Title>
        <div
          className={`check-button ${isDisabled ? 'disabled' : ''}`}
          onClick={!isDisabled ? submitHandler : null}
        >
          <FontAwesomeIcon icon={faCheck} />
        </div>
      </Modal.Header>
      <Modal.Body className='briefing-modal-body'>
        <Row>
          <Col className='me-auto col-12'>
            <QuillEditorBox
              title='Code'
              name='code'
              value={formData.code}
              onChange={handleChange}
              showError={formSubmitted}
              error={errors.code}
            />
          </Col>
        </Row>
        <Row>
          <Col className='col-12'>
            <QuillEditorBox
              title='Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              showError={formSubmitted}
              error={errors.name}
            />
          </Col>
        </Row>
        <Row>
          <Col className='col-12'>
            <TextInput
              title='Domain'
              name='domain'
              value={formData.domain}
              handleChange={handleChange}
              showError={formSubmitted}
              error={errors.domain}
            />
          </Col>
        </Row>
        <Row>
          <Col className='col-12'>
            <SelectInput
              title='Level'
              name='level'
              value={formData.level}
              options={[
                { value: 'LS', label: 'LS', name: 'level' },
                { value: 'MS', label: 'MS', name: 'level' },
                { value: 'HS', label: 'HS', name: 'level' },
                { value: 'HE', label: 'HE', name: 'level' }
              ]}
              handleChange={handleChangeSelect}
              showError={formSubmitted}
              error={errors.level}
            />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default AddSchool
