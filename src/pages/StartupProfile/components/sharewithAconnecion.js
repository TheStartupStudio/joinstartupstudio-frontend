import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import axiosInstance from '../../../utils/AxiosInstance'
import linkifyHtml from 'linkify-html'
import { shareVideo } from '../../../utils/helpers'

const SharewithAconnecion = (props) => {
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const options = { defaultProtocol: 'https' }
  const clientBaseURL = `${process.env.REACT_APP_CLIENT_BASE_URL}`

  const handleConnectionSelect = (e) => {
    setSelectedConnection({ value: e.value, label: e.label })
    // setSelectDisabled(true)
  }

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {children}
        </components.ValueContainer>
      )
    )
  }

  const submitMessage = async (e) => {
    setSending(true)
    const message = linkifyHtml(
      newMessage.replace(/^\s+|\s+$/g, '') +
        `${newMessage && '\n\n'}${clientBaseURL}/PublishedProject/${
          props.project.id
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
        // props.videoSharedSuccess()
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
      .catch((e) => console.log(e))
  }

  return (
    <div className='mt-4'>
      <Select
        value={
          selectedConnection?.label
            ? { label: selectedConnection?.label }
            : {
                label: 'SEARCH FOR A CONNECTION TO SHARE THIS ARTICLE WITH'
              }
        }
        onChange={handleConnectionSelect}
        options={props.connections}
        placeholder={
          'Start typing the name of the Connection that you’d like to share this project with'
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
        autoFocus={false}
        className=''
      />
      <textarea
        rows={5}
        className={'w-100 mt-4 p-2'}
        style={{ resize: 'none' }}
        placeholder={'Add your message here…'}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        className='float-end edit-account mt-4'
        onClick={() => submitMessage()}
        disabled={sending || !selectedConnection}
      >
        {sending ? (
          <span className='spinner-border spinner-border-sm' />
        ) : (
          'SEND'
        )}
      </button>
    </div>
  )
}

export default SharewithAconnecion
