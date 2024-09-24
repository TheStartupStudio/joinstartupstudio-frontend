import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Auth } from 'aws-amplify'
import axiosInstance from '../../../utils/AxiosInstance'
import IntlMessages from '../../../utils/IntlMessages'
import { validateEmail, validatePassword } from '../../../utils/helpers'
import './index.css'
import { useDispatch } from 'react-redux'
import { userLogin } from '../../../redux'
import { ConsoleLogger } from '@aws-amplify/core'

function CreateAccount() {
  const [user, setUser] = useState({})
  const [errMessages, setErrMessages] = useState({})
  const [buttonLoading, setButtonLoading] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [schools, setSchools] = useState([])
  const history = useHistory()
  const dispatch = useDispatch()

  const currentLanguage =
    localStorage.getItem('currentLanguage') !== undefined &&
    localStorage.getItem('currentLanguage') !== ''
      ? localStorage.getItem('currentLanguage')
      : 'en'

  useEffect(async () => {
    const [instructorsData, schoolsData] = await Promise.all([
      axiosInstance.get('/instructors'),
      axiosInstance.get('/universities')
    ])

    setInstructors(instructorsData.data.instructors)
    setSchools(schoolsData.data.universities)
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'type' && value === 'adult') {
      setUser((prevValues) => ({
        ...prevValues,
        ['school_or_organisation']: null
      }))
      // const schoolEl = document.getElementById('schoolSelect');
      // schoolEl.setAttribute('disabeld', 'disabled')
    }

    setUser((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    setButtonLoading(true)

    if (!user.name) {
      setErrMessages(() => ({
        ['validatedMessageName']: 'alerts.name_required'
      }))
      setButtonLoading(false)
    } else if (!user.email) {
      setErrMessages(() => ({
        ['validatedMessageEmail']: 'alerts.email_required'
      }))
      setButtonLoading(false)
    } else if (user.email && !validateEmail(user.email)) {
      setErrMessages(() => ({
        ['validatedMessageEmail']: 'alerts.valid_email'
      }))
      setButtonLoading(false)
    } else if (!user.password || !user.confirmPassword) {
      setErrMessages(() => ({
        ['validatedMessagePassword']: 'alerts.fill_password_fields'
      }))
      setButtonLoading(false)
    } else if (user.password !== user.confirmPassword) {
      setErrMessages(() => ({
        ['validatedMessagePassword']:
          'alerts.password_confirm_password_do_not_match'
      }))
      setButtonLoading(false)
    } else if (!validatePassword(user.password)) {
      setErrMessages(() => ({
        ['validatedMessagePassword']: 'alerts.password_conform_policy'
      }))
      setButtonLoading(false)
    } else if (!user.communityCode) {
      setErrMessages(() => ({
        ['validatedMessageCommunityCode']: 'alerts.community_code_required'
      }))
      setButtonLoading(false)
    } else if (!user.type) {
      setErrMessages(() => ({
        ['validatedMessageUserType']: 'alerts.user_type_required'
      }))
      setButtonLoading(false)
    } else if (user.type == 'student' && !user.school_or_organisation) {
      setErrMessages(() => ({
        ['validatedMessageSchool']: 'alerts.school_required'
      }))
      setButtonLoading(false)
    } else if (!user.instructor) {
      setErrMessages(() => ({
        ['validatedMessageInstructor']: 'alerts.instructor_required'
      }))
      setButtonLoading(false)
    } else if (!user.program) {
      setErrMessages(() => ({
        ['validatedMessageProgram']: 'alerts.program_required'
      }))
      setButtonLoading(false)
    } else if (!user.accept_terms) {
      setErrMessages(() => ({
        ['validatedMessageTerms']: 'alerts.terms_required'
      }))
      setButtonLoading(false)
    } else {
      const university = await axiosInstance
        .get(`/check/university/${user.communityCode.toLowerCase()}`)
        .then((res) => {
          return res.data
        })
        .catch(() => {
          setButtonLoading(false)
          setErrMessages({})
          toast.error(<IntlMessages id='alerts.wrong_community_code' />)
          return false
        })
      if (university.exists === true) {
        await Auth.signUp({
          username: user.email,
          password: user.password,
          attributes: {
            'custom:universityCode': user.communityCode,
            'custom:isVerified': '0',
            'custom:language': currentLanguage,
            name: user.name
          }
        })
          .then(async (res) => {
            const params = {
              name: user.name,
              email: user.email,
              universityId: university.universityId,
              cognito_Id: res.userSub,
              role: user?.role,
              instructor_id: Number(user.instructor),
              year: user.program,
              level: user.type === 'student' ? 'L3' : 'L4',
              password: user.password
            }
            await registerUser(params)
            localStorage.setItem('email', user.email)
          })
          .catch((err) => {
            setButtonLoading(false)
            if (err.code === 'UsernameExistsException') {
              toast.error(<IntlMessages id='alerts.user_exist' />)
            } else {
              toast.error(<IntlMessages id='alerts.something_went_wrong' />)
            }
          })
      }
    }
  }

  const registerUser = async (user) => {
    await axiosInstance
      .post('/register', user)
      .then(async () => {
        toast.success(<IntlMessages id='alerts.enrolled_successfully' />)
        Auth.signIn(user.email, user.password).then((response) => {
          localStorage.setItem(
            'access_token',
            response.signInUserSession.idToken.jwtToken
          )
          localStorage.setItem(
            'language',
            response.attributes['custom:language']
          )
          localStorage.setItem('email', user.email)
          setButtonLoading(false)
          dispatch(userLogin())
        })
      })
      .catch(() => {
        setButtonLoading(false)
        toast.error(<IntlMessages id='alerts.user_exist' />)
      })
  }

  return (
    <div
      className='container-fluid px-md-5'
      style={{ backgroundColor: '#e4e9f4', minHeight: 'calc(100vh - 90px)' }}
    >
      <div className='row pt-5'>
        <div className='col-sm-12 mx-auto col-md-10 col-lg-8 py-3'>
          <div
            className='col-md-12 col-lg-12 ms-auto public-page-form px-4 pb-3 pt-4'
            style={{ backgroundColor: 'white' }}
          >
            <h3 className='create-account-title mb-4'>
              <IntlMessages id='create_account.title' />
            </h3>
            <p className='public-page-text3'>
              <IntlMessages id='create_account.page_description' />
            </p>
            <div className='row'>
              <div className='col-sm-12 col-md-6'>
                <FormattedMessage
                  id='create_account.full_name'
                  defaultMessage='create_account.full_name'
                >
                  {(placeholder) => (
                    <input
                      className='mt-1 mb-3'
                      type='text'
                      name='name'
                      placeholder={placeholder}
                      onChange={(event) => handleChange(event)}
                    />
                  )}
                </FormattedMessage>
                {errMessages?.validatedMessageName &&
                  errMessages?.validatedMessageName !== '' && (
                    <span className='validate-message mb-1'>
                      <IntlMessages
                        id={`${errMessages?.validatedMessageName}`}
                      />
                    </span>
                  )}
                <FormattedMessage
                  id='create_account.email'
                  defaultMessage='create_account.email'
                >
                  {(placeholder) => (
                    <input
                      className='mb-3'
                      type='email'
                      name='email'
                      placeholder={placeholder}
                      onChange={(event) => handleChange(event)}
                    />
                  )}
                </FormattedMessage>
                {errMessages?.validatedMessageEmail &&
                  errMessages?.validatedMessageEmail !== '' && (
                    <span className='validate-message mb-1'>
                      <IntlMessages
                        id={`${errMessages?.validatedMessageEmail}`}
                      />
                    </span>
                  )}
                <FormattedMessage
                  id='create_account.password_policy'
                  defaultMessage='create_account.password_policy'
                >
                  {(data) => (
                    <div>
                      <div className='create-account-password-div'>
                        <label data={data}>
                          <FormattedMessage
                            id='create_account.password'
                            defaultMessage='create_account.password'
                          >
                            {(placeholder) => (
                              <input
                                className='mb-3'
                                type='password'
                                name='password'
                                placeholder={placeholder}
                                onChange={(event) => handleChange(event)}
                              />
                            )}
                          </FormattedMessage>
                        </label>
                      </div>
                    </div>
                  )}
                </FormattedMessage>
                {errMessages?.validatedMessagePassword &&
                  errMessages?.validatedMessagePassword !== '' && (
                    <span className='validate-message mb-1'>
                      <IntlMessages
                        id={`${errMessages?.validatedMessagePassword}`}
                      />
                    </span>
                  )}
                <FormattedMessage
                  id='create_account.confirm_password'
                  defaultMessage='create_account.confirm_password'
                >
                  {(placeholder) => (
                    <input
                      className='mb-3'
                      type='password'
                      name='confirmPassword'
                      placeholder={placeholder}
                      onChange={(event) => handleChange(event)}
                    />
                  )}
                </FormattedMessage>
                {errMessages?.validatedMessageConfirmPassword &&
                  errMessages?.validatedMessageConfirmPassword !== '' && (
                    <span className='validate-message mb-1'>
                      <IntlMessages
                        id={`${errMessages?.validatedMessageConfirmPassword}`}
                      />
                    </span>
                  )}
                <FormattedMessage
                  id='create_account.community_code'
                  defaultMessage='create_account.community_code'
                >
                  {(placeholder) => (
                    <input
                      className='mb-3'
                      type='text'
                      name='communityCode'
                      placeholder={placeholder}
                      onChange={(event) => handleChange(event)}
                    />
                  )}
                </FormattedMessage>
              </div>
              <div className='col-sm-12 col-md-6'>
                <div className='row my-3 px-md-4 text-center'>
                  <div className='col-7'>
                    <div className='radio-wrapper'>
                      <div>
                        <input
                          type='radio'
                          className='create-account-radio'
                          name='type'
                          value='student'
                          onChange={(event) => handleChange(event)}
                        />
                      </div>
                      <div>I'm a student at a school</div>
                    </div>
                  </div>
                  <div className='col-5'>
                    <div className='radio-wrapper'>
                      <div>
                        <input
                          type='radio'
                          className='create-account-radio'
                          name='type'
                          value='adult'
                          onChange={(event) => handleChange(event)}
                        />
                      </div>
                      <div>I'm an adult</div>
                    </div>
                  </div>
                  <div className='col-12'>
                    {errMessages?.validatedMessageUserType &&
                      errMessages?.validatedMessageUserType !== '' && (
                        <span className='validate-message mb-1'>
                          This is required
                        </span>
                      )}
                  </div>
                </div>

                {user.type == 'student' && (
                  <div className='px-md-4 mb-3'>
                    <select
                      name='school_or_organisation'
                      className='form-item'
                      id='schoolSelect'
                      onChange={(event) => handleChange(event)}
                    >
                      <option>Select your School or Organisation</option>
                      {schools.map((school) => (
                        <option value={school.id} key={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                    {errMessages?.validatedMessageSchool &&
                      errMessages?.validatedMessageSchool !== '' && (
                        <span className='validate-message mb-1'>
                          This is required
                        </span>
                      )}
                  </div>
                )}

                <div className='px-md-4 mb-3'>
                  <select
                    name='instructor'
                    className='form-item'
                    onChange={(event) => handleChange(event)}
                  >
                    <option>Select your Instructor</option>
                    {instructors.map((instructor) => (
                      <option value={instructor.id} key={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                  {errMessages?.validatedMessageInstructor &&
                    errMessages?.validatedMessageInstructor !== '' && (
                      <span className='validate-message mb-1'>
                        This is required
                      </span>
                    )}
                </div>

                <div className='px-md-4 mb-3'>
                  <select
                    name='program'
                    className='form-item'
                    onChange={(event) => handleChange(event)}
                  >
                    <option>Select your Program</option>
                    <option value='ES1'>ES1</option>
                    <option value='ES2'>ES2</option>
                    <option value='ES3'>ES3</option>
                    <option value='ES4'>ES4</option>
                    <option value='n/a'>n/a</option>
                  </select>
                  {errMessages?.validatedMessageProgram &&
                    errMessages?.validatedMessageProgram !== '' && (
                      <span className='validate-message mb-1'>
                        This is required
                      </span>
                    )}
                </div>

                <div className='radio-wrapper mb-3 px-md-4 text-center'>
                  <div>
                    <input
                      type='radio'
                      className='create-account-radio'
                      name='accept_terms'
                      onChange={(event) => handleChange(event)}
                    />
                  </div>
                  <div>
                    <a
                      href={'/terms'}
                      target='_blank'
                      className='public-page-terms-link'
                    >
                      <IntlMessages
                        id='create_account.terms'
                        className='text-center'
                      />
                    </a>
                  </div>
                </div>
                <div className='px-4'>
                  {errMessages?.validatedMessageTerms &&
                    errMessages?.validatedMessageTerms !== '' && (
                      <span className='validate-message mb-1'>
                        This is required
                      </span>
                    )}
                </div>
              </div>
            </div>
            {errMessages?.validatedMessageCommunityCode &&
              errMessages?.validatedMessageCommunityCode !== '' && (
                <span className='validate-message mb-1'>
                  <IntlMessages
                    id={`${errMessages?.validatedMessageCommunityCode}`}
                  />
                </span>
              )}
            <button
              className='mt-2 register-btn'
              disabled={buttonLoading}
              onClick={handleSubmit}
            >
              {buttonLoading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <IntlMessages id='general.start' />
              )}
            </button>
          </div>
          <p className='mt-3 public-page-text link'>
            <IntlMessages id='create_account.already_registered' />
            <a href={'/'} className='ml-2'>
              <IntlMessages id='general.login' />
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount
