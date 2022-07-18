import React, { useEffect, useState, useRef } from 'react'
// import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
// import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import Message from './Message'
import './message.css'
import Select from 'react-select'
import $ from 'jquery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons'
import avatar from '../../assets/images/profile-image.png'
import { format } from 'date-fns'
// import * as linkify from 'linkifyjs'
import linkifyHtml from 'linkify-html'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { detectFoulWords } from '../../utils/helpers'

// import './chat.css'

const Chat = (props) => {
  const messagesLimit = 100
  const [width, setWidth] = useState([window.innerWidth])
  const [messages, setMessages] = useState([])
  // const [conversation, setConversation] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [senderData, setSenderData] = useState(null)
  const [chatDate, setChatDate] = useState('')
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [selectDisabled, setSelectDisabled] = useState(false)
  const loggedUserId = useSelector((state) => state.user.user.user.id)
  const userData = useSelector((state) => {
    const { id, name, profile_image, username } = state.user.user.user
    return { id, name, profile_image, username }
  })
  const [loadMessagesCheck, setLoadMessagesCheck] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [messagePosition, setMessagePosition] = useState(false)
  const [visibleScrollBar, setVisibleScrollBar] = useState(false)

  const friendId = props.friendId
  let [pageNumber, setPageNumber] = useState(0)
  let [pageNumberUp, setPageNumberUp] = useState(0)
  let [pageNumberDown, setPageNumberDown] = useState(0)
  const scrollRef = useRef(null)
  const FoundMessageRef = useRef(null)
  const friendName = props.friendName?.friend_name
  const connection_status = props.friendName?.connection_status
  const searchingMessage = props.searchingMessage
  const textareaRef = useRef(null)
  const chatBoxTopRef = useRef(null)
  const searchedMessageId = props.searchedMessageId
  const profileImage = props.friendName?.profile_image
    ? props.friendName?.profile_image
    : avatar
  const options = { defaultProtocol: 'https', target: '_blank' }

  // const userData2 = { id, name, profile_image, username }
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
      props.userDisconnectedFromRoom()
    }
  }, [])

  const isMobile = width <= 768
  const isDesktop = width > 1024

  useEffect(() => {
    // setFriendId(props.friendId)

    if (props.friendId && !searchingMessage) {
      getUserConversation(props.friendId)
      return
    }

    if (props.friendId && searchingMessage) {
      getMessagePosition(props.conversationId, props.searchedMessageId)
    }

    // scrollDown()
    //
  }, [props.friendId])

  useEffect(() => {
    if (!props.newChatMessage) return
    setLoadingMessages(false)
    setMessages([...messages, props.newChatMessage])
  }, [props.newChatMessage])

  useEffect(() => {
    if (!messages) return
    chatBoxTopRef.current.clientHeight > 240 && setVisibleScrollBar(true)

    selectedConnection &&
      chatBoxTopRef.current.clientHeight > 199 &&
      setVisibleScrollBar(true)
    if (!loadingMessages) {
      if (!searchingMessage) {
        !isDesktop
          ? setTimeout(() => {
              scrollRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
                // inline: 'start'
              })
            }, 1000)
          : scrollRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
              // inline: 'start'
            })
      } else {
        FoundMessageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
          // inline: 'start'
        })
      }
    }
  }, [messages])

  useEffect(() => {
    if (!messagePosition) return

    setPageNumber(Math.ceil(messagePosition / messagesLimit))
    getUserConversation(props.friendId)
  }, [messagePosition])

  useEffect(() => {
    if (searchingMessage) {
      getUserConversation(props.friendId)
      setPageNumberUp(pageNumber + 1)
      setPageNumberDown(pageNumber - 1)
    }
  }, [pageNumber])

  useEffect(() => {
    if (!newMessage) {
      if (connection_status === 'accept' || props.searchOpen) {
        textareaRef.current.style.overflowY = 'hidden'
        textareaRef.current.style.height = '32px'
      }
    }
  }, [newMessage])

  const getMessagePosition = async (room_id, message_id) => {
    await axiosInstance
      .get(`privateChat/message/${room_id}/${message_id}`)
      .then((res) => {
        setMessagePosition(res.data.messagePosition)
      })
      .catch((e) => e)
    // const currentPage =
  }

  const getUserConversation = async (friend_id) => {
    !searchingMessage && setPageNumber(++pageNumber)
    if (searchingMessage && pageNumber === 0) return
    await axiosInstance
      .get(
        `/privateChat/conversation/${
          friend_id ? friend_id : friendId
        }/${pageNumber}?type=1`
      )
      .then((res) => {
        if (
          res.data.roomMessages.length === 0 ||
          res.data.messagesCount - pageNumber * messagesLimit <= 0
        )
          setLoadMessagesCheck(false)
        else setLoadMessagesCheck(true)

        updateChatDate(res.data?.roomMessages[0]?.createdAt)
        setMessages([...res.data.roomMessages, ...messages])
        setSenderData(
          loggedUserId === res.data.firstUser.id
            ? res.data.firstUser
            : res.data.secondUser
        )
      })
      .catch((e) => e)
  }

  const loadMoreMessagesUp = async () => {
    await axiosInstance
      .get(`/privateChat/conversation/${friendId}/${pageNumberUp}?type=1`)
      .then((res) => {
        setPageNumberUp(++pageNumberUp)
        if (
          !res.data.roomMessages.length ||
          res.data.messagesCount - pageNumberUp * messagesLimit <= 0
        )
          setLoadMessagesCheck(false)
        else setLoadMessagesCheck(true)
        updateChatDate(res.data?.roomMessages[0]?.createdAt)

        setMessages([...res.data.roomMessages, ...messages])
        setSenderData(
          loggedUserId === res.data.firstUser.id
            ? res.data.firstUser
            : res.data.secondUser
        )
      })
      .catch((e) => e)
  }

  const loadMoreMessagesDown = async () => {
    await axiosInstance
      .get(`/privateChat/conversation/${friendId}/${pageNumberDown}?type=1`)
      .then((res) => {
        setPageNumberDown(--pageNumberDown)

        setMessages([...messages, ...res.data.roomMessages])
        setSenderData(
          loggedUserId === res.data.firstUser.id
            ? res.data.firstUser
            : res.data.secondUser
        )

        setTimeout(() => {
          // const selectedElement = document.querySelector('#chatBoxTop')
          // selectedElement.scrollTop = 20
          $('#chatBoxTop').animate(
            { scrollTop: $('#chatBoxTop').prop('scrollTop') + 200 },
            500
          )
        }, 500)
      })
      .catch((e) => e)
  }

  const updateChatDate = async (date) => {
    if (!date) return
    const dateNow = new Date()
    const msgDate = new Date(date)

    const dateDifference =
      (dateNow.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24.0)

    if (dateDifference > 6) {
      setChatDate(format(new Date(date), 'MMMM dd, yyyy'))
    } else {
      setChatDate(format(new Date(date), "EEEE h:mmaaaaa'm'"))
    }
  }

  const scrollDown = async (e) => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
        // inline: 'start'
      })
    }, 500)
  }

  const handleSubmit = (e) => {
    if ((e.keyCode === 13 && e.shiftKey) || (e.keyCode === 13 && isMobile)) {
      textareaRef.current.style.overflowY = 'scroll'
      const currentHeight = textareaRef.current.scrollHeight

      const newHeight = currentHeight + 32
      newHeight < 90 && (textareaRef.current.style.height = newHeight + 'px')
    } else if (e.keyCode === 13 && !e.shiftKey && !isMobile) {
      e.preventDefault()
      // setLoadingMessages(false)
      if (newMessage) {
        const newMessageFiltered = newMessage.replace(/^\s+|\s+$/g, '')
        newMessageFiltered &&
          props.newMessage(linkifyHtml(newMessageFiltered, options), userData)
        setNewMessage('')
        scrollDown()
      }
    }
  }

  const handleSubmitMobile = () => {
    // setLoadingMessages(false)
    if (newMessage) {
      const newMessageFiltered = newMessage.replace(/^\s+|\s+$/g, '')
      newMessageFiltered &&
        props.newMessage(linkifyHtml(newMessageFiltered, options), userData)
      setNewMessage('')
      scrollDown()
    }
  }

  const handleConnectionSelect = (selected1) => {
    setSelectedConnection(selected1)
    setSelectDisabled(true)

    props.setFriendId(selected1.value.id)
  }

  const handleMessageChange = (e) => {
    const message = e.target.value

    detectFoulWords(message, (foulWords) => {
      props.setFoulWords(foulWords)
    })

    setNewMessage(message)
  }

  return (
    <>
      <div className='chatBox'>
        <div className='chatBoxHeader'>
          {props.searchOpen && (
            <div className='newConnectionMessageHeader my-0'>
              <div className='row my-0'>
                <div className='col-12 my-1'>
                  <p
                    onClick={props.closeChat}
                    className={'cancelMessage m-0 d-inline-block float-end'}
                  >
                    Cancel
                  </p>
                </div>
                <div className='col-12 text-center'>
                  <p className='m-0'>NEW MESSAGE</p>
                </div>
                <hr className='m-auto my-2' style={{ width: '92%' }} />
                <div className='col-12 mt-2 mb-0'>
                  <Select
                    value={selectedConnection}
                    onChange={handleConnectionSelect}
                    options={props.connections.map((connection, index) => {
                      return {
                        label: connection.name,
                        value: connection,
                        key: index
                      }
                    })}
                    placeholder={'To:'}
                    openMenuOnClick={false}
                    isDisabled={selectDisabled}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      outLine: 'none',
                      colors: {
                        ...theme.colors,
                        // primary25: 'hotpink',
                        primary: '#333D3D1A',
                        neutral0: '#333D3D1A'
                      },
                      spacing: {
                        ...theme.spacing,
                        controlHeight: 32
                      }
                    })}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        boxShadow: 'none',
                        border: 'none',
                        height: 15,
                        fontSize: '14px'
                      }),
                      menu: (provided, state) => ({
                        ...provided,
                        border: 'none',
                        boxShadow: 'none',
                        fontSize: '14px'
                      })
                    }}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null
                    }}
                    // autoFocus={false}
                  />
                </div>
              </div>
            </div>
          )}
          {!props.searchOpen && (
            <>
              <div className='row'>
                <div
                  className='col-12 text-left'
                  style={{
                    position: 'absolute',
                    zIndex: '2',
                    top: '30px'
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{
                      color: '#333d3d',
                      height: '20px',
                      width: '20px',
                      cursor: 'pointer'
                    }}
                    onClick={props.closeChat}
                  />
                </div>
                <div className='col-12 text-center'>
                  <img
                    className={`messageImg mx-3`}
                    src={profileImage}
                    alt=''
                  />
                </div>
                <div className='col-12 mt-2 text-center'>
                  <p className='m-0 mb-2'>{friendName}</p>
                </div>
              </div>
            </>
          )}
        </div>
        {!props.searchOpen && <hr className={'my-0'} />}
        <div
          className='chatBoxWrapper mt-2'
          style={{ height: !props.searchOpen ? '265px' : '223px' }}
        >
          <div className='chatBoxTop' id='chatBoxTop' ref={chatBoxTopRef}>
            {loadMessagesCheck && !props.searchingMessage && (
              <p
                onClick={() => {
                  setLoadingMessages(true)
                  getUserConversation()
                }}
                className={'load-more mb-2'}
              >
                Load more
              </p>
            )}

            {loadMessagesCheck && props.searchingMessage && (
              <p
                onClick={() => {
                  setLoadingMessages(true)
                  loadMoreMessagesUp()
                }}
                className={'load-more mb-2'}
              >
                Load more
              </p>
            )}
            <p className={'chatDate'}> {chatDate}</p>

            {messages.length > 0 &&
              messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <Message
                    key={message.id}
                    data={message}
                    visibleScrollBar={visibleScrollBar}
                  />
                  <div></div>

                  {message.id === searchedMessageId && (
                    <div ref={FoundMessageRef} />
                  )}
                </React.Fragment>
              ))}

            {pageNumberDown > 0 && props.searchingMessage && (
              <p
                onClick={() => {
                  setLoadingMessages(true)
                  loadMoreMessagesDown()
                }}
                className={'load-more'}
              >
                Load more
              </p>
            )}

            <div ref={scrollRef} />
          </div>
        </div>
        {connection_status === 'accept' || props.searchOpen ? (
          <div className='chatBoxBottom'>
            <textarea
              ref={textareaRef}
              className='chatMessageInput form-control'
              placeholder='Aa'
              onChange={(e) => handleMessageChange(e)}
              value={newMessage}
              onKeyDown={handleSubmit}
              disabled={props.searchOpen && !selectedConnection}
            ></textarea>
            {!newMessage && !isMobile && (
              <FontAwesomeIcon
                icon={faArrowCircleUp}
                style={{
                  color: '#333D3D29',
                  height: '22px',
                  width: '22px',
                  position: 'absolute',
                  bottom: '5px',
                  right: '10px'
                }}
                onClick={handleSubmitMobile}
              />
            )}
            {isMobile && (
              <FontAwesomeIcon
                icon={faArrowCircleUp}
                style={{
                  color: newMessage ? '#01c5d1' : '#333D3D29',
                  height: '22px',
                  width: '22px',
                  position: 'absolute',
                  top: '5px',
                  right: '10px'
                }}
                onClick={handleSubmitMobile}
              />
            )}
          </div>
        ) : (
          <div className='text-center'>
            <p
              className='p-0'
              style={{
                margin: '0',
                marginTop: '20px',
                fontSize: '12px',
                color: '#01c5d1'
              }}
            >
              You can't reply to this conversation.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
export default Chat
