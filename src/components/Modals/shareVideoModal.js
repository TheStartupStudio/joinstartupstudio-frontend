import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import Select, { components } from 'react-select'
import * as linkify from 'linkifyjs'
import linkifyHtml from 'linkify-html'
import { useSelector } from 'react-redux'
import { shareVideo } from '../../utils/helpers'

export const ShareVideoModal = (props) => {
  const defaultExperienceData = {
    type: 'experience',
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    present: false,
    description: '',
    external_links: { link: '', file: '' },
    image_url: ''
  }

  const [selectedConnection, setSelectedConnection] = useState(null)
  const [connections, setConnections] = useState([])
  const [videoData, setVideoData] = useState([])
  // const [selectDisabled, setSelectDisabled] = useState(false)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const options = { defaultProtocol: 'https' }
  const userData = useSelector((state) => {
    const { id, name, profile_image, username } = state.user.user.user
    return { id, name, profile_image, username }
  })
  const clientBaseURL = `${process.env.REACT_APP_CLIENT_BASE_URL}`

  useEffect(() => {
    if (props.videoData) {
      setVideoData(props.videoData)
    }
  }, [props.videoData])

  useEffect(() => {
    if (props.connections?.length) {
      setConnections(
        props.connections.map((connection, index) => {
          return {
            label: connection.name,
            value: connection,
            key: index
          }
        })
      )
    }
  }, [props.connections])

  const handleConnectionSelect = (e) => {
    setSelectedConnection({ value: e.value, label: e.label })
    // setSelectDisabled(true)
  }

  const submitMessage = async (e) => {
    setSending(true)
    const message = linkifyHtml(
      newMessage.replace(/^\s+|\s+$/g, '') +
        `${newMessage && '\n\n'}${clientBaseURL}/beyond-your-course/${
          videoData.id
        }`,
      options
    )

    const today = new Date()
    const dateNow =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate() +
      ' ' +
      today.getHours() +
      ':' +
      today.getMinutes() +
      ':' +
      today.getSeconds()

    await axiosInstance
      .post(`/privateChat/by-external/${selectedConnection.value.id}`, {
        type: 1,
        message: message
      })
      .then(async (res) => {
        props.onHide()
        setSending(false)
        props.videoSharedSuccess()
        setSelectedConnection(null)
        // setSelectDisabled(false)
        const messageData = {
          from: res.data.data.from,
          to: selectedConnection.value.id,
          message: message,
          room_id: res.data.data.room_id,
          user_id: res.data.data.from.id,
          createdAt: dateNow
        }

        shareVideo(messageData)
      })
      .catch((e) => e)
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

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop='static'
        keyboard={false}
        className='edit-experience-modal share-video-modal px-4'
      >
        <Modal.Header className='pb-0 general-modal-header'>
          <h3 className='mt-4 mb-0 contact-bio'>
            SHARE VIDEO WITH A CONNECTION
          </h3>
          <button
            type='button'
            className='btn-close me-1 me-md-1 mb-md-2 ms-2 ms-md-0 mt-2 mt-md-0 my-auto mt-0 pt-1'
            aria-label='Close'
            onClick={() => {
              props.onHide()
              setSelectedConnection(null)
              // setSelectDisabled(false)
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='row mx-0'>
              <div className='col-12 mt-2 mb-2'>
                <Select
                  value={
                    selectedConnection?.label
                      ? { label: selectedConnection?.label }
                      : {
                          label:
                            'SEARCH FOR A CONNECTION TO SHARE THIS ARTICLE WITH'
                        }
                  }
                  onChange={handleConnectionSelect}
                  options={connections}
                  placeholder={
                    'SEARCH FOR A CONNECTION TO SHARE THIS ARTICLE WITH'
                  }
                  // openMenuOnClick={false}
                  // isDisabled={selectDisabled}
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
                  // autoFocus={false}
                />
              </div>
              <div className='col-12'>
                <textarea
                  name=''
                  id=''
                  cols='30'
                  rows='10'
                  placeholder='What do you want to say?'
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>
              </div>
              <div className='col-12 mt-2'>
                <div className='post-container'>
                  <h3 className='p-0 ps-2 my-2'>
                    {' '}
                    <IntlMessages id={videoData?.title} />
                  </h3>
                  <img src={videoData?.thumbnail} alt='' />
                  <p className='ps-2 my-2'>
                    <IntlMessages id={videoData?.description} />
                  </p>
                </div>
              </div>
              <div className='col-12'>
                <button
                  className='float-end edit-account mt-4'
                  onClick={() => submitMessage()}
                  disabled={sending || !selectedConnection}
                >
                  {sending ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'SHARE'
                  )}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
