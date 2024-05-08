import React, { useEffect, useState } from 'react'
import { Col, Form, Modal } from 'react-bootstrap'
import Select from 'react-select'
import axiosInstance from '../../utils/AxiosInstance'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import './index.css'
import { useHistory } from 'react-router-dom'
import Notifications from '../Header/notifications'
import NotificationComponent from './Notification.component'
import socket from '../../utils/notificationSocket'
import { useDispatch, useSelector } from 'react-redux'
import NotificationTypes from '../../utils/notificationTypes'
import BriefingComponent from './Briefing.component'
import { changeSidebarState } from '../../redux'
import { getEventsStart, getPeriodsStart } from '../../redux/dashboard/Actions'
import {
  editBriefingStart,
  getBriefingsStart,
  postBriefingStart
} from '../../redux/header/Actions'
import { editBriefing } from '../../redux/header/Service'
import JournalsManagement from '../../pages/JournalsManagement'

const StudentOfInstructors = (props) => {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedInstructors, setSelectedInstructors] = useState([])
  const [selectedInstructorsName, setSelectedInstructorsName] = useState([])
  const [isUniChosed, setUniChosed] = useState(0)
  const [totalNumber, setTotalNumber] = useState(-1)
  const [dashboardData, setDashboardData] = useState([])
  const [toShow, setStateToShow] = useState('none')
  const history = useHistory()

  const JournalsManagement2 = React.lazy(() =>
    import('../../pages/JournalsManagement/JournalsManagement2')
  )

  const getData = async () => {
    await axiosInstance.get('/studentsInstructorss/init').then((res) => {
      setUniversities(res.data)
    })
    await axiosInstance.get('/dashboard').then((res) => {
      setDashboardData(res.data)
    })
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided
    })
  }

  const submit = async () => {
    setLoading(true)
    await axiosInstance
      .post('/studentsInstructorss/users-instructor/count', selectedInstructors)
      .then((responseData) => {
        setLoading(false)
        setTotalNumber(responseData.data.data)
        setSelectedInstructors([])
        setUniChosed(0)
        setSelectedInstructorsName([])
      })
  }

  useEffect(() => {
    if (props.allow) {
      getData()
    }
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const changeDashboard = (value) => {
    axiosInstance
      .put(`/dashboard/${dashboardData?.id}`, dashboardData)
      .then((res) => {
        toast.success('Dashboard widget updated successfully.')
      })
      .catch((e) => {
        toast.error('Dashboard widget update failed.')
      })
  }

  const [notifications, setNotifications] = useState([
    {
      title: '',
      description: '',
      url: ''
    }
  ])

  const onAddNewNotification = () => {
    setNotifications([
      ...notifications,
      {
        title: '',
        description: '',
        link: ''
      }
    ])
  }

  const handleChangeNotifications = (notification, index) => {
    let newNotifications = [...notifications]
    newNotifications[index] = notification
    setNotifications(newNotifications)
  }

  const loggedUser = useSelector((state) => state.user.user.user)

  const handleSubmitNotification = () => {
    try {
      socket?.emit('sendNotification', {
        notifications: notifications,
        sender: loggedUser,
        receiver: null,
        from: 'manual',
        type: NotificationTypes.DEFAULT_NOTIFICATION.key
      })
      setNotifications([{ title: '', description: '', link: '' }])
      toast.success('Notification added successfully!')
    } catch (e) {
      toast.error('Notification adding error!')
    }
  }

  const removeNotification = (e, index) => {
    const newNotifications = [...notifications]
    newNotifications.splice(index, 1)
    setNotifications(newNotifications)
  }

  const dispatch = useDispatch()

  const briefings = useSelector((state) => state.header.briefings)
  const [briefing, setBriefing] = useState(null)
  useEffect(() => {
    dispatch(getBriefingsStart())
  }, [])

  const handleChangeBriefing = (briefing) => {
    setBriefing(briefing)
  }

  const onSubmitBriefing = () => {
    if (briefings.length) {
      dispatch(editBriefingStart(briefing, briefing.id))
    } else {
      dispatch(postBriefingStart(briefing))
    }
  }
  return (
    <Modal
      show={props.onShow}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      id=""
    >
      <Modal.Header className="contact-us-title my-auto general-modal-header p-0 mx-4">
        <h3 className="mb-0 pt-4 mt-2">Admin panel</h3>
        <button
          type="button"
          className="btn-close me-1 mt-0 pt-1"
          aria-label="Close"
          onClick={() => {
            props.onHide()
            setStateToShow('none')
          }}
        />
      </Modal.Header>
      <Modal.Body style={{ minHeight: '150px' }}>
        <>
          <div className="row px-md-4 mt-md-4">
            <div className="col-12 col-md-6 px-md-4">
              <button
                className={`btn w-100  ${
                  toShow == 'CountStudent'
                    ? 'brand-button-active'
                    : 'brand-button'
                }`}
                onClick={() =>
                  toShow == 'CountStudent'
                    ? setStateToShow('none')
                    : setStateToShow('CountStudent')
                }
              >
                {toShow == 'CountStudent' ? 'Close' : 'Student Count'}
              </button>
            </div>
            <div className="col-12 col-md-6 px-md-4">
              <button
                className={`btn  w-100 brand-button ${
                  toShow == 'dashboard' ? 'brand-button-active' : 'brand-button'
                }`}
                onClick={() =>
                  toShow == 'dashboard'
                    ? setStateToShow('none')
                    : setStateToShow('dashboard')
                }
              >
                {toShow == 'dashboard' ? 'Close' : 'Edit dashboard'}
              </button>
            </div>
          </div>
          <div className="row px-md-4 mt-md-4">
            <div className="col-12 col-md-6 px-md-4">
              <button
                className={`btn  w-100 brand-button ${
                  toShow == 'notifications'
                    ? 'brand-button-active'
                    : 'brand-button'
                }`}
                onClick={() =>
                  toShow == 'notifications'
                    ? setStateToShow('none')
                    : setStateToShow('notifications')
                }
              >
                {toShow == 'notifications' ? 'Close' : 'Notifications box'}
              </button>
            </div>

            <div className="col-12 col-md-6 px-md-4">
              <button
                className={`btn  w-100 brand-button ${
                  toShow == 'briefing' ? 'brand-button-active' : 'brand-button'
                }`}
                onClick={() =>
                  toShow == 'briefing'
                    ? setStateToShow('none')
                    : setStateToShow('briefing')
                }
              >
                {toShow == 'briefing' ? 'Close' : 'Briefing section'}
              </button>
            </div>
          </div>
          <div className="row px-md-4 mt-md-4">
            <div className="col-12 col-md-6 px-md-4">
              <button
                className={`btn  w-100 brand-button ${
                  toShow == 'journal-edit'
                    ? 'brand-button-active'
                    : 'brand-button'
                }`}
                onClick={() =>
                  toShow == 'journal-edit'
                    ? setStateToShow('none')
                    : setStateToShow('journal-edit')
                }
              >
                {toShow == 'journal-edit' ? 'Close' : 'Edit Journals'}
              </button>
            </div>
          </div>
        </>
        <div className="row"></div>
        {toShow != 'none' && <hr />}
        {toShow == 'dashboard' && (
          <>
            <Form onSubmit={handleSubmit(changeDashboard)}>
              <div className="mb-4 py-2 px-md-2 row">
                <Col sm={12} md={12}>
                  <label htmlFor="text" className="brand-text mt-3">
                    Text to show
                  </label>
                  <textarea
                    className="mt-2 mb-2 col-12 p-md-2"
                    name="text"
                    rows={4}
                    placeholder={'Description'}
                    value={dashboardData ? dashboardData.description : ''}
                    onChange={(e) =>
                      setDashboardData((old) => ({
                        ...old,
                        description: e.target.value
                      }))
                    }
                  />
                </Col>
                <Col sm={12} md={12}>
                  <label htmlFor="link" className="brand-text">
                    Link to redirect
                  </label>
                  <input
                    className="mt-2 mb-2 col-12 p-md-2"
                    type="text"
                    name="link"
                    placeholder={'Link'}
                    value={dashboardData ? dashboardData.link : ''}
                    onChange={(e) =>
                      setDashboardData((old) => ({
                        ...old,
                        link: e.target.value
                      }))
                    }
                  />
                </Col>
                <Col sm={12} md={12} className="row mb-4">
                  <p
                    className="brand-text mb-0 col-12"
                    style={{ fontSize: '18px' }}
                  >
                    Read
                  </p>
                  <div className="col-12 col-md-6">
                    <label htmlFor="title" className="brand-text">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="p-md-2 w-100"
                      placeholder={'Title'}
                      value={dashboardData ? dashboardData?.read?.title : ''}
                      onChange={(e) =>
                        setDashboardData((old) => ({
                          ...old,
                          read: {
                            ...old.read,
                            title: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="author" className="brand-text">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      className="p-md-2 w-100"
                      placeholder={'author'}
                      value={dashboardData ? dashboardData?.read?.author : ''}
                      onChange={(e) =>
                        setDashboardData((old) => ({
                          ...old,
                          read: {
                            ...old.read,
                            author: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                </Col>
                <Col sm={12} md={12} className="row mb-4">
                  <p
                    className="brand-text mb-0 col-12"
                    style={{ fontSize: '18px' }}
                  >
                    Watch
                  </p>
                  <div className="col-12 col-md-6">
                    <label htmlFor="title" className="brand-text">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="p-md-2 w-100"
                      placeholder={'Title'}
                      value={dashboardData ? dashboardData?.watch?.title : ''}
                      onChange={(e) =>
                        setDashboardData((old) => ({
                          ...old,
                          watch: {
                            ...old.watch,
                            title: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="author" className="brand-text">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      className="p-md-2 w-100"
                      placeholder={'author'}
                      value={dashboardData ? dashboardData?.watch?.author : ''}
                      onChange={(e) =>
                        setDashboardData((old) => ({
                          ...old,
                          watch: {
                            ...old.watch,
                            author: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                </Col>
                <Col sm={12} md={12} className="row mb-4">
                  <p
                    className="brand-text mb-0 col-12"
                    style={{ fontSize: '18px' }}
                  >
                    Listen
                  </p>
                  <div className="col-12 col-md-6">
                    <label htmlFor="title" className="brand-text">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="p-md-2 w-100"
                      placeholder={'Title'}
                      value={dashboardData ? dashboardData?.listen?.title : ''}
                      onChange={(e) =>
                        setDashboardData((old) => ({
                          ...old,
                          listen: {
                            ...old.listen,
                            title: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="author" className="brand-text">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      className="p-md-2 w-100"
                      placeholder={'author'}
                      value={dashboardData ? dashboardData?.listen?.author : ''}
                      onChange={(e) =>
                        setDashboardData((old) => ({
                          ...old,
                          listen: {
                            ...old.listen,
                            author: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                </Col>
              </div>
              <button
                className="btn w-100 save-button add-new-note-button-text fw-bold brand-button"
                type="submit"
              >
                Submit
              </button>
            </Form>
          </>
        )}
        {toShow == 'CountStudent' && (
          <>
            <div className="mb-4 py-2 px-md-2 row">
              <>
                <Select
                  placeholder={'Select Uni'}
                  options={universities}
                  name="year"
                  styles={{
                    ...customStyles,
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999
                    })
                  }}
                  className={`my-auto py-auto add-student-select col-12 mt-2 px-0 px-md-auto mb-4`}
                  onChange={(e) => {
                    setUniChosed(e.value)
                    setSelectedInstructors([])
                    setSelectedInstructorsName([])
                    setTotalNumber(-1)
                  }}
                />
                <div className="row col-12 col-md-7">
                  {universities?.filter((uni) => uni.value == isUniChosed)[0]
                    ?.universityInstructors.length != 0 &&
                  !(
                    selectedInstructorsName.length == 0 &&
                    isUniChosed == 0 &&
                    totalNumber == -1
                  ) ? (
                    <>
                      <p className="text-starts fw-bold mb-3">Instructors</p>
                    </>
                  ) : (
                    ''
                  )}
                  {universities
                    .filter((univerity) => univerity.value == isUniChosed)[0]
                    ?.universityInstructors.map((instructor, index) => (
                      <div className="mb-2">
                        <label htmlFor={`instructor ${instructor.User.id}`}>
                          {instructor.User.name}
                        </label>
                        <input
                          style={{ fontSize: '19px' }}
                          type="checkbox"
                          key={index + instructor.User.id}
                          id={`instructor ${instructor.User.id}`}
                          name={`${instructor.User.name}`}
                          value={`${instructor.instructorId}`}
                          className="my-auto float-end px-0 ps-sm-1 ps-md-1 float-end my-auto form-switch d-flex"
                          onChange={(e) => {
                            if (selectedInstructors.includes(e.target.value)) {
                              const index = selectedInstructors.indexOf(
                                e.target.value
                              )
                              if (index > -1) {
                                // only splice array when item is found
                                selectedInstructors.splice(index, 1) // 2nd parameter means remove one item only
                              }
                              const indexName = selectedInstructorsName.indexOf(
                                e.target.name
                              )
                              if (indexName > -1) {
                                // only splice array when item is found
                                selectedInstructorsName.splice(indexName, 1) // 2nd parameter means remove one item only
                              }
                              setSelectedInstructorsName((old) => [
                                ...selectedInstructorsName
                              ])
                              setSelectedInstructors((old) => [
                                ...old,
                                selectedInstructors
                              ])
                            } else {
                              setSelectedInstructorsName((old) => [
                                ...old,
                                e.target.name
                              ])
                              setSelectedInstructors((old) => [
                                ...old,
                                e.target.value
                              ])
                            }
                          }}
                        />
                      </div>
                    ))}
                </div>
                {totalNumber != -1 ? (
                  <p className="fw-bolder text-center w-100">
                    Total active students: {totalNumber}
                  </p>
                ) : (
                  ''
                )}
                {universities?.filter((uni) => uni.value == isUniChosed)[0]
                  ?.universityInstructors.length == 0 ? (
                  <p className="text-center fw-bold">
                    This university don't have any instructor
                  </p>
                ) : (
                  ''
                )}
                {selectedInstructorsName.length == 0 &&
                isUniChosed == 0 &&
                totalNumber == -1 ? (
                  <p className="text-center fw-bold">
                    You don't have selected anything
                  </p>
                ) : (
                  ''
                )}
                <div className="col-12 col-md-5 text-center ">
                  {selectedInstructorsName?.length != 0 ? (
                    <span className="fw-bolder">Selected Users</span>
                  ) : (
                    ''
                  )}

                  {selectedInstructorsName?.map((instructor) => (
                    <p className={'w-100 py-0 mt-1 mb-0 text-start'}>
                      {instructor}
                    </p>
                  ))}
                </div>
              </>
            </div>
          </>
        )}
        {toShow === 'notifications' && (
          <>
            {notifications.map((notification, index) => (
              <NotificationComponent
                key={index}
                handleChange={(e) => {
                  handleChangeNotifications(e, index)
                }}
                handleRemove={(e) => {
                  removeNotification(e, index)
                }}
                notification={notification}
                notifications={notifications}
              />
            ))}
            <div className={'d-flex justify-content-end mb-2'}>
              <button
                className="float-end m-0 px-md-5 save-button add-new-note-button-text"
                onClick={onAddNewNotification}
              >
                {loading ? 'loading' : 'Add more'}
              </button>
            </div>
            <div>
              <button
                className="float-end m-0 px-md-5 w-100 save-button add-new-note-button-text"
                onClick={handleSubmitNotification}
              >
                {loading ? 'loading' : 'Submit'}
              </button>
            </div>
          </>
        )}
        {toShow === 'briefing' && (
          <>
            <BriefingComponent
              handleChange={(e) => {
                handleChangeBriefing(e)
              }}
              briefing={briefings[0]}
            />

            <div>
              <button
                className="float-end m-0 px-md-5 w-100 save-button add-new-note-button-text"
                onClick={onSubmitBriefing}
              >
                {loading ? 'loading' : 'Submit'}
              </button>
            </div>
          </>
        )}
        {console.log(toShow, 'toSHow')}
        {toShow === 'journal-edit' && <JournalsManagement2 />}
      </Modal.Body>
      <Modal.Footer style={{ border: '0px' }}>
        {toShow == 'CountStudent' && (
          <button
            className="float-end m-0 px-md-5 w-100 save-button add-new-note-button-text"
            onClick={submit}
          >
            {loading ? 'loading' : 'Show'}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default StudentOfInstructors
