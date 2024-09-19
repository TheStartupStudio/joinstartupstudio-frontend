import {
  faExclamationTriangle,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import {
  CustomDropdown,
  CustomInput,
  SubmitButton
} from '../MySchool/ContentItems'
import { LtsButton } from '../../../ui/ContentItems'
import { useForm } from '../../../hooks/useForm'
import { useValidation } from '../../../hooks/useValidation'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const COHORT_DAYS_OPTIONS = [
  { id: 1, name: 'Mon/Thurs' },
  { id: 2, name: 'Tues/Fri' },
  { id: 3, name: 'Wed/Sat' }
]

const COHORT_TIMES_OPRTIONS = [
  { id: 1, name: '09:00-10:30' },
  { id: 2, name: '10:30-12:00' },
  { id: 3, name: '1:30-3:00' },
  { id: 4, name: '3:30-4:30' },
  { id: 5, name: '4:30-6:00' },
  { id: 6, name: '6:00-7:30' }
]

const TransferModal = ({
  show,
  onHide,
  instructors,
  user,
  cohorts,
  programs,
  levels,
  refreshData,
  selectedRows = []
}) => {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    name: user.name ?? '',
    instructor_id: '',
    cohort_id: '',
    cohort_date: '',
    cohort_time: '',
    levels: [],
    programs: []
  }

  const { formData, handleChangeSelect, handleChangeDropdown } = useForm(
    initialState,
    user,
    loading
  )

  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted)

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)

    handleSubmit(() => {
      axiosInstance
        .post(`/academy/applications/transfer/${user.id}`, formData)
        .then((res) => {
          if (res.status === 200) {
            refreshData()
            toast.success('A user is successfully transfered.')
            onHide()
          }
        })
    })
  }

  return (
    <>
      <Modal
        show={show}
        className={'courseVcredential-modal mb-5 pb-5 '}
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
            Virtual Academy Application: Transfer Learner
          </Modal.Title>

          <div className={`check-button fw-bold`} onClick={() => onHide()}>
            X
          </div>
        </Modal.Header>
        <Modal.Body>
          <Row className='m-0 transfer-body_container'>
            <Col md='6'>
              <p>Learner details</p>
              <div className='mb-5'>
                <label htmlFor='name'>Student Name</label>
                <CustomInput
                  type={'text'}
                  name='name'
                  className='mb-2'
                  value={user?.name}
                />
                <div className='pb-3'>
                  <label htmlFor='levels' className='mt-2'>
                    Select Level(s)
                  </label>
                  <CustomDropdown
                    isSelectable
                    exclusive
                    multiple
                    name='levels'
                    btnClassName={'gray-border'}
                    options={levels}
                    onClick={(selectedOptions) =>
                      handleChangeDropdown(selectedOptions, 'add', 'levels')
                    }
                    isOpen={openDropdown === 'levels'}
                    setOpenDropdown={() => handleDropdownClick('levels')}
                    // preselectedOptions={mode === 'edit' ? formData.levels : []}
                    showError={formSubmitted}
                    error={errors.levels}
                  />
                </div>
              </div>
              <div className='pb-3'>
                <label htmlFor='instructor_id'>Transfer to Instructor</label>
                <CustomDropdown
                  isSelectable
                  // exclusive
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
                />
              </div>
            </Col>
            <Col md='6'>
              <p style={{ opacity: '0' }}>Learner details</p>
              <div className='mb-5'>
                <div className='pb-3'>
                  <label htmlFor='instructor_id' className='mb-2'>
                    Cohort
                  </label>
                  <CustomDropdown
                    isSelectable
                    exclusive
                    name='cohort_id'
                    btnClassName={'gray-border'}
                    options={cohorts?.map((cohort) => {
                      return {
                        name: cohort.name,
                        value: cohort.name,
                        id: cohort.id
                      }
                    })}
                    isOpen={openDropdown === 'cohorts'}
                    setOpenDropdown={() => handleDropdownClick('cohorts')}
                    onClick={(event) => handleChangeSelect(event, 'cohort_id')}
                    showError={formSubmitted}
                    error={errors.cohort_id}
                  />
                </div>
                <label htmlFor='programs'>Program(s)</label>
                <div className='pb-3'>
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
                      handleChangeDropdown(selectedOptions, 'add', 'programs')
                    }}
                    isOpen={openDropdown === 'programs'}
                    setOpenDropdown={() => handleDropdownClick('programs')}
                    showError={formSubmitted}
                    error={errors.programs}
                  />
                </div>
              </div>
              <div className='pb-3'>
                <label htmlFor='cohort_date'>Assign cohort dates</label>
                <CustomDropdown
                  isSelectable
                  exclusive
                  name='cohort_date'
                  btnClassName={'gray-border'}
                  options={COHORT_DAYS_OPTIONS?.map((date) => {
                    return {
                      name: date.name,
                      value: date.name,
                      id: date.id
                    }
                  })}
                  isOpen={openDropdown === 'cohort_date'}
                  setOpenDropdown={() => handleDropdownClick('cohort_date')}
                  onClick={(even) => {
                    handleChangeSelect(even, 'cohort_date')
                  }}
                  showError={formSubmitted}
                  error={errors.instructor_id}
                  preselectedOptions={[]}
                />
              </div>

              <div className='pb-3'>
                <label htmlFor='cohort_time'>Assign cohort times</label>
                <CustomDropdown
                  isSelectable
                  exclusive
                  name='cohort_time'
                  btnClassName={'gray-border'}
                  options={COHORT_TIMES_OPRTIONS?.map((time) => {
                    return {
                      name: time.name,
                      value: time.name,
                      id: time.id
                    }
                  })}
                  isOpen={openDropdown === 'cohort_time'}
                  setOpenDropdown={() => handleDropdownClick('cohort_time')}
                  onClick={(even) => {
                    handleChangeSelect(even, 'cohort_time')
                  }}
                  showError={formSubmitted}
                  error={errors.cohort_time}
                />
              </div>
            </Col>
          </Row>
          <Col md='12' className='d-flex justify-content-end'>
            <LtsButton
              onClick={submitHandler}
              text={
                loading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <Row className='m-0 align-items-center'>
                    <span>TRANSFER</span>
                  </Row>
                )
              }
              background={'#52C7DE'}
              color={'#fff'}
              border={'none'}
            />
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default TransferModal
