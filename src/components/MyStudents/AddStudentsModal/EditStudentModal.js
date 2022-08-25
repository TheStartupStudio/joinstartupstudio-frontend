import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import defaultImage from '../../../assets/images/profile-image.png'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import '../index.css'
import Auth from '@aws-amplify/auth'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const EditStudentModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSubmitted, setResetSubmitted] = useState(false)
  const [data, setData] = useState({})
  const { user } = useSelector((state) => state.user.user)

  useEffect(() => {
    setData(props?.data)
    setResetSubmitted(false)
  }, [props])

  const defaultLevels = [
    { label: 'L1 (ES)', value: 'ES' },
    { label: 'L2 (MS)', value: 'MS' },
    { label: 'L3 (HS)', value: 'HS' },
    { label: 'L4', value: 'L4' }
  ]

  const defaultYears = [
    { label: 'LTS YEAR 1', value: 'L1' },
    { label: 'LTS YEAR 2', value: 'L2' },
    { label: 'LTS YEAR 3', value: 'L3' },
    { label: 'LTS YEAR 4', value: 'L4' }
  ]

  const handleChange = (e) => {
    const { name, value } = e
    setData((old) => ({ ...old, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)

    axiosInstance
      .put(`/instructor/update-student/${data.id}`, {
        ...data,
        from: 'editViewUser',
        newEmail: data?.email
      })
      .then(async (response) => {
        props.updateState(data?.id, data)
        setLoading(false)
        props.setStudentToEdit({})
        props.onHide()
        toast.success('Data was successfuly updated')
      })
      .catch((err) => {
        toast.error(err.response.data)
        setLoading(false)
        // props.onHide()
      })
  }

  const handlePasswordReset = async () => {
    setResetLoading(true)

    await axiosInstance
      .put(`/instructor/change-student-password/${data.id}`)
      .then(async () => {
        setResetSubmitted(true)
      })
      .catch((err) => {
        toast.error('Something went wrong, please try again!')
      })
    setResetLoading(false)
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className='edit-profile-modal'
    >
      <Modal.Header className='pb-0 general-modal-header mx-4 row'>
        <div className='col-4 px-0'>
          <p className='mt-5 mb-0 view-student-title pb-0 pt-auto order-1 order-lg-1'>
            VIEW STUDENT
          </p>
        </div>
        <div className='col-12 col-lg-5 certification-status px-0 pb-0 mt-auto mb-1 order-3 order-lg-2'>
          <p className='float-md-end mt-4 mt-md-auto pt-auto mb-0 pb-0 pe-3'>
            {' '}
            CERTIFICATION STATUS
            <span
              style={{ cursor: 'pointer' }}
              class={`ms-2 mb-0 pb-0 pt-auto  ${
                props.data.certificat ? 'statusOk' : 'statusFalse'
              }`}
            >
              ●
            </span>
          </p>
        </div>
        <div className='col-6 col-lg-3 view-student-portfolio-journals px-0 pb-0 mt-auto mb-1 mx-0 order-2 order-lg-3'>
          <div className='float-end'>
            <button
              type='button'
              className='btn-close pt-3 mt-0 mb-lg-2 mt-2 mt-lg-0 float-end my-auto'
              aria-label='Close'
              onClick={() => {
                props.onHide()
              }}
            />
            <div className='mt-auto me-4'>
              <Link
                to={`/user-portfolio/${props.data.username}`}
                className='pe-2'
              >
                <span className='border-end pe-2'>Portfolio</span>
              </Link>
              <Link to={`/students-journals/${props.data.id}`} className='pe-2'>
                <span className='ps-2'>Journals</span>
              </Link>
            </div>
          </div>
        </div>
        {/* <div className='col-1 px-0'>
          
        </div> */}
      </Modal.Header>
      <Modal.Body className='row px-0 mx-4'>
        <div className='col-12 col-lg-2 mb-2 mb-lg-0 pt-2 text-center'>
          <img
            src={data.profile_image ? data.profile_image : defaultImage}
            className='border border-1 rounded-circle border border-dark text-center mx-auto'
            width={'101px'}
            height={'101px'}
          />
        </div>
        <div className='col-12 col-lg-6 pe-lg-4'>
          <div class='input-group mb-1'>
            <label for=' w-100'>User Name</label>

            <input
              type='text'
              class='form-control w-100'
              name='name'
              defaultValue={data?.name}
              value={data?.name}
              onChange={(e) =>
                handleChange({ name: 'name', value: e.target.value })
              }
            />
          </div>
          <div class='input-group mb-1'>
            <label for='userName w-100'>User Email</label>
            <input
              type='text'
              class='form-control w-100'
              aria-label='Sizing example input'
              aria-describedby='inputGroup-sizing-default'
              defaultValue={data?.email}
              value={data?.email}
              onChange={(e) =>
                handleChange({ name: 'email', value: e.target.value })
              }
              name='UserEmail'
            />
          </div>
          {/* <div class='input-group mb-3'>
            <label for='userName w-100'>User Chosen Role</label>
            <input
              type='text'
              class='form-control w-100'
              aria-label='Sizing example input'
              aria-describedby='inputGroup-sizing-default'
              disabled
              name='UserChosenRole'
            />
          </div> */}
          <div class='mt-2'>
            <textarea
              class='form-control'
              id='exampleFormControlTextarea1'
              defaultValue={data.user_note}
              // value={data?.user_note}
              name='user_note'
              onChange={(e) =>
                handleChange({ name: 'user_note', value: e.target.value })
              }
              placeholder='Add user notes here...'
              rows='4'
            ></textarea>
          </div>
          <div className='mt-2'>
            <button
              className='lts-button w-50'
              style={{
                background: !resetSubmitted ? '#ea3b97' : 'rgb(187, 189, 191)',
                hover: {
                  background: !resetSubmitted ? '#a7ca42' : 'rgb(187, 189, 191)'
                }
              }}
              onClick={() => {
                handlePasswordReset()
              }}
              disabled={resetLoading || resetSubmitted}
            >
              {resetLoading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'RESET PASSWORD'
              )}
            </button>
            {resetSubmitted && (
              <p className='user-id-label mt-1'>
                Default password was set to:{' '}
                <span style={{ color: '#01c5d1' }}> Learntostart1! </span>
              </p>
            )}
          </div>
        </div>
        <div className='col-lg-4 col-12 ps-lg-5 pt-1'>
          <div className='row'>
            {/* <div className='col-6 px-0'>
              <label for='userId' className='user-id-label'>
                User ID Number
              </label>
              <input
                type='text'
                class='form-control text-center'
                value={data.id}
                aria-label='Sizing example input'
                aria-describedby='inputGroup-sizing-default'
                disabled
                name='userId'
              />
            </div> */}
            <div className='col-12 px-0 text-center'>
              <label for='unit' className='user-id-label'>
                Unit
              </label>
              <Select
                options={props?.school}
                defaultValue={data?.Instructor?.University?.name}
                name='university'
                placeholder={data?.Instructor?.University?.name}
                // onChange={(newValue) => {
                //   handleChange({
                //     name: 'university',
                //     value: newValue.value,
                //     universityChanged: 'true'
                //   })
                // }}
                isDisabled={true}
                className='my-auto py-auto'
                // styles={customStyles}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-6 px-0 text-center'>
              <label for='level' className='user-id-label'>
                Level
              </label>
              <Select
                options={defaultLevels}
                defaultValue={data?.level}
                placeholder={data?.level}
                onChange={(newValue) => {
                  handleChange({
                    name: 'level',
                    value: newValue.value
                  })
                }}
                className='my-auto py-auto'
                // styles={customStyles}
              />
            </div>
            <div className='col-6 px-0 ps-2 text-center'>
              <label for='year' className='user-id-label'>
                Year
              </label>
              <Select
                options={defaultYears}
                defaultValue={data?.year}
                placeholder={data?.year}
                onChange={(newValue) => {
                  handleChange({
                    name: 'year',
                    value: newValue.value
                  })
                }}
                className='my-auto py-auto'
                // styles={customStyles}
              />
            </div>
          </div>
          <div className='row '>
            <div className='col-12 px-0 text-center'>
              <label for='userId' className='user-id-label'>
                Instructor
              </label>
              <Select
                options={props?.instructors}
                defaultValue={user?.name}
                placeholder={user?.name}
                onChange={(newValue) => {
                  handleChange({
                    name: 'instructor_id',
                    value: newValue.value
                  })
                }}
                isDisabled={false}
                className='my-auto py-auto'
                // styles={customStyles}
              />
            </div>
          </div>
          <div className='row mt-3'>
            <div className=' col-12 ms-auto my-auto blunk-activated-div d-flex'>
              <p className='my-auto'>Activated </p>
              <label className='px-0 ps-sm-1 ps-lg-1 form-switch my-auto d-flex w-100'>
                <input
                  type='checkbox'
                  checked={data?.deactivated == true ? false : true}
                  onChange={(e) => {
                    handleChange({
                      name: 'deactivated',
                      value: data?.deactivated == true ? false : true
                    })
                  }}
                />
                <i className='ms-auto'></i>
              </label>
            </div>
          </div>
          <div className='row mt-3'>
            <button
              className='lts-button w-100'
              onClick={() => {
                handleSubmit()
              }}
              disabled={loading ? true : false}
            >
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'SAVE'
              )}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default EditStudentModal
