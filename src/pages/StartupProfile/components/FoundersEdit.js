import {
  faChevronLeft,
  faChevronRight,
  faPencilAlt as faPen
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import ConnectionBox from '../../../components/Connections/connectionBox'
import EditFounderModal from './Modals/EditFounderModal'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import socket from '../../../utils/notificationSocket'
import NotificationTypes from '../../../utils/notificationTypes'
import { toast } from 'react-toastify'
import IntlMessages from '../../../utils/IntlMessages'

const FoundersEdit = (props) => {
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(2)
  const [width, setWidth] = useState(window.innerWidth)
  const [OpenEditFounderModal, setopenEditFounderModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const id = useParams().id
  const [deletetFounders, setDeletedFounders] = useState([])
  const [founder, setFounder] = useState([])

  const loggedUser = useSelector((state) => state.user.user.user)

  useEffect(() => {
    getProject()
  }, [])

  const save = async () => {
    setLoading(true)
    await axiosInstance
      .post('/business/delete/founders', deletetFounders)
      .then((res) => {})
      .catch((res) => {})

    await axiosInstance
      .put('/business/update/founders', founder)
      .then((response) => {
        setopenEditFounderModal(false)
        toast.success('Founders saved successful')
        founder.map((item, index) => {
          if (item.hasOwnProperty('newFounder') && loggedUser.id !== item.id) {
            socket?.emit('sendNotification', {
              sender: loggedUser,
              receivers: [item],
              type: NotificationTypes.ADDED_TO_PROJECT.key,
              url: `/PublishedProject/${item.id}`
            })
          }
          setLoading(false)
        })
      })
  }
  // get data update and more from here

  const updateShowPreferenceFounder = async (e, id, value) => {
    const name = e.target.name
    if (name == 'showFounder') {
      await axiosInstance
        .put('/Business/update/founder', {
          is_visible: value,
          user_id: id,
          business_id: props.data.id
        })
        .then((res) => {
          // setFounder((oldData) => ({
          //   ...oldData,
          //   show_founders: !oldData.show_founders
          // }))          setFounder((old) => {
          setFounder(
            founder?.map((founder) => {
              if (founder.Business_Founders.user_id == id) {
                return {
                  ...founder,
                  Business_Founders: {
                    ...founder.Business_Founders,
                    is_visible: value
                  }
                }
              }
              return founder
            })
          )
        })
        .catch((err) => err)
    }
  }

  const getProject = async () =>
    await axiosInstance.get('/business/edit/' + id).then((res) => {
      setFounder(res.data.data.founders)
    })
  const handleUserSelect = (e) => {
    setDeletedFounders(founder.filter((item) => item.id !== e.value.id))
    setFounder((old) => [
      ...old,
      {
        ...e.value,
        newFounder: true,
        business_id: props.data.id,
        Business_Founders: {
          role: '',
          business_id: props.data.id,
          user_id: e.value.id
        }
      }
    ])
  }

  const updateState = (e, id) => {
    founder.forEach((founder) => {
      if (founder.id == id) {
        founder.Business_Founders.role = e.target.value
      }
    })
  }

  const removeFounder = (id) => {
    var state = founder.filter((founder) => founder.id != id)
    setFounder(state)
    let founders = [...founder]
    founder.push(founders)
    setDeletedFounders((old) => [
      ...old,
      { business_id: props.data.id, user_id: id }
    ])
    deletetFounders.push({ business_id: props.data.id, user_id: id })
    setDeletedFounders(deletetFounders)

    // var removeIndex = founder.map((item) => item.id).indexOf(id)
    // setFounder(removeIndex && founder.splice(removeIndex, 1))
  }
  // to here

  const handlePreviousConnection = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
      setEndIndex(endIndex - 1)
    }
  }
  const handleNextConnection = () => {
    if (endIndex < founder.length) {
      setStartIndex(startIndex + 1)
      setEndIndex(endIndex + 1)
    }
  }

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    setStartIndex(0)
    if (width >= 1800) {
      setEndIndex(3)
    } else if (width > 1650 && width < 1800) {
      setEndIndex(2)
    } else if (width > 992 && width < 1650) {
      setEndIndex(1)
    } else if (width > 735 && width < 992) {
      setEndIndex(3)
    } else if (width > 530 && width < 735) {
      setEndIndex(2)
    } else {
      setEndIndex(2)
    }
  }, [width])

  // useEffect(() => {
  //   setEndIndex(0)
  //   if (width >= 2340) {
  //     setEndIndex(3)
  //   } else if (width > 1700 && width < 2340) {
  //     setEndIndex(2)
  //   } else if (width > 992 && width < 1700) {
  //     setEndIndex(2)
  //   } else if (width > 780 && width < 992) {
  //     setEndIndex(3)
  //   } else if (width > 735 && width < 780) {
  //     setEndIndex(2)
  //   } else if (width > 530 && width < 735) {
  //     setEndIndex(2)
  //   } else {
  //     setEndIndex(1)
  //   }
  // }, [width])

  return (
    <div className="col-12 col-lg-6 mt-4 mt-lg-0">
      <div className="col-12 border border-2 rounded py-3 px-4 h-100">
        <div className="edit_project_video py-2">
          <span className="edit_project_video_title d-block pb-3">
            FOUNDERS
            <FontAwesomeIcon
              icon={faPen}
              className="ms-auto float-end"
              onClick={() => {
                setopenEditFounderModal(true)
              }}
            />
          </span>
          <span className="edit_project_video_info mt-3 d-block">
            <label className="px-0 ps-sm-1 ps-md-1 float-end my-auto form-switch d-flex">
              <input
                type="checkbox"
                name="showFounders"
                checked={props.data?.show_founders}
                onChange={(e) =>
                  props.updateShowPreference(e, 0, !props.data?.show_founders)
                }
              />
              <i className="my-auto"></i>
            </label>
            <span className="ms-auto float-end me-2">Show on Project Page</span>
          </span>
        </div>
        <div className="mx-auto my-auto mb-4 col-12 row gx-0 px-0 mx-0">
          <div className="mx-auto row gx-0 px-0 mt-2">
            <div
              className={`card-group desktop-menu mt-3 
        ${
          founder && founder.length >= 2 ? 'justify-content-md-between' : 'ms-2'
        }`}
            >
              {founder.length >= 2 && (
                <div className="my-auto">
                  <button
                    className="videos-track"
                    onClick={handlePreviousConnection}
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="videos-track-icon"
                    />
                  </button>
                </div>
              )}
              {founder &&
                founder
                  ?.slice(startIndex, endIndex)
                  .map((data, index) => (
                    <ConnectionBox
                      key={index}
                      data={data}
                      from={'EditPage'}
                      updateShowPreference={(e, id, value) =>
                        updateShowPreferenceFounder(e, id, value)
                      }
                      isChecked={data?.Business_Founders?.is_visible}
                    />
                  ))}
              {founder.length >= 2 && (
                <div className="my-auto">
                  <button
                    className="videos-track"
                    onClick={handleNextConnection}
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="videos-track-icon"
                    />
                  </button>
                </div>
              )}
            </div>
            <div className="card-group mobile-menu justify-content-center">
              {founder.length > 1 && (
                <div className="my-auto">
                  <button
                    className="videos-track"
                    onClick={handlePreviousConnection}
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="videos-track-icon"
                    />
                  </button>
                </div>
              )}
              <div className="mx-3 d-flex justify-content-between">
                {founder?.slice(startIndex, endIndex).map((data, index) => (
                  <ConnectionBox
                    data={data}
                    key={index}
                    from={'EditPage'}
                    updateShowPreference={(e, id, value) =>
                      updateShowPreferenceFounder(e, id, value)
                    }
                    isChecked={data?.Business_Founders?.is_visible}
                  />
                ))}
              </div>
              {founder.length > 1 && (
                <div className="my-auto">
                  <button
                    className="videos-track"
                    onClick={handleNextConnection}
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="videos-track-icon"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <EditFounderModal
          show={OpenEditFounderModal}
          onHide={() => setopenEditFounderModal(false)}
          handleUserSelect={(data) => handleUserSelect(data)}
          founder={founder}
          save={() => save()}
          updateState={(e, uid) => {
            updateState(e, uid)
          }}
          loading={loading}
          removeFounder={(id) => {
            removeFounder(id)
          }}
        />
      </div>
    </div>
  )
}

export default FoundersEdit
