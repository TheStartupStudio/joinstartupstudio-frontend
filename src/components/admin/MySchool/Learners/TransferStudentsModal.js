import React, { useState } from 'react'
import {
  faCheck,
  faExclamationTriangle,
  faUserEdit,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Modal, Row } from 'react-bootstrap'
import { CustomDropdown, SubmitButton } from '../ContentItems'
import { useValidation } from '../../../../hooks/useValidation'
import { useForm } from '../../../../hooks/useForm'
import useIsFormEmpty from '../../../../hooks/useIsFormEmpty'
import { CustomInput } from '../../../../ui/ContentItems'

const TransferStudentsModal = ({
  show,
  onHide,
  user,
  instructors = [],
  onSuccess,
  periods,
  mode
}) => {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    name: '',
    instructor_id: '',
    levels: [],
    programs: [],
    period: ''
  }

  const { formData, handleChangeSelect } = useForm(initialState, user, loading)

  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted)

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const submitHandler = () => {
    handleSubmit(async () => {
      setLoading(true)
    })
  }
  const isFormEmpty = useIsFormEmpty(formData, ['profession', 'deactivated'])
  const isFormEdited = JSON.stringify(formData) === JSON.stringify(user)
  const isDisabled = mode === 'edit' ? isFormEdited : isFormEmpty

  return (
    <>
      <Modal
        show={show}
        className={''}
        onHide={() => {
          onHide()
        }}
        centered
      >
        <Modal.Header className='position-relative p-3'>
          <Modal.Title
            className='px-3 py-3 d-flex fw-normal flex-column'
            style={{ fontSize: '16px' }}
          >
            <div
              className='d-flex align-items-center justify-content-center mb-3'
              style={{
                width: '36px',
                height: '36px',
                background: '#C8CDD880',
                fontSize: '15px',
                borderRadius: '50%'
              }}
            >
              <FontAwesomeIcon icon={faUserEdit} />
            </div>
            {mode === 'add' ? 'Add Instructor' : 'Edit Instructor Details'}
          </Modal.Title>
          {mode !== 'edit' ? (
            <div className={`check-button fw-bold`} onClick={() => onHide()}>
              X
            </div>
          ) : (
            <div
              className={`check-button  ${isDisabled ? 'disabled' : ''}`}
              onClick={!isDisabled ? submitHandler : null}
            >
              <FontAwesomeIcon icon={faCheck} />
            </div>
          )}
        </Modal.Header>
        <Modal.Body>
          <Row className='m-0 transfer-body_container'>
            <Col md='6'>
              <p>User details</p>
              <label htmlFor='name'>Student Name</label>
              <CustomInput type={'text'} name='name' value={user.name} />
              <label htmlFor='levels'>Student Levels</label>
              <CustomInput
                type={'text'}
                name='levels'
                value={user.levels.map((level) => level.name).join(', ')}
              />
              <label htmlFor='instructor_id'>Current Instructor</label>
              <CustomInput
                type={'text'}
                name='instructor_id'
                value={user.Instructor?.User?.name}
              />
            </Col>
            <Col md='6'>
              <p style={{ opacity: '0' }}>User details</p>
              <div className='mb-5'>
                <label htmlFor='instructor_id'>School</label>
                <CustomInput
                  type={'text'}
                  name='school'
                  value={user.University?.name}
                />
                <label htmlFor='instructor_id'>Program</label>
                <CustomInput
                  type={'text'}
                  name='program'
                  value={
                    user.programs.length
                      ? user.programs.map((program) => program.name).join(', ')
                      : 'No program'
                  }
                />
              </div>
              <div className='pb-3'>
                <p className='m-0'>Transfer to Instructor</p>
                <CustomDropdown
                  isSelectable
                  exclusive
                  name='instructor_id'
                  btnClassName={'gray-border'}
                  options={instructors?.map((instructor) => {
                    return {
                      name: instructor.User.name,
                      value: instructor.User.name,
                      id: instructor.id
                    }
                  })}
                  isOpen={openDropdown === 'instructors'}
                  setOpenDropdown={() => handleDropdownClick('instructors')}
                  onClick={(event) =>
                    handleChangeSelect(event, 'instructor_id')
                  }
                  showError={formSubmitted}
                  error={errors.instructor_id}
                  preselectedOptions={[]}
                />
              </div>

              <div className='pb-3'>
                <p className='m-0'>Select Class Period</p>
                <CustomDropdown
                  isSelectable
                  exclusive
                  name='period'
                  btnClassName={'gray-border'}
                  options={periods?.map((period) => {
                    return {
                      name: period.name,
                      value: period.name,
                      id: period.id
                    }
                  })}
                  isOpen={openDropdown === 'period'}
                  setOpenDropdown={() => handleDropdownClick('period')}
                  onClick={(event) => handleChangeSelect(event, 'period')}
                  showError={formSubmitted}
                  error={errors.period}
                  preselectedOptions={
                    mode === 'edit'
                      ? [
                          {
                            name: formData.period?.name,
                            id: formData.period?.id
                          }
                        ]
                      : []
                  }
                />
              </div>
            </Col>
          </Row>
          <Col md='12' className='d-flex justify-content-end'>
            <Row className='m-0 col-12 justify-content-between'>
              <span className='col-6 d-flex align-items-center'>
                <p href='#' className='m-0 cursor-pointer'>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className='pe-2'
                  />
                  Deny Transfer Request
                </p>
              </span>
              <SubmitButton
                onClick={submitHandler}
                text={
                  loading ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    <Row className='m-0 align-items-center'>
                      <span>ACCEPT TRANSFER REQUEST</span>
                    </Row>
                  )
                }
                background={'#52C7DE'}
                color={'#fff'}
                border={'none'}
              />
            </Row>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default TransferStudentsModal
