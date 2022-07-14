import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import axiosInstance from '../../../utils/AxiosInstance'
import '../index.css'
import AddIndividual from './AddIndividual'
import { Auth } from 'aws-amplify'
import IntlMessages from '../../../utils/IntlMessages'
import csvToArray from '../../CSVUpload/csvToArray'
import { toast } from 'react-toastify'
import ErrorsModal from './ErrorsModal'
import file from '../../../assets/files/UserCSV.csv'
import _ from 'lodash'

const AddStudentsModal = (props) => {
  const [users, addUser] = useState([])
  const [addUserInputs, setAddUserInputs] = useState(3)
  const [loading, setLoading] = useState(false)
  const [csvLoading, setCsvLoading] = useState(false)
  const [isUploaded, setUploaded] = useState(false)
  const [showErrorModal, setShowErrorsModal] = useState(false)
  const [errors, setErrors] = useState([])

  const userRequiredFields = [
    'name',
    'lastName',
    'UserEmail',
    'password',
    'level',
    'year'
  ]

  let addedUsers = []

  const handleChange = (e, index) => {
    const { name, value } = e
    var item = users.find((item) => item.id === index)
    if (item) {
      users.map((user) => {
        if (user.id === index) {
          user[name] = value
        }
      })
    } else {
      addUser((old) => [...old, { id: index, [name]: value }])
    }
  }

  const validateUsersBeforeSubmit = () => {
    let validateError = false
    users.forEach((user) => {
      userRequiredFields.forEach((field) => {
        if (!user[field]) {
          validateError = true
        }
      })
    })

    if (validateError)
      return toast.error('Please fill in all the required fields!')

    req(users)
    setLoading(true)
  }

  async function req(results) {
    if (results.length <= 0) {
      setLoading(false)
      setCsvLoading(false)

      if (!errors[0] === undefined) setShowErrorsModal(true)
      addUser([])
      props.addStudents(addedUsers)
      addedUsers = []
      props.onHide()
      return
    }

    const item = results.shift()
    if (
      !item['UserEmail'] ||
      !item['name'] ||
      !item['password'] ||
      !item['level'] ||
      !item['year']
    ) {
      setErrors((old) => [
        ...old,
        {
          message: `This field failed beacuse of empty input`,
          code: 400,
          user: item
        }
      ])
      return req(results)
    }

    await Auth.signUp({
      username: item['UserEmail'],
      password: item['password'],
      attributes: {
        'custom:universityCode': 'dev2020',
        'custom:isVerified': '1',
        'custom:language': 'en',
        'custom:email': item['UserEmail'],
        'custom:password': item['password'],
        name: item.name + ' ' + item.lastName
      }
    })
      .then(async (res) => {
        await axiosInstance
          .post('/instructor/add-users', {
            data: {
              ...item,
              name: item.name + ' ' + item.lastName,
              cognito_Id: res.userSub,
              stripe_subscription_id: 'true',
              payment_type: 'school',
              is_active: 1
            }
          })
          .then((response) => {
            addedUsers = [response.data.user, ...addedUsers]
            req(results)
          })
          .catch((error) => {
            req(results)
          })
      })
      .catch((err) => {
        if (err.code == 'UsernameExistsException') {
          setErrors((old) => [
            ...old,
            {
              message: `User with email ${item.UserEmail} already exists`,
              user: item
            }
          ])
          req(results)
        } else {
          setErrors((old) => [
            ...old,
            {
              message: `Something went wrong with the email`,
              user: item
            }
          ])
        }
      })
  }

  const csvSubmit = () => {
    setCsvLoading(true)

    const input = document.getElementById('csvFile').files[0]
    const reader = new FileReader()

    reader.onload = function (e) {
      const results = csvToArray(e.target.result, ',')
      req(results)
    }

    reader.readAsText(input)
  }
  // const handleSubmit = async () => {
  //   setLoading(true)

  //   // setLoading(false)
  // }
  return (
    <>
      <Modal
        show={props.show}
        className={'Add-Student-Modal mb-5 pb-5'}
        onHide={() => {
          props.onHide()
          setAddUserInputs(3)
        }}
        style={{ marginTop: '3.9%' }}
      >
        <Modal.Header className='contact-us-title general-modal-header my-auto p-0 mx-4'>
          <h3 className='mb-0 pt-4 mt-2 '>ADD USERS</h3>
          <button
            type='button'
            className='btn-close me-1 btn-close me-1 mt-0 pt-3 me-md-1 mb-md-2 ms-2 ms-md-0 mt-md-0 my-auto'
            aria-label='Close'
            disabled={loading ? true : false}
            onClick={() => {
              props.onHide()
              setAddUserInputs(3)
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <div className='row ms-2'>
            <div className='col-12 col-md-7 Add-User-Bulk px-0'>
              <p className='title mb-0'>Upload Bulk Users</p>
              <p className='description mb-0'>
                Upload multiple users at one time using a CVS file.
              </p>
              <p className='description'>
                (Download{' '}
                <span className='brand'>
                  <a href={`${file}`} download>
                    template
                  </a>
                </span>{' '}
                to edit)
              </p>
              <p className='supported-formats mb-0'>Supported formats: -</p>
              <p className='supported-formats-description mb-0'>.csv only</p>
            </div>
            <div className='col-12 col-md-5 pt-3 ps-0'>
              <label className='text-center border-1 col-6 col-md-12'>
                <input
                  type='file'
                  id='csvFile'
                  name='csvFile'
                  className='d-none'
                  onChange={() => {
                    setUploaded(true)
                  }}
                />
                <div className='image-upload d-flex upload-user-input w-100 my-auto py-2 px-2'>
                  <p className='py-auto my-auto'>Upload new file</p>
                  <FontAwesomeIcon
                    icon={faFileUpload}
                    className='edit-modal-sm ms-auto float-end'
                    //   style={{ height: '27px', width: '20px' }}
                  />
                </div>
              </label>
              <button
                className='lts-button px-3 upload-user-button float-end mt-md-3 col-5 text-center col-md-auto'
                disabled={csvLoading || loading}
                onClick={
                  isUploaded
                    ? () => {
                        setCsvLoading(true)
                        csvSubmit()
                      }
                    : () => {
                        toast.error(
                          'You need to upload a csv file before submit'
                        )
                      }
                }
              >
                {csvLoading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'UPLOAD USER FILE CSV'
                )}
              </button>
            </div>
            <div className='row mx-0 ps-0'>
              <p className='add-individual mx-0 px-0 mt-2 mb-0'>
                Add individual
              </p>
              {[...Array(addUserInputs)].map((data, index) => (
                <AddIndividual
                  userData={data}
                  handleChange={(e) => handleChange(e, index)}
                  userIndex={index}
                  key={index}
                  // setAddUserInputs={() => setAddUserInputs(3)}
                />
              ))}
              <span
                className='add-new-input-for-user mt-3 cursor-pointer brand'
                onClick={() => {
                  setAddUserInputs((old) => old + 1)
                }}
              >
                + Add additional users
              </span>
            </div>
          </div>
          <div className='modal-footer position-relative px-0 border-0'>
            <button
              className='lts-button'
              onClick={() => {
                if (users.length > 0) {
                  validateUsersBeforeSubmit()
                } else {
                  toast.error('Please add users')
                }
              }}
              disabled={loading || csvLoading}
            >
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'ADD USER(S)'
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <ErrorsModal
        show={showErrorModal}
        setErrors={() => setErrors([])}
        onHide={() => setShowErrorsModal(false)}
        errors={errors}
      />
    </>
  )
}

export default AddStudentsModal
