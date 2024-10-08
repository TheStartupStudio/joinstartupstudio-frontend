import {
  faCheck,
  faTimes,
  faUserLock,
  faUserMinus,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { CustomDropdown, CustomInput, SubmitButton } from '../ContentItems'
import LtsCheckbox from '../../../../ui/LtsCheckbox'
import { useValidation } from '../../../../hooks/useValidation'
import { useForm } from '../../../../hooks/useForm'
import useIsFormEmpty from '../../../../hooks/useIsFormEmpty'
import { Auth } from 'aws-amplify'
import axiosInstance from '../../../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const AddInstructorModal = ({
  show,
  onHide,
  mode,
  user,
  programs = [],
  universities = [],
  levels = [],
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
  } = useForm(initialState, user, mode, loading)

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

  const { errors, handleSubmit, submitLoading } = useValidation(
    validatePayload,
    setFormSubmitted,
    optionalFields
  )

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const submitHandler = async () => {
    setLoading(true)
    try {
      handleSubmit(async () => {
        if (mode === 'edit') {
          const payload = {
            universityId: formData.universityId,
            universityName: formData.universityName,
            name: formData.name,
            email: formData.email,
            profession: formData.profession,
            programs: formData.programs.map((item) => item.name),
            levels: formData.levels.map((item) => item.name),
            deactivated: formData.deactivated
          }

          try {
            const res = await axiosInstance.patch(
              `/instructor/edit-instructors/${formData.id}`,
              payload
            )

            if (res) {
              onSuccess()
              toast.success('Instructor updated successfully!')
              onHide()
            } else {
              toast.error('Something went wrong!')
            }
          } catch (error) {
            toast.error('Something went wrong!')
          }
        } else {
          try {
            const res = await Auth.signUp({
              username: formData.email,
              password: formData.password,
              attributes: {
                'custom:universityCode': 'dev2020',
                'custom:isVerified': '1',
                'custom:language': 'en',
                'custom:email': formData.email,
                'custom:password': formData.password,
                name: formData.name
              }
            })

            const payload = {
              ...formData,
              cognito_Id: res.userSub,
              stripe_subscription_id: 'true',
              payment_type: 'school',
              is_active: 1
            }
            await axiosInstance.post('/instructor/add-instructors', payload)
            onSuccess()
            toast.success('Instructor added successfully!')
            onHide()
          } catch (err) {
            toast.error(err.message)
          }
        }
      })
    } catch (error) {
      toast.error('Form submission failed!')
    } finally {
      setLoading(false)
    }
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
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            {mode === 'add' ? 'Add Instructor' : 'Edit Instructor Details'}
          </Modal.Title>
          {mode !== 'edit' ? (
            <div className={`check-button fw-bold`} onClick={() => onHide()}>
              X
            </div>
          ) : submitLoading ? (
            <div className={`check-button fw-bold`}>
              <span className='spinner-border-info spinner-border-sm' />
            </div>
          ) : isDisabled ? (
            <div className={`check-button `} onClick={() => onHide()}>
              <FontAwesomeIcon icon={faTimes} />
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
          <Row className='m-0'>
            <Col md='6'>
              <p>User details</p>
              <CustomInput
                placeholder={'User Name (required)'}
                type={'text'}
                name='name'
                value={mode === 'edit' ? formData.name : null}
                handleChange={handleChange}
                showError={formSubmitted}
                error={errors.name}
              />
              <CustomInput
                placeholder={'User Email (required)'}
                type={'text'}
                name='email'
                value={mode === 'edit' ? formData.email : null}
                handleChange={handleChange}
                showError={formSubmitted}
                error={errors.email}
              />
              {mode !== 'edit' && (
                <CustomInput
                  placeholder={'Password (required)'}
                  type={'password'}
                  name='password'
                  value={mode === 'edit' ? formData.password : null}
                  handleChange={handleChange}
                  showError={formSubmitted}
                  error={errors.password}
                />
              )}
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
            </Col>
            <Col md='6'>
              <div className='pb-3'>
                <p className='m-0'> Select School Assignment</p>
                <CustomDropdown
                  isSelectable
                  exclusive
                  name='universityId'
                  btnClassName={'gray-border'}
                  options={universities?.map((university) => {
                    return {
                      name: university.name,
                      value: university.name,
                      id: university.id
                    }
                  })}
                  isOpen={openDropdown === 'schoolAssignment'}
                  setOpenDropdown={() =>
                    handleDropdownClick('schoolAssignment')
                  }
                  onClick={(event) =>
                    handleChangeSelect(event, 'universityId', 'universityName')
                  }
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
              <div className='pb-3'>
                <p className='m-0'>Select Level(s)</p>
                <CustomDropdown
                  isSelectable
                  exclusive
                  multiple
                  btnClassName={'gray-border'}
                  name='levels'
                  options={levels}
                  onClick={(selectedOptions) =>
                    handleChangeDropdown(selectedOptions, mode, 'levels')
                  }
                  isOpen={openDropdown === 'levels'}
                  setOpenDropdown={() => handleDropdownClick('levels')}
                  preselectedOptions={mode === 'edit' ? formData.levels : []}
                  showError={formSubmitted}
                  error={errors.levels}
                />
              </div>
              <div className='pb-3'>
                <p className='m-0'>Assign Program(s)</p>
                <CustomDropdown
                  isSelectable
                  exclusive
                  multiple
                  name='programs'
                  btnClassName={'gray-border'}
                  options={programs?.map((program) => ({
                    name: program.name,
                    value: program.name,
                    id: program.id
                  }))}
                  onClick={(selectedOptions) => {
                    handleChangeDropdown(selectedOptions, mode, 'programs')
                  }}
                  isOpen={openDropdown === 'programs'}
                  setOpenDropdown={() => handleDropdownClick('programs')}
                  preselectedOptions={mode === 'edit' ? formData.programs : []}
                  showError={formSubmitted}
                  error={errors.programs}
                />
              </div>
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
                  onClick={submitHandler}
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

export default AddInstructorModal
