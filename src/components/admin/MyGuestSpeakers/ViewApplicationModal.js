import React, { useState } from 'react'
import { useValidation } from '../../../hooks/useValidation'
import useIsFormEmpty from '../../../hooks/useIsFormEmpty'
import LoadingAnimation from '../../../ui/loadingAnimation'
import { Col, Modal, Row } from 'react-bootstrap'
import { CustomInput } from '../MySchool/ContentItems'
import { CustomCheckbox, LtsButton } from '../../../ui/ContentItems'
import { useForm } from '../../../hooks/useForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamationTriangle,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { getFormattedDate } from '../../../utils/helpers'

const ViewApplicationModal = ({
  show,
  onHide,
  user,
  application,
  refreshData,
  transferHandler,
  deleteHandler
}) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    phoneNumber: '',
    email: '',
    age: null,
    grade: '',
    schoolName: '',
    semester: '',
    cohortDays: '',
    pgName: '',
    pgAddress: '',
    pgCity: '',
    pgState: '',
    pgZipcode: '',
    pgPhoneNumber: '',
    pgEmail: '',
    preferedPgContact: '',
    preferedTime: [],
    signature: '',
    dateOfApplication: '',
    tnc: false
  }

  const { formData, handleChange, handleChangeCheckbox } = useForm(
    initialState,
    user,
    'edit',
    loading
  )

  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted)

  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)

    handleSubmit(() => {
      if (application.status === 'approved') {
        toast.success('Application is already approved!')
        transferHandler()

        onHide()
      } else {
        axiosInstance
          .patch(`/academies/applications/${application.id}/approved`)
          .then((res) => {
            if (res.status === 200) {
              setLoading(false)
              refreshData()
              toast.success('Application is approved.')

              transferHandler()
              onHide()
            } else {
              setLoading(false)
            }
          })
          .catch((err) => {
            setLoading(false)
            console.log('err', err)
          })
      }
    })
  }

  const archiveApplication = async () => {
    deleteHandler()
    onHide()
  }

  const isFormEmpty = useIsFormEmpty(formData)
  const isDisabled = isFormEmpty

  return (
    <>
      <Modal
        show={show}
        className={'my-guestSpeakers-modal mb-5 pb-5 myCustomModal'}
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
            View New Virtual Academy Application
          </Modal.Title>

          <div className={`check-button fw-bold`} onClick={() => onHide()}>
            X
          </div>
        </Modal.Header>
        <Modal.Body>
          <section>
            {loading ? (
              <LoadingAnimation show={true} />
            ) : (
              <form>
                <Row>
                  <Col md='6'>
                    <Col className='py-2'>
                      <p className='m-0'>Learner information</p>
                      <Row>
                        <Col md='12'>
                          <CustomInput
                            type='text'
                            name='name'
                            value={formData.name}
                            handleChange={handleChange}
                            placeholder='Full Name'
                            showError={formSubmitted}
                            error={errors.name}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col className='py-2'>
                      <p className='m-0'>Address</p>
                      <CustomInput
                        type='text'
                        name='address'
                        value={formData.address}
                        handleChange={handleChange}
                        placeholder='Address'
                        showError={formSubmitted}
                        error={errors.address}
                      />
                      <Row>
                        <Col md='6'>
                          <CustomInput
                            type='text'
                            name='city'
                            value={formData.city}
                            handleChange={handleChange}
                            placeholder='City'
                            showError={formSubmitted}
                            error={errors.city}
                          />
                        </Col>
                        <Col md='2'>
                          <CustomInput
                            type='text'
                            name='state'
                            value={formData.state}
                            handleChange={handleChange}
                            placeholder='State'
                            showError={formSubmitted}
                            error={errors.state}
                          />
                        </Col>
                        <Col md='4'>
                          <CustomInput
                            type='text'
                            name='zipcode'
                            value={formData.zipcode}
                            handleChange={handleChange}
                            placeholder='Zip Code'
                            showError={formSubmitted}
                            error={errors.zipcode}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col className='py-2'>
                      <p className='m-0'>Contact information</p>
                      <Row>
                        <Col md='6'>
                          <CustomInput
                            type='text'
                            name='phoneNumber'
                            value={formData.phoneNumber}
                            handleChange={handleChange}
                            placeholder='Phone Number'
                            showError={formSubmitted}
                            error={errors.phoneNumber}
                          />
                        </Col>
                        <Col md='6'>
                          <CustomInput
                            type='text'
                            name='email'
                            value={formData.email}
                            handleChange={handleChange}
                            placeholder='Learner Email'
                            showError={formSubmitted}
                            error={errors.email}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col className='py-3'>
                      <p className='m-0'>Additional information</p>
                      <Row>
                        <Col md='2'>
                          <CustomInput
                            type='text'
                            name='age'
                            value={formData.age}
                            handleChange={handleChange}
                            placeholder='Age'
                            showError={formSubmitted}
                            error={errors.age}
                          />
                        </Col>
                        <Col md='4'>
                          <CustomInput
                            type='text'
                            name='grade'
                            value={formData.grade}
                            handleChange={handleChange}
                            placeholder='Grade'
                            showHint={true}
                            hintText='Grade most recently attained'
                            showError={formSubmitted}
                            error={errors.grade}
                          />
                        </Col>
                        <Col md='6'>
                          <CustomInput
                            type='text'
                            name='schoolName'
                            value={formData.schoolName}
                            handleChange={handleChange}
                            placeholder='School Name/Curriculum Program'
                            showError={formSubmitted}
                            error={errors.schoolName}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col className='py-3'>
                      <p className='m-0 text-uppercase'>
                        Learning cohort preferences
                      </p>
                      <Row className='align-items-center'>
                        <Col md='3'>Semester:</Col>
                        {[
                          { text: 'September TBD', value: 'september-tbd' },
                          { text: 'January TBD', value: 'january-tbd' }
                        ].map((item) => (
                          <Col md='4'>
                            <CustomCheckbox
                              key={item.value}
                              value={item.value}
                              name='semester'
                              text={item.text}
                              handleChange={(e) =>
                                handleChangeCheckbox(e, 'str')
                              }
                              checked={
                                formData.semester === item.value.toLowerCase()
                              }
                            />
                          </Col>
                        ))}
                      </Row>

                      <Row className='align-items-center'>
                        <Col>Prefered days for cohort:</Col>
                        {[
                          { text: 'Mon/Thurs', value: 'mon/thurs' },
                          { text: 'Tues/Fri', value: 'tues/fri' },
                          { text: 'Wed/Sat', value: 'wed/sat' }
                        ].map((item) => (
                          <Col md='3'>
                            <CustomCheckbox
                              key={item.value}
                              value={item.value}
                              name='cohort'
                              text={item.text}
                              handleChange={(e) =>
                                handleChangeCheckbox(e, 'str')
                              }
                              checked={
                                formData.cohort === item.value.toLowerCase()
                              }
                            />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Col>
                  <Col md='6'>
                    <Col className='py-2'>
                      <p className='m-0'>Parent/Guardian information</p>
                      <Row>
                        <Col md='12'>
                          <CustomInput
                            type='text'
                            name='pgName'
                            value={formData.pgName}
                            handleChange={handleChange}
                            placeholder='Full Name'
                            showError={formSubmitted}
                            error={errors.pgName}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col className='py-2'>
                      <p className='m-0'>Address</p>
                      <CustomInput
                        type='text'
                        name='pgAddress'
                        value={formData.pgAddress}
                        handleChange={handleChange}
                        placeholder='Address'
                        showError={formSubmitted}
                        error={errors.pgAddress}
                      />
                      <Row>
                        <Col md='6'>
                          <CustomInput
                            type='text'
                            name='pgCity'
                            value={formData.pgCity}
                            handleChange={handleChange}
                            placeholder='City'
                            showError={formSubmitted}
                            error={errors.pgCity}
                          />
                        </Col>
                        <Col md='2'>
                          <CustomInput
                            type='text'
                            name='pgState'
                            value={formData.pgState}
                            handleChange={handleChange}
                            placeholder='State'
                            showError={formSubmitted}
                            error={errors.pgState}
                          />
                        </Col>
                        <Col md='4'>
                          <CustomInput
                            type='text'
                            name='pgZipcode'
                            value={formData.pgZipcode}
                            handleChange={handleChange}
                            placeholder='Zip Code'
                            showError={formSubmitted}
                            error={errors.pgZipcode}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col className='py-2'>
                      <p className='m-0'>Contact information</p>
                      <Row>
                        <Col md='6'>
                          <CustomInput
                            type='number'
                            name='pgPhoneNumber'
                            value={formData.pgPhoneNumber}
                            handleChange={handleChange}
                            placeholder='Phone Number'
                            showError={formSubmitted}
                            error={errors.pgPhoneNumber}
                          />
                        </Col>
                        <Col md='6'>
                          <CustomInput
                            type='text'
                            name='pgEmail'
                            value={formData.pgEmail}
                            handleChange={handleChange}
                            placeholder='Parent/Guardian Email'
                            showError={formSubmitted}
                            error={errors.pgEmail}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Row className='align-items-center py-3'>
                      <Col md='8'>
                        Preferred Method for Parent/Guardian Contact:
                      </Col>
                      {['Email', 'Phone'].map((type) => (
                        <Col md='2'>
                          <CustomCheckbox
                            key={type}
                            value={type}
                            name='preferedPgContact'
                            text={type}
                            handleChange={(e) => handleChangeCheckbox(e, 'str')}
                            checked={
                              formData.preferedPgContact === type.toLowerCase()
                            }
                          />
                        </Col>
                      ))}
                    </Row>
                    <Row className='align-items-center py-3'>
                      <Col md='5'>Preferred time (pick up to 3):</Col>
                      <Col
                        md='7'
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          columnGap: '.6rem',
                          rowGap: '.6rem'
                        }}
                      >
                        {[
                          '9:00-10:30',
                          '10:30-12:00',
                          '1:30-3:00',
                          '3:00-4:30',
                          '4:30-6:00',
                          '6:00-7:30'
                        ].map((time) => (
                          <CustomCheckbox
                            key={time}
                            text={time}
                            name='preferedTime'
                            value={time}
                            handleChange={(e) =>
                              handleChangeCheckbox(e, 'array', 3)
                            }
                            checked={formData.preferedTime.includes(time)}
                          />
                        ))}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Col className='signature__container py-3'>
                  <Row>
                    <Col md='6'>
                      <p>Signature</p>
                      <CustomInput
                        type='text'
                        name='signature'
                        value={formData.signature}
                        handleChange={handleChange}
                        placeholder='Type full name'
                        showError={formSubmitted}
                        error={errors.signature}
                      />
                    </Col>
                    <Col md='4'>
                      <p>Date of application</p>
                      <CustomInput
                        type='date'
                        name='dateOfApplication'
                        value={getFormattedDate(formData.dateOfApplication)}
                        handleChange={handleChange}
                        placeholder='Select Date'
                        showError={formSubmitted}
                        error={errors.dateOfApplication}
                      />
                    </Col>
                  </Row>
                  <CustomCheckbox
                    name='tnc'
                    handleChange={handleChangeCheckbox}
                    text={
                      'By typing your name above, you acknowledge that it serves as your binding signature and that the information provided is accurate with the understanding that this information will be used to place the learner in a suitable learning cohort. You also confirm your understanding and acceptance of our Terms of Use and Privacy Policy.'
                    }
                    checked={formData.tnc}
                  />
                </Col>
                <Row className='py-3 justify-content-between'>
                  <Col
                    md='8'
                    className='d-flex align-items-center cursor-pointer'
                    onClick={archiveApplication}
                  >
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className='me-2'
                    />
                    <span>Archive Application</span>
                  </Col>
                  <Col md='4' className='d-flex justify-content-end'>
                    <LtsButton
                      className={'mx-3'}
                      onClick={() => onHide()}
                      text={'Cancel'}
                      background={'transparent'}
                      color={'#707070'}
                      border={'1px solid #707070'}
                    />
                    <LtsButton
                      onClick={submitHandler}
                      text={
                        loading ? (
                          <span className='spinner-border spinner-border-sm' />
                        ) : (
                          'APPROVE & PLACE'
                        )
                      }
                      background={'#52C7DE'}
                      color={'#fff'}
                      border={'none'}
                      disabled={isDisabled}
                    />
                  </Col>
                </Row>
              </form>
            )}
          </section>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ViewApplicationModal
