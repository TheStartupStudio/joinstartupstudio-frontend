import {
  faCheck,
  faUserLock,
  faUserMinus,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import {
  CustomTextarea,
  CustomDropdown,
  CustomInput,
  SubmitButton
} from '../MySchool/ContentItems'
import { useValidation } from '../../../hooks/useValidation'
import { useForm } from '../../../hooks/useForm'
import LtsCheckbox from '../../../ui/LtsCheckbox'
import LtsFileDropzone from '../../../ui/LtsFileDropzone'

const CourseVCredentialsActions = ({
  show,
  onHide,
  mode,
  onSuccess,
  resetPasswordFromEdit = () => {},
  deleteUserFromEdit = () => {}
}) => {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    universityId: '',
    email: '',
    name: '',
    password: '',
    levels: [],
    programs: [],
    period: '',
    profession: 'Instructor',
    deactivated: false
  }

  const {
    formData,
    handleChange,
    handleChangeCheckbox,
    handleChangeDropdown,
    handleChangeSelect
  } = useForm(initialState, mode, loading)

  let optionalFields = mode !== 'edit' ? ['deactivated', 'period'] : []

  const validatePayload =
    mode === 'edit'
      ? {
          universityId: formData.universityId,
          universityName: formData.universityName,
          name: formData.name,
          email: formData.email,
          profession: formData.profession,
          programs: formData.programs,
          levels: formData.levels
        }
      : formData

  const { errors, handleSubmit } = useValidation(
    validatePayload,
    setFormSubmitted,
    optionalFields
  )

  // const isFormEmpty = useIsFormEmpty(formData, ['profession', 'deactivated'])
  // const isFormEdited = JSON.stringify(formData) === JSON.stringify(user)
  // const isDisabled = mode === 'edit' ? isFormEdited : isFormEmpty
  const isDisabled = true

  return (
    <>
      <Modal
        show={show}
        className={'courseVcredential-modal mb-5 pb-5 myCustomModal'}
        onHide={() => {
          onHide()
        }}
        centered
        dialogClassName='custom-modal-lg'
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
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            {mode === 'add'
              ? 'Add Course or Credential'
              : 'Edit Courses or Credentials'}
          </Modal.Title>
          {mode !== 'edit' ? (
            <div className={`check-button fw-bold`} onClick={() => onHide()}>
              X
            </div>
          ) : loading ? (
            <div className={`check-button fw-bold`}>
              <span className='spinner-border-info spinner-border-sm' />
            </div>
          ) : (
            <div
              className={`check-button  ${isDisabled ? 'disabled' : ''}`}
              // onClick={!isDisabled ? submitHandler : null}
            >
              <FontAwesomeIcon icon={faCheck} />
            </div>
          )}
        </Modal.Header>
        <Modal.Body>
          <Row className='m-0 mt-3 mb-5'>
            <Col md='8'>
              <Row>
                <Col md='6'>
                  <p className='m-0'>Course/Credential Details</p>
                  <CustomInput
                    placeholder={'Name of Course or Credential'}
                    type={'text'}
                    name='name'
                    value={mode === 'edit' ? formData.name : null}
                    handleChange={handleChange}
                    showError={formSubmitted}
                    error={errors.name}
                  />
                  <CustomInput
                    placeholder={'Name of Course or Credential Provider'}
                    type={'text'}
                    name='provider'
                    value={mode === 'edit' ? formData.provider : null}
                    handleChange={handleChange}
                    showError={formSubmitted}
                    error={errors.email}
                  />
                  <Row>
                    <Col md='6'>
                      <p className='m-0'>Course Rating</p>
                      <CustomInput
                        placeholder={'Numerical Rating'}
                        type={'number'}
                        name='ratings'
                        value={mode === 'edit' ? formData.ratings : null}
                        handleChange={handleChange}
                        showError={formSubmitted}
                        error={errors.ratings}
                      />
                    </Col>
                    <Col md='6'>
                      <p className='m-0'>No. Of Reviews</p>
                      <CustomInput
                        placeholder={'Name of Course or Credential'}
                        type={'text'}
                        name='reviews'
                        value={mode === 'edit' ? formData.reviews : null}
                        handleChange={handleChange}
                        showError={formSubmitted}
                        error={errors.reviews}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col md='6'>
                  <div className='pb-3 pt-0'>
                    <p className='mb-2'> Type of Award for Completion</p>
                    <CustomDropdown
                      isSelectable
                      exclusive
                      name='awardType'
                      btnClassName={'instructor'}
                      // options={universities?.map((university) => {
                      //   return {
                      //     name: university.name,
                      //     value: university.name,
                      //     id: university.id
                      //   }
                      // })}
                      isOpen={openDropdown === 'schoolAssignment'}
                      // setOpenDropdown={() =>
                      //   handleDropdownClick('schoolAssignment')
                      // }
                      // onClick={(event) =>
                      //   handleChangeSelect(
                      //     event,
                      //     'universityId',
                      //     'universityName'
                      //   )
                      // }
                      showError={formSubmitted}
                      error={errors.universityId}
                      preselectedOptions={
                        mode === 'edit'
                          ? [
                              {
                                name: formData.universityName,
                                id: formData.universityId
                              }
                            ]
                          : []
                      }
                    />
                  </div>
                  <p className='m-0'>
                    Total Time to Complete Course/Credential
                  </p>
                  <CustomInput
                    placeholder={'Total Course/Credential Completion Time'}
                    type={'text'}
                    name='completionTime'
                    value={mode === 'edit' ? formData.completionTime : null}
                    handleChange={handleChange}
                    showError={formSubmitted}
                    error={errors.completionTime}
                  />
                  <CustomInput
                    placeholder={'Weekly Time breakdown(optional)'}
                    type={'text'}
                    name='weeklyTimeBreakdown'
                    value={
                      mode === 'edit' ? formData.weeklyTimeBreakdown : null
                    }
                    handleChange={handleChange}
                    showError={formSubmitted}
                    error={errors.weeklyTimeBreakdown}
                  />
                </Col>
              </Row>
              <p className='m-0'>Course/Credential Description</p>
              <CustomTextarea />
              <p className='m-0'>Skill Developed</p>
              <CustomTextarea />
            </Col>
            <Col md='4'>
              <p className='mb-2'>Select Schedule Type</p>
              <CustomDropdown
                isSelectable
                exclusive
                multiple
                btnClassName={'instructor mb-3'}
                name='levels'
                // options={levels}
                onClick={(selectedOptions) =>
                  handleChangeDropdown(selectedOptions, mode, 'levels')
                }
                isOpen={openDropdown === 'levels'}
                // setOpenDropdown={() => handleDropdownClick('levels')}
                preselectedOptions={mode === 'edit' ? formData.levels : []}
                showError={formSubmitted}
                error={errors.levels}
              />
              <p className='m-0'>Link to Course</p>
              <CustomInput
                placeholder={'URL to Course'}
                type={'text'}
                name='courseURL'
                value={mode === 'edit' ? formData.courseURL : null}
                handleChange={handleChange}
                showError={formSubmitted}
                error={errors.courseURL}
              />
              <div className='py-3'>
                <p>Set Status</p>
                <span
                  className='d-flex align-items-center'
                  style={{ color: '#9297A1' }}
                >
                  Uanctive
                  <LtsCheckbox
                    className={'ps-1'}
                    name='deactivated'
                    toggle={(e) => handleChangeCheckbox(e, 'my-school')}
                    checked={
                      mode === 'edit'
                        ? !formData.deactivated
                        : !formData.deactivated
                    }
                  />
                  Active
                </span>
              </div>
              <LtsFileDropzone />
            </Col>
          </Row>
          {mode === 'add' ? (
            <Col md='12' className='d-flex justify-content-end'>
              <Row className='m-0 col-5 justify-content-evenly'>
                <SubmitButton
                  text={'CANCEL'}
                  width={'100px'}
                  background={'transparent'}
                  color={'#000'}
                  border={'1px solid #ccc'}
                  onClick={() => onHide()}
                />
                <SubmitButton
                  // onClick={submitHandler}
                  text={
                    loading ? (
                      <span className='spinner-border spinner-border-sm' />
                    ) : (
                      'ADD INSTRUCTOR'
                    )
                  }
                  background={'#52C7DE'}
                  color={'#fff'}
                  border={'none'}
                />
              </Row>
            </Col>
          ) : (
            <Row className='justify-content-between py-3 edit-actions__details'>
              <span className='col-6 d-flex align-items-center'>
                <p
                  href='#'
                  className='m-0 cursor-pointer'
                  onClick={deleteUserFromEdit}
                >
                  <FontAwesomeIcon icon={faUserMinus} className='pe-2' />
                  Delete User
                </p>
              </span>
              <span className='col-6 d-flex align-items-center justify-content-end'>
                <p
                  href='#'
                  className='m-0 cursor-pointer'
                  onClick={resetPasswordFromEdit}
                >
                  <FontAwesomeIcon icon={faUserLock} className='pe-2' />
                  Reset password
                </p>
              </span>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CourseVCredentialsActions
