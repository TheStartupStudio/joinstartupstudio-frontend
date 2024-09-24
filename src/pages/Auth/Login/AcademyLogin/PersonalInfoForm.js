import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import DefaultImage from '../../../../assets/images/default-university-logo.jpg'
import {
  CustomCheckbox,
  CustomInput,
  LtsButton
} from '../../../../ui/ContentItems'
import useIsFormEmpty from '../../../../hooks/useIsFormEmpty'
import { useValidation } from '../../../../hooks/useValidation'
import { useForm } from '../../../../hooks/useForm'
import { useDispatch } from 'react-redux'
import LoadingAnimation from '../../../../ui/loadingAnimation'
import { Auth } from 'aws-amplify'
import axiosInstance from '../../../../utils/AxiosInstance'

const PersonalInfoForm = ({ onContinue, cancelHandler }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    firstname: '',
    lastname: '',
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
    pgFirstname: '',
    pgLastname: '',
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
    tnc: false,
    password: 'Learntostart1?'
  }

  const { formData, handleChange, handleChangeCheckbox } = useForm(
    initialState,
    undefined,
    'add',
    loading
  )

  console.log('formData', formData)

  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted)

  console.log('errors', errors)

  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    // handleSubmit(async () => {
    //   setLoading(true)

    //   console.log('submit')

    // await Auth.signUp({
    //   username: formData['email'],
    //   password: formData['password'],
    //   attributes: {
    //     'custom:universityCode': 'dev2020',
    //     'custom:isVerified': '1',
    //     'custom:language': 'en',
    //     'custom:email': formData['email'],
    //     'custom:password': formData['password'],
    //     name: formData.firstname + ' ' + formData.lastname
    //   }
    // })
    //   .then(async (res) => {
    //     await axiosInstance
    //       .post('/instructor/add-users', {
    //         data: {
    //           ...formData,
    //           name: formData.firstname + ' ' + formData.lastname,
    //           cognito_Id: res.userSub,
    //           stripe_subscription_id: 'true',
    //           payment_type: 'school',
    //           is_active: 1
    //         }
    //       })
    //       .then(() => {

    //       })
    //       .catch((err) => {
    //         console.log('err', err)
    //       })
    //   })
    //   .catch((err) => {
    //     console.log('err', err)
    //   })

    // })
    setTimeout(() => {
      setLoading(false)
      onContinue(formData)
    }, 1500)
  }

  const isFormEmpty = useIsFormEmpty(formData)

  const isDisabled = isFormEmpty

  console.log('isDisabled', isDisabled)

  return (
    <section>
      <Col className='justify-content-center align-items-center'>
        <div className='header__details'>
          <img src={DefaultImage} alt='Profile' />
          <p className='p-0 m-0'>Apply for Learn to Start Virtual Academy</p>
        </div>
        <hr />
      </Col>
      {loading ? (
        <LoadingAnimation show={true} />
      ) : (
        <form>
          <Row>
            <Col md='6'>
              <Col className='py-2'>
                <p className='m-0'>Learner information</p>
                <Row>
                  <Col md='6'>
                    <CustomInput
                      type='text'
                      name='firstname'
                      value={formData.firstname}
                      handleChange={handleChange}
                      placeholder='First Name'
                      showError={formSubmitted}
                      error={errors.firstname}
                    />
                  </Col>
                  <Col md='6'>
                    <CustomInput
                      type='text'
                      name='lastname'
                      value={formData.lastname}
                      handleChange={handleChange}
                      placeholder='Lastname'
                      showError={formSubmitted}
                      error={errors.lastname}
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
                        handleChange={(e) => handleChangeCheckbox(e, 'str')}
                        checked={formData.semester === item.value.toLowerCase()}
                      />
                    </Col>
                  ))}
                </Row>

                <Row className='align-items-center'>
                  <Col>Prefered days for cohort:</Col>
                  {[
                    { text: 'September TBD', value: 'september-tbd' },
                    { text: 'January TBD', value: 'january-tbd' }
                  ].map((item) => (
                    <Col md='4'>
                      <CustomCheckbox
                        key={item.value}
                        value={item.value}
                        name='cohort'
                        text={item.text}
                        handleChange={(e) => handleChangeCheckbox(e, 'str')}
                        checked={formData.cohort === item.value.toLowerCase()}
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
                  <Col md='6'>
                    <CustomInput
                      type='text'
                      name='pgFirstname'
                      value={formData.pgFirstname}
                      handleChange={handleChange}
                      placeholder='First Name'
                      showError={formSubmitted}
                      error={errors.pgFirstname}
                    />
                  </Col>
                  <Col md='6'>
                    <CustomInput
                      type='text'
                      name='pgLastname'
                      value={formData.pgLastname}
                      handleChange={handleChange}
                      placeholder='Last Name'
                      showError={formSubmitted}
                      error={errors.pgLastname}
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
                <Col md='8'>Preferred Method for Parent/Guardian Contact:</Col>
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
                      handleChange={(e) => handleChangeCheckbox(e, 'array', 3)}
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
                  value={formData.dateOfApplication}
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
          <Row className='py-3 justify-content-end'>
            <LtsButton
              className={'mx-3'}
              onClick={cancelHandler}
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
                  'SAVE AND CONTINUE TO PAYMENT'
                )
              }
              background={'#52C7DE'}
              color={'#fff'}
              border={'none'}
              disabled={isDisabled}
            />
          </Row>
        </form>
      )}
    </section>
  )
}

export default PersonalInfoForm
