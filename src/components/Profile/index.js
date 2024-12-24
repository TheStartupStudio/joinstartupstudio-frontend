import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Row from 'react-bootstrap/Row'
import axiosInstance from '../../utils/AxiosInstance'
import { IsUserLevelAuthorized } from '../../utils/helpers'
import './index.css'
import IamrBox from './IamrBox'
import RwlInfoBox from './RwlInfoBox'
import RwlBox from './RwlBox'
import UserInfoBox from './UserInfoBox'

function Profile(props) {
  const user = useSelector((state) => state.user.user.user)
  const [newMessages, setNewMessages] = useState([])
  const isAllowedLevel = IsUserLevelAuthorized()
  const [dashboardWidget, setDashboardWidget] = useState({})

  useEffect(() => {
    getDashboardWidgetData()
    getNewMessages()
  }, [])

  const getDashboardWidgetData = async () => {
    await axiosInstance.get('/dashboard').then((res) => {
      setDashboardWidget(res.data)
      // const cookies = res.headers['set-cookie']
    })
  }

  useEffect(() => {
    if (props.newMessage?.length === 0) return
    const arrivalMessage = props.newMessage
    if (
      arrivalMessage?.chatOpen &&
      arrivalMessage?.currentConversation ==
        arrivalMessage?.arrivalMessage.room_id
    )
      return

    const unReadMessageExists = newMessages.some(
      (newMessage) => newMessage.id === arrivalMessage?.arrivalMessage.room_id
    )

    if (
      !unReadMessageExists &&
      arrivalMessage?.arrivalMessage.from !== user.id
    ) {
      setNewMessages([
        ...newMessages,
        { id: arrivalMessage?.arrivalMessage.room_id }
      ])
    } else if (
      unReadMessageExists &&
      arrivalMessage?.arrivalMessage.from === user.id
    ) {
      setNewMessages(
        newMessages.filter(
          (message) => message.id !== arrivalMessage?.arrivalMessage.room_id
        )
      )
    }
  }, [props.newMessage, user.id, newMessages])

  useEffect(() => {
    if (!props.chatOpened) return
    const room_id = props.chatOpened
    setNewMessages(newMessages.filter((room) => room.id != room_id))
    props.clearChat('')
  }, [props.chatOpened])

  const getNewMessages = async () => {
    if (!isAllowedLevel) return
    await axiosInstance
      .get('/privateChat/unread-messages')
      .then((data) => {
        setNewMessages(data.data)
      })
      .catch((err) => err)
  }

  return (
    <Row className='mx-0'>
      <UserInfoBox user={user} />

      <RwlBox dashboardWidget={dashboardWidget} userRole={props.userRole} />

      <IamrBox user={user} userRole={props.userRole} />

      <RwlInfoBox dashboardWidget={dashboardWidget} />
    </Row>
  )
}

export default Profile
