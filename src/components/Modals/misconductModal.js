import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import Select, { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import _ from 'lodash'
import { faUserPlus, faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

const MisconductModal = (props) => {
  const [message, setMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [loading, setLoading] = useState(false)

  const getFilteredUsers = _.debounce((keyword, callback) => {
    if (keyword.length < 3) return callback(null)
    axiosInstance
      .get(`/users/filter-users/${keyword}`)
      .then((res) => {
        const options = res.data.users.map((user, index) => {
          return {
            label: user.name,
            value: user,
            key: index
          }
        })
        callback(options)
      })
      .catch((e) => callback(null))
  }, 500)

  useEffect(() => {
    if (props.connectiontoBeRemoved) {
      setSelectedUser({
        value: { id: props.connectiontoBeRemoved.id },
        label: props.connectiontoBeRemoved.name
      })
    }
  }, [props.connectiontoBeRemoved])

  const handleUserSelect = (e) => {
    setSelectedUser({ value: e.value, label: e.label })
  }

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{
                color: '#333d3d',
                height: '37px',
                width: '36px',
                position: 'absolute',
                left: '6'
                // cursor: 'pointer'
              }}
              onClick={props.closeChat}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    )
  }

  const closeModal = () => {
    props.onHide()
    setSelectedUser(null)
    setMessage('')
    setSelectedImage(null)
  }

  const submitReport = async () => {
    if (!selectedUser) {
      return toast.error('Please select the user you want to report!')
    }

    if (message.length < 20) {
      return toast.error(
        'Report description must contain at least 20 characters!'
      )
    }
    setLoading(true)

    let imageUrl = null

    if (selectedImage) {
      const formData = new FormData()
      formData.append('img', selectedImage)
      await axiosInstance
        .post('/upload/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          imageUrl = response.data.fileLocation
        })
        .catch((err) => {
          setLoading(false)
          return toast.error('Image upload failed, please try again!')
        })
    }

    const report_data = {
      toUserId: selectedUser.value.id,
      description: message,
      image_url: imageUrl
    }

    await axiosInstance
      .post(`/report`, report_data)
      .then((res) => {
        closeModal()
        setLoading(false)
        toast.success('You have reported the user successfully!')
      })
      .catch((err) => {
        closeModal()
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileSize = e.target.files[0].size / 1024 / 1024
      if (fileSize > 0.5) {
        return toast.error('Image size exceeds 512KB.')
      }

      setSelectedImage(e.target.files[0])
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={() => closeModal()}
      backdrop='static'
      keyboard={false}
      id='contact-us-modal'
    >
      <Modal.Header className='contact-us-title general-modal-header my-auto p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2'>
          {props?.type === 'report-connection'
            ? 'REPORT USER'
            : 'REPORT MISCONDUCT'}
        </h3>
        <button
          type='button'
          className='btn-close me-1 mt-0 pt-1'
          aria-label='Close'
          onClick={() => closeModal()}
        />
      </Modal.Header>
      <Modal.Body className='misconduct-modal'>
        <AsyncSelect
          value={
            selectedUser?.label
              ? { label: selectedUser?.label }
              : {
                  label: 'NAME/USERNAME OF USER BEING REPORTED'
                }
          }
          isDisabled={props.connectiontoBeRemoved}
          loadOptions={getFilteredUsers}
          onChange={handleUserSelect}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            outLine: 'none',
            colors: {
              ...theme.colors,
              // primary25: 'hotpink',
              primary: '#e4e4e4',
              neutral0: '#e4e4e4',
              opacity: 1,
              zIndex: 100
            },
            spacing: {
              ...theme.spacing,
              controlHeight: 32
            },
            zIndex: 100
          })}
          styles={{
            control: (provided, state) => ({
              ...provided,
              boxShadow: 'none',
              border: 'none',
              height: 15,
              fontSize: '14px',
              height: '50px'
            }),
            menu: (base) => ({
              ...base,
              border: 'none',
              boxShadow: 'none',
              fontSize: '14px'
            }),
            valueContainer: (base) => ({
              ...base,
              paddingLeft: 50
            })
          }}
          components={{
            ValueContainer,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null
          }}
          classNamePrefix='vyrill'
        />
        <div className='contact-us'>
          <textarea
            className='my-3'
            name='message'
            placeholder={
              !props?.connectiontoBeRemoved
                ? 'Please tell us why you are reporting this user for misconduct. Please include a link to the questionable material or upload a screenshot.'
                : 'Why are you reporting this user?'
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className='d-flex justify-content-between'>
            <label className='py-2 w-75'>
              <input
                type='file'
                id='inputGroupFile'
                name='profile_image'
                accept='image/*'
                className='d-none'
                onChange={imageChange}
              />
              <div className='image-upload d-flex align-items-center edit-modal'>
                <FontAwesomeIcon
                  icon={faFileUpload}
                  className='edit-modal-sm me-0 pe-0'
                  style={{ height: '17px', width: '22px', color: '#231F20' }}
                />
                <h4 className='m-0 p-0 w-75 w-md-25'>
                  {selectedImage ? selectedImage.name : 'Upload Image'}
                </h4>
              </div>
            </label>

            <button onClick={() => submitReport()} className='my-auto'>
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'REPORT'
              )}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default MisconductModal
