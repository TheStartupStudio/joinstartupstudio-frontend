import React, { useEffect, useState } from 'react'
import {
  faEnvelope,
  faFileUpload,
  faGlobe,
  faLink,
  faPlus,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, Toast, ToastBody, ToastHeader } from 'react-bootstrap'
import defaultImage from '../../../assets/images/profile-image.png'
import IntlMessages from '../../../utils/IntlMessages'
import { useSelector } from 'react-redux'
import ImageCropper from '../../ImageCropper'
import _ from 'lodash'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import searchIcon from '../../../assets/images/search-icon.png'
import '../index.css'
import axiosInstance from '../../../utils/AxiosInstance'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import SingleFounder from '../../../pages/StartupProfile/components/singleFounder'
import { toast } from 'react-toastify'
import socket from '../../../utils/notificationSocket'
import NotificationTypes from '../../../utils/notificationTypes'

export const CreateNewStartupProfile = (props) => {
  const [loading, setLoading] = useState(false)
  const general = useSelector((state) => state.general)
  const [busienessMedia, setBusienessMedia] = useState()
  const [selectedImage, setSelectedImage] = useState()

  const inputImage = React.useRef(null)
  const [connections, setConnections] = useState()
  const [searchedUser, setSearchedUsers] = useState()
  const [selectedUser, setSelectedUser] = useState([])
  const [data, setBusinessData] = useState()
  const loggedUser = useSelector((state) => state.user.user.user)

  const removeFounder = (id) => {
    const newState = selectedUser.filter((selected) => selected.id != id)
    setSelectedUser(newState)
  }

  useEffect(() => {
    setBusienessMedia(
      props?.data?.social_links ? props?.data?.social_links : {}
    )
    setBusinessData(
      props?.data
        ? props?.data
        : {
            company_name: '',
            company_slogan: '',
            description: ''
          }
    )
  }, [props.data])

  const verify = () => {
    if (data.company_name.length == 0) {
      return toast.error('Project Name need to be filled')
    } else if (data.company_slogan.length == 0) {
      return toast.error('Project Slogan or Tag Line need to be filled')
    } else if (data.description.length == 0) {
      return toast.error('all fields need to filled')
    } else if (selectedImage == undefined) {
      return toast.error('Logo need to upload')
    }
    handleSubmit()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (
      name === 'linkedin' ||
      name === 'twitter' ||
      name === 'instagram' ||
      name === 'facebook' ||
      name === 'website'
    ) {
      setBusienessMedia((prevValues) => ({
        ...prevValues,
        [name]: value
      }))
    } else {
      setBusinessData((prevValues) => ({
        ...prevValues,
        [name]: value
      }))
    }
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
              onClick={() => props.closeChat()}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    )
  }

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

  const getConnections = async () => {
    await axiosInstance
      .get('connect')
      .then((res) => setConnections(res.data.data))
  }

  useEffect(() => {
    getConnections()
  }, [])

  const imageChange = (e) => {
    setBusinessData((prevValues) => ({
      ...prevValues,
      image: null
    }))
    setSelectedImage(e.target.files[0])
  }

  const handleUserSelect = (e) => {
    setSelectedUser((old) => [...old, { ...e.value, role: '' }])
  }

  const updateRole = (e, uid) => {
    selectedUser?.filter((founder) => {
      if (founder.id == uid) {
        founder.role = e.target.value
      }
    })
  }

  const handleUpdate = async () => {
    if (selectedImage != undefined) {
      setLoading(true)
      const formData = new FormData()
      formData.append('img', selectedImage)
      await axiosInstance
        .post('/upload/img-transform', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        .then(async (responseImg) => {
          await axiosInstance
            .put('business/update/Business', {
              ...data,
              image: responseImg.data.fileLocation,
              social_links: {
                facebook: busienessMedia.facebook,
                instagram: busienessMedia.instagram,
                linkedin: busienessMedia.linkedin,
                twitter: busienessMedia.twitter,
                website: busienessMedia.website
              }
              // founders: [...selectedUser]
            })
            .then((response) => {
              toast.success(<IntlMessages id='alerts.success_change' />)
              setLoading(false)
              props.updateState({
                ...data,
                image: responseImg.data.fileLocation,
                social_links: {
                  facebook: busienessMedia.facebook,
                  instagram: busienessMedia.instagram,
                  linkedin: busienessMedia.linkedin,
                  twitter: busienessMedia.twitter,
                  website: busienessMedia.website
                }
              })
              props.onHide()
            })
            .catch((err) => {
              toast.error('Something went wrong, please try again!')
              setLoading(false)
              props.onHide()
            })
        })
    } else {
      await axiosInstance
        .put('business/update/Business', {
          ...data,
          social_links: {
            facebook: busienessMedia.facebook,
            instagram: busienessMedia.instagram,
            linkedin: busienessMedia.linkedin,
            twitter: busienessMedia.twitter,
            website: busienessMedia.website
          }
          // founders: [...selectedUser]
        })
        .then((response) => {
          props.updateState({
            ...data,
            social_links: {
              facebook: busienessMedia.facebook,
              instagram: busienessMedia.instagram,
              linkedin: busienessMedia.linkedin,
              twitter: busienessMedia.twitter,
              website: busienessMedia.website
            }
            // founders: [...selectedUser]
          })
          toast.success(<IntlMessages id='alerts.success_change' />)
          setLoading(false)
          props.onHide()
        })
        .catch((err) => {
          toast.error('Something went wrong, please try again!')
          setLoading(false)
          props.onHide()
        })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('img', selectedImage)
    await axiosInstance
      .post('/upload/img-transform', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      .then(async (response0) => {
        await axiosInstance
          .post('business/', {
            ...data,
            creator: false,
            image: response0.data.fileLocation,
            social_links: {
              facebook: busienessMedia.facebook,
              instagram: busienessMedia.instagram,
              linkedin: busienessMedia.linkedin,
              twitter: busienessMedia.twitter,
              website: busienessMedia.website
            },
            founders: [...selectedUser]
          })
          .then((response) => {
            props.updateData({
              ...data,
              id: response.data.bid,
              creator: false,
              image: response0.data.fileLocation,
              social_links: {
                facebook: busienessMedia.facebook,
                instagram: busienessMedia.instagram,
                linkedin: busienessMedia.linkedin,
                twitter: busienessMedia.twitter,
                website: busienessMedia.website
              },
              founders: [...selectedUser]
            })
            toast.success(<IntlMessages id='alerts.success_change' />)
            setLoading(false)
            props.onHide()
            setSelectedImage('')
            selectedUser.map((sUser) => {
              if (loggedUser.id !== sUser.id) {
                socket?.emit('sendNotification', {
                  sender: loggedUser,
                  receiver: sUser,
                  type: NotificationTypes.ADDED_TO_PROJECT.key,
                  url: `/editProject/${response.data.bid}`
                })
              }
            })
          })
          .catch((err) => {
            toast.error('Something went wrong, please try again!')
            setLoading(false)
            props.onHide()
            setSelectedImage('')
          })
      })
  }
  return (
    <>
      <Modal
        show={props.show}
        onHide={() => props.onHide()}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header className='contact-us-title my-auto p-0 mx-4 general-modal-header'>
          <h3 className='mb-0 pt-4 mt-2 '>
            {props.from === 'edit' ? 'EDIT' : 'ADD'} PROJECT INFORMATION
          </h3>
          <button
            type='button'
            className='btn-close me-1'
            aria-label='Close'
            onClick={() => {
              props.onHide()
              setLoading(false)
              setSelectedImage('')
            }}
          />
        </Modal.Header>
        <Modal.Body className='m-4 p-0 pt-2 px-md-3 mb-0 pb-auto'>
          <div className='row p-auto'>
            <div className='col-lg-4 col-md-12 text-center'>
              <div>
                <div>
                  {selectedImage ? (
                    <img
                      src={
                        data.image_url
                          ? data.image_url
                          : window.URL.createObjectURL(selectedImage)
                      }
                      className='mt-2 rounded-circle addNewProjectModal_image'
                      alt='Thumb'
                    />
                  ) : (
                    <img
                      src={props.from != 'edit' ? defaultImage : data?.image}
                      className='mt-2 rounded-circle addNewProjectModal_image'
                      onClick={() => inputImage.current.click()}
                    />
                  )}
                </div>
                <div className='input-group mt-3 px-md-3'>
                  <div className='profile-image'>
                    <label className='edit-label text-center'>
                      <input
                        type='file'
                        id='inputGroupFile'
                        name='profile_image'
                        accept='image/*'
                        className='d-none'
                        ref={inputImage}
                        onChange={(e) => imageChange(e)}
                      />
                      <div className='mt-md-1 d-flex justify-content-center edit-bio-upload-image'>
                        <span className='addNewLogo my-auto'>
                          Upload New Logo{' '}
                        </span>
                        <FontAwesomeIcon
                          icon={faFileUpload}
                          className='edit-modal-sm ml-2'
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-8 col-md-12 text-center pt-4'>
              <div className='input-group mb-3'>
                <label className='d-block addNewProjectModal_label'>
                  Project Name
                </label>
                <input
                  type='text'
                  className='form-control d-block w-100 addNewProjectModal_label_input'
                  placeholder='Ie. The Startup Studio'
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  onChange={(e) => handleChange(e)}
                  name='company_name'
                  value={props.from == 'edit' ? data?.company_name : null}
                />
              </div>
              <div className='input-group mb-3'>
                <label className='d-block addNewProjectModal_label'>
                  Project Slogan or Tag Line
                </label>
                <input
                  type='text'
                  onChange={(e) => handleChange(e)}
                  className='form-control d-block w-100 addNewProjectModal_label_input'
                  placeholder='ie. Just Do It!'
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  name='company_slogan'
                  value={props.from == 'edit' ? data?.company_slogan : null}
                />
              </div>
              <div className='text-left pt-5 mt-4'>
                <h1 className='addNewProjectModal_sm'>
                  Add Social Media Links
                </h1>
                <div className='input-group mb-3'>
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    className='edit-modal-sm my-auto'
                  />
                  <input
                    type='text'
                    onChange={(e) => handleChange(e)}
                    className='form-control d-block addNewProjectModal_label_input'
                    placeholder='https://www.linkedin.com/in/yourlink/'
                    aria-describedby='basic-addon1'
                    name='linkedin'
                    value={
                      props.from == 'edit' ? busienessMedia?.linkedin : null
                    }
                  />
                </div>
                <div className='input-group mb-3'>
                  <FontAwesomeIcon
                    icon={faTwitterSquare}
                    className='edit-modal-sm my-auto'
                  />
                  <input
                    type='text'
                    onChange={(e) => handleChange(e)}
                    className='form-control d-block addNewProjectModal_label_input'
                    placeholder='https://twitter.com/yourlink'
                    aria-describedby='basic-addon1'
                    value={
                      props.from == 'edit' ? busienessMedia?.twitter : null
                    }
                    name='twitter'
                  />
                </div>
                <div className='input-group mb-3'>
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className='edit-modal-sm my-auto'
                  />
                  <input
                    type='text'
                    onChange={(e) => handleChange(e)}
                    className='form-control d-block addNewProjectModal_label_input'
                    placeholder='https://www.instagram.com/yourlink'
                    aria-describedby='basic-addon1'
                    value={
                      props.from == 'edit' ? busienessMedia?.instagram : null
                    }
                    name='instagram'
                  />
                </div>
                <div className='input-group mb-3'>
                  <FontAwesomeIcon
                    icon={faFacebookSquare}
                    className='edit-modal-sm my-auto'
                  />
                  <input
                    type='text'
                    onChange={(e) => handleChange(e)}
                    className='form-control d-block addNewProjectModal_label_input'
                    placeholder='https://www.facebook.com/yourlink'
                    aria-describedby='basic-addon1'
                    value={
                      props.from == 'edit' ? busienessMedia?.facebook : null
                    }
                    name='facebook'
                  />
                </div>
                <div className='input-group mb-3'>
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className='edit-modal-sm my-auto'
                  />
                  <input
                    type='text'
                    onChange={(e) => handleChange(e)}
                    className='form-control d-block addNewProjectModal_label_input'
                    placeholder='https://www.yourwebsite.com'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                    value={
                      props.from == 'edit' ? busienessMedia?.website : null
                    }
                    name='website'
                  />
                </div>
              </div>
            </div>
            <div className='row mt-4 pe-0 w-100 my-auto'>
              <div className='col-12 col-md-11 ms-auto pe-0 position-relative'>
                <span className='addNewProjectModal_Description'>
                  Add Project Description
                </span>
                <div className='mb-3'>
                  <textarea
                    className='form-control addNewProjectModal_textarea mt-2 px-2'
                    id='exampleFormControlTextarea1'
                    placeholder='Type or paste your project description here. This will be public, so do not include anything that you aren’t comfortable sharing, please.'
                    rows='5'
                    onChange={(e) => handleChange(e)}
                    name='description'
                    value={props.from == 'edit' ? data?.description : null}
                  />
                </div>
                {props.from != 'edit' && (
                  <div className='mb-5 w-100'>
                    <span className='addNewProjectModal_Founders_title'>
                      Add Founders
                    </span>
                    <AsyncSelect
                      className=''
                      value={'NAME/USERNAME OF USER BEING REPORTED'}
                      loadOptions={getFilteredUsers}
                      onChange={(e) => handleUserSelect(e)}
                      // onClick={() => alert('test')}
                      // theme={(theme) => ({
                      //   ...theme,
                      //   borderRadius: 0,
                      //   outLine: 'none',
                      //   colors: {
                      //     ...theme.colors,
                      //     // primary25: 'hotpink',
                      //     primary: '#e4e44',
                      //     neutral0: '#e4e4e4',
                      //     opacity: 1,
                      //     zIndex: 100
                      //   },
                      //   spacing: {
                      //     ...theme.spacing,
                      //     controlHeight: 32
                      //   },
                      //   zIndex: 100
                      // })}
                      // styles={{
                      //   control: (provided, state) => ({
                      //     ...provided,
                      //     boxShadow: 'none',
                      //     border: 'none',
                      //     height: 15,
                      //     fontSize: '14px',
                      //     height: '50px'
                      //   }),
                      //   menu: (base) => ({
                      //     ...base,
                      //     border: 'none',
                      //     boxShadow: 'none',
                      //     fontSize: '14px'
                      //   }),
                      //   valueContainer: (base) => ({
                      //     ...base,
                      //     paddingLeft: 50
                      //   })
                      // }}
                      //   components={{
                      //     ValueContainer,
                      //     DropdownIndicator: () => null,
                      //     IndicatorSeparator: () => null
                      //   }}
                      //   classNamePrefix='vyrill'
                      // />

                      components={{
                        ValueContainer,
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        outLine: 'none',
                        spacing: {
                          ...theme.spacing,
                          controlHeight: 32
                        },
                        colors: {
                          ...theme.colors,
                          neutral50: '#707070' // Placeholder color
                        }
                      })}
                      styles={{
                        valueContainer: (base) => ({
                          ...base,
                          paddingLeft: 60
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: '#707070',
                          fontWeight: '500'
                        }),
                        control: (provided, state) => ({
                          ...provided,
                          boxShadow: 'none',
                          border: 'none',
                          height: 15,
                          backgroundColor: '#e3e1dc',
                          fontSize: '14px',
                          height: '50px',
                          border: '1px solid #BBBDBF',
                          color: '#707070'
                        }),
                        menu: (base) => ({
                          ...base,
                          border: 'none',
                          boxShadow: 'none',
                          fontSize: '14px',
                          border: '1px solid #BBBDBF',
                          color: '#707070'
                        })
                      }}
                      classNamePrefix='vyrill'
                    />

                    {selectedUser &&
                      selectedUser?.map((data) => {
                        return (
                          <SingleFounder
                            data={data}
                            removeFounder={(id) => removeFounder(id)}
                            updateRole={(e, uid) => updateRole(e, uid)}
                          />
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <div className='border-0 me-4'>
          <div className='row p-0 mb-3'>
            <button
              className='float-end ms-auto me-4 edit-account'
              disabled={loading}
              onClick={
                props.from != 'edit' ? () => verify() : () => handleUpdate()
              }
            >
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <IntlMessages id='general.save' />
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
