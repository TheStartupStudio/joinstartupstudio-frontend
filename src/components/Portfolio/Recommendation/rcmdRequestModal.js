import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import Select from 'react-select'
import { useEffect } from 'react'
import socket from '../../../utils/notificationSocket'
import { useSelector } from 'react-redux'
import NotificationTypes from '../../../utils/notificationTypes'

export const RcmdRequestModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [connections, setConnections] = useState([])
  const loggedUser = useSelector((state) => state.user.user.user)

  const defaultData = {
    relationship: '',
    position: '',
    message: ''
  }

  const [rcmdRequestData, setRcmdRequestData] = useState(defaultData)

  const handleChange = (event) => {
    const { name, value } = event.target
    setRcmdRequestData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

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

  const handleConnectionSelect = (selected) => {
    setSelectedConnection(selected)
  }

  const closeModal = () => {
    props.onHide()
    setSelectedConnection(null)
    setRcmdRequestData(defaultData)
  }

  const submitRequest = async () => {
    if (!selectedConnection) {
      return toast.error(
        'Please select the user you want to get the recommendation from!'
      )
    }

    if (!rcmdRequestData.relationship || !rcmdRequestData.position)
      return toast.error('Please fill in all the required fields.')

    setLoading(true)

    await axiosInstance
      .post(`/recommendations`, {
        ...rcmdRequestData,
        to: selectedConnection.value.id
      })
      .then((res) => {
        closeModal()
        setLoading(false)

        if (selectedConnection.value.id !== loggedUser.id) {
          socket?.emit('sendNotification', {
            sender: loggedUser,
            receiver: { id: selectedConnection.value.id },
            type: NotificationTypes.RECOMMENDATION_REQUEST.key,
            url: `/edit-portfolio/recommendation/${res.data.id}`
          })
        }

        toast.success('Recommendation request sent successfully!')
      })
      .catch((err) => {
        closeModal()
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  return (
    <Modal
      show={props.show}
      onHide={() => closeModal()}
      backdrop='static'
      keyboard={false}
      style={{ marginTop: '3rem' }}
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2 '>EDIT RECOMMENDATIONS</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={() => closeModal()}
        />
      </Modal.Header>
      <Modal.Body className='misconduct-modal mx-2'>
        <h3>Request a Recommendation</h3>
        <div className='mt-3'>
          <Select
            value={
              selectedConnection?.label
                ? { label: selectedConnection?.label }
                : {
                    label: 'Who do you want to ask?*'
                  }
            }
            onChange={handleConnectionSelect}
            options={connections}
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
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null
            }}
            classNamePrefix='vyrill'
            // autoFocus={false}
          />
        </div>

        <div className='contact-us'>
          <input
            className='my-2'
            type='text'
            name='relationship'
            value={rcmdRequestData?.relationship}
            onChange={handleChange}
            placeholder='Relationship to _________ (name of person in first box goes here)*'
          />
          <input
            className='my-2'
            type='text'
            name='position'
            value={rcmdRequestData?.position}
            onChange={handleChange}
            placeholder='Position at the time*'
          />
          <input
            className='my-2'
            type='text'
            name='message'
            value={rcmdRequestData?.message}
            onChange={handleChange}
            placeholder='Add a personal message to your request'
          />
          <button onClick={() => submitRequest()} className='mt-2 my-auto'>
            {loading ? (
              <span className='spinner-border spinner-border-sm' />
            ) : (
              'SEND'
            )}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
