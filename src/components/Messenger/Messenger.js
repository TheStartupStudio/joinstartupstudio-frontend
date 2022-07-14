import React, { useEffect, useState, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Conversation from './Conversation'
import Chat from './Chat'
import Search from './Search'
import SearchMessages from './SearchMessages'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { FormattedMessage } from 'react-intl'
import searchIcon from '../../assets/images/search-icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import io from 'socket.io-client'
import './messenger.css'
import FoulWords from '../../utils/FoulWords'
import { MESSENGER } from '../../utils/constants'
import { WarningModal } from '../Modals/Connections/warningModal'
import { MessageWarningModal } from './MessageWarningModal'

const Messenger = (props) => {
  const [conversations, setConversations] = useState([])
  const [connections, setConnections] = useState([])
  const [chatOpen, setChatOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentConversation, setCurrentConversation] = useState('')
  const [newChatMessage, setNewChatMessage] = useState(null)
  const [friendId, setFriendId] = useState('')
  const [friendName, setFriendName] = useState('')
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const loggedUserId = useSelector((state) => state.user.user.user.id)
  const [searchedMessage, setSearchedMessage] = useState('')
  const [searchingMessages, setSearchingMessages] = useState('')
  const [searchingMessage, setSearchingMessage] = useState('')
  const [searchedMessageId, setSearchedMessageId] = useState('')
  const [foulWords, setFoulWords] = useState(null)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const lastLogin = useSelector((state) => state.user.user.user.last_login)

  const socket = useRef()
  const serverBaseURL = `${process.env.REACT_APP_SERVER_BASE_URL}`

  useEffect(() => {
    socket.current = io(`${serverBaseURL}`)
    socket.current.on('getMessage', (data) => {
      setArrivalMessage(data)
    })
    getUserConversations()
    getUserConnections()
    socket.current.emit('addUser', loggedUserId)

    if (lastLogin === null && !localStorage.getItem('agreedMessages'))
      setShowWarningModal(true)
  }, [])

  useEffect(() => {
    if (!arrivalMessage) return
    props.newMessage &&
      props.newMessage({
        arrivalMessage: arrivalMessage,
        chatOpen,
        currentConversation
      })
    if (!currentConversation && chatOpen && friendId === arrivalMessage.to) {
      setCurrentConversation(arrivalMessage.room_id)
      getUserConversations()
      setNewChatMessage(arrivalMessage)
      return
    }

    const checkConversationExist = conversations.filter((conversation) => {
      return conversation.id === arrivalMessage.room_id
    })

    if (checkConversationExist.length === 0) {
      getUserConversations()
      return
    }

    // if (!currentConversation && chatOpen && friendId === arrivalMessage.to) {
    // }
    setConversations(() => {
      const updatedConversations = conversations.map((conversation) => {
        if (conversation.id === arrivalMessage.room_id) {
          conversation.roomMessages[0] = arrivalMessage
          if (currentConversation === arrivalMessage.room_id && chatOpen) {
            conversation.read = true
          } else {
            conversation.read = false
          }
        }
        return conversation
      })

      const sortedByMessageDate =
        updatedConversations.length > 1
          ? updatedConversations.sort((a, b) => {
              return (
                new Date(b.roomMessages[0].createdAt) -
                new Date(a.roomMessages[0].createdAt)
              )
            })
          : updatedConversations

      return sortedByMessageDate
    })

    if (currentConversation === arrivalMessage.room_id && chatOpen) {
      setNewChatMessage(arrivalMessage)
    }
  }, [arrivalMessage])

  useEffect(() => {
    !searchedMessage && setSearchingMessages(false)
  }, [searchedMessage])

  const userConnectedToRoom = async (roomId) => {
    socket.current.emit('connectedToRoom', roomId)
  }

  const userDisconnectedFromRoom = async () => {
    socket.current.emit('disconnectedFromRoom')
  }

  const getUserConversations = () => {
    axiosInstance.get('/privateChat/conversation').then((res) => {
      setConversations(
        res.data.filter((conv) => conv.user_one_id && conv.user_two_id)
      )
    })
  }

  const getUserConnections = () => {
    axiosInstance.get('/connect').then((res) => {
      const result = res.data.data

      setConnections(
        result.filter((connection) => {
          const level = connection.level
          return level !== 'L1' && level !== 'L2' && level !== 'L3'
        })
      )
    })
  }

  const newMessage = async (message, userData) => {
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

    if (foulWords) {
      await FoulWords.register(loggedUserId, foulWords, MESSENGER)
      setFoulWords(null)
    }

    if (!currentConversation) {
      axiosInstance
        .post(`/privateChat/by-external/${friendId}`, {
          type: 1,
          message: message
        })
        .then(async (res) => {
          const messageData = {
            from: res.data.data.from,
            to: friendId,
            message: message,
            room_id: res.data.data.room_id,
            user_id: res.data.data.from.id,
            createdAt: dateNow
          }
          socket.current.emit('sendMessage', messageData)
          setArrivalMessage(messageData)
        })
        .catch((e) => e)
    } else {
      const messageData = {
        from: userData,
        to: friendId,
        message: message,
        room_id: currentConversation,
        user_id: userData.id,
        createdAt: dateNow
      }
      socket.current.emit('sendMessage', messageData)
      setArrivalMessage(messageData)

      axiosInstance
        .post(`/privateChat/by-external/${friendId}`, {
          type: 1,
          message: message
        })
        .then((res) => res)
        .catch((e) => e)
    }
  }

  const openChat = (
    friend_id,
    conversation_id,
    friend_name,
    profile_image,
    connection_status
  ) => {
    setConversations(
      conversations.map((convo) => {
        if (convo.id === conversation_id) convo.read = true
        return convo
      })
    )
    setFriendId(friend_id)
    setFriendName({ friend_name, profile_image, connection_status })
    setCurrentConversation(conversation_id)
    userConnectedToRoom(conversation_id)
    setChatOpen(true)
    props.chatOpened && props.chatOpened(conversation_id)
  }

  const handleSearch = (e) => {
    const { value } = e.target

    if (e.key === 'Enter' && value) {
      e.preventDefault()
      setSearchingMessages(true)
    }
  }

  const openMsgFoundChat = (
    friend_id,
    conversation_id,
    msg_id,
    friend_name,
    profile_image,
    connection_status
  ) => {
    setFriendId(friend_id)
    setFriendName({ friend_name, profile_image, connection_status })
    setCurrentConversation(conversation_id)
    setSearchedMessageId(msg_id)
    setSearchingMessage(true)
    setChatOpen(true)
  }

  return (
    <div className='messengerWidget mt-4'>
      <p className='text-center mb-1'>MY MESSAGES</p>
      <hr className={'mt-1 mb-3'} />
      {!chatOpen ? (
        <div className={'messenger-body'}>
          <div className='messenger-searchBox'>
            <div className='connections-search h-100'>
              <div className='input-group h-100'>
                <div className='input-group-prepend my-auto'>
                  <button
                    className='btn btn-outline-secondary my-2 ms-2'
                    type='button'
                    id='button-addon1'
                  >
                    <img src={searchIcon} alt='#' width='90%' />
                  </button>
                </div>
                <FormattedMessage
                  id='messenger.search_message'
                  defaultMessage='messenger.search_message'
                >
                  {(placeholder) => (
                    <input
                      type='text'
                      className='form-control'
                      name='searchedNote'
                      placeholder={placeholder}
                      aria-describedby='button-addon1'
                      onChange={(e) =>
                        e.target.value
                          ? setSearchedMessage(e.target.value)
                          : setSearchedMessage('')
                      }
                      value={searchedMessage}
                      onKeyDown={handleSearch}
                    />
                  )}
                </FormattedMessage>
              </div>
            </div>
          </div>

          {!searchingMessages && (
            <>
              <div className='searchingMessages'>
                {conversations.length > 0 &&
                  conversations.map((conversation, index) => {
                    return (
                      <Conversation
                        key={conversation.id}
                        index={index}
                        conversation={conversation}
                        openChat={openChat}
                      />
                    )
                  })}
              </div>
              <div
                className='newMessageIcon'
                onClick={() => {
                  setChatOpen(true)
                  setSearchOpen(true)
                }}
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{
                    color: '#01C5D1',
                    background: 'white',
                    borderRadius: '50%',
                    height: '40px',
                    width: '40px',
                    opacity: '1'
                  }}
                />
              </div>
            </>
          )}

          {searchingMessages && (
            <SearchMessages
              searchedValue={searchedMessage}
              openMsgFoundChat={(
                friend_id,
                room_id,
                msg_id,
                friend_name,
                profile_image,
                connection_status
              ) => {
                openMsgFoundChat(
                  friend_id,
                  room_id,
                  msg_id,
                  friend_name,
                  profile_image,
                  connection_status
                )
              }}
            />
          )}
        </div>
      ) : (
        <div className={'messenger-body'}>
          <Chat
            friendId={friendId}
            closeChat={() => {
              setChatOpen(false)
              setSearchingMessage(false)
              setArrivalMessage(null)
              setNewChatMessage(null)
              setFriendId(null)
              setCurrentConversation(null)
              setSearchOpen(false)
              setFriendName(null)
              setSearchedMessageId(null)
              userDisconnectedFromRoom()
            }}
            key={1}
            setFoulWords={setFoulWords}
            newMessage={newMessage}
            newChatMessage={newChatMessage}
            connections={connections}
            setFriendId={(friend_id) => setFriendId(friend_id)}
            searchOpen={searchOpen}
            friendName={friendName}
            searchedMessageId={searchedMessageId}
            searchingMessage={searchingMessage}
            conversationId={currentConversation}
            userDisconnectedFromRoom={() => userDisconnectedFromRoom()}
          />
        </div>
      )}
      <MessageWarningModal
        show={showWarningModal}
        onHide={() => setShowWarningModal(false)}
      />
      {foulWords && (
        <div className='p-2 foul-words-notice'>
          <IntlMessages id='foul_words.notice' />
        </div>
      )}
    </div>
  )
}
export default Messenger
