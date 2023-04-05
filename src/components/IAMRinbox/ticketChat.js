import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  faAngleDoubleRight,
  faCaretLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useIamrInboxContext from './iamrInboxContext'
import './index.css'
import imgTest from '../../assets/images/performance.png'
import TicketMessage from './ticketMessage'
import TextareaAutosize from 'react-textarea-autosize'
import linkifyHtml from 'linkify-html'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import LoadingAnimation from './loadingAnimation'
import NotificationTypes from '../../utils/notificationTypes'
import socket from '../../utils/notificationSocket'

function TicketChat({ ticket, close, isTicketOpened }) {
  const { ticketOpened, replying, setReplying, newMessage } =
    useIamrInboxContext()
  const submitIconRef = useRef(null)
  const messageBoxRef = useRef(null)
  const [pageWidth, setPageWidth] = useState([window.innerWidth])
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([])
  const [fetching, setFetching] = useState(false)
  const options = { defaultProtocol: 'https', target: '_blank' }
  const loggedUser = useSelector((state) => state.user.user.user)
  const scrollRef = useRef(null)

  const handleSubmit = (e) => {
    if (e.keyCode === 13 && !e.shiftKey && !isMobile) {
      e.preventDefault()
      if (messageInput) {
        const formattedMessage = linkifyHtml(
          messageInput.replace(/^\s+|\s+$/g, ''),
          options
        )
        submitMessage(formattedMessage)
      }
    }
  }

  const handleSubmitMobile = () => {
    if (messageInput) {
      const formattedMessage = linkifyHtml(
        messageInput.replace(/^\s+|\s+$/g, ''),
        options
      )
      submitMessage(formattedMessage)
    }
  }

  const submitMessage = async (message) => {
    setMessageInput('')
    setReplying(true)

    await axiosInstance
      .post(`instructor/iamr/tickets/reply/${ticket.id}`, { message })
      .then((res) => {
        const { id, name, profile_image } = loggedUser
        const message = { ...res.data, User: { id, name, profile_image } }
        setMessages((messages) => [...messages, message])
        newMessage({ message, ticket })

        const type =
          ticket.type === 'instruction'
            ? NotificationTypes.INSTRUCTIONS_TICKET_REPLY.key
            : NotificationTypes.FEEDBACK_TICKET_REPLY.key
        const url =
          ticket.type === 'instruction'
            ? `/iamr/${ticket.skill_id}/instructions/${ticket.id}`
            : `/iamr/${ticket.skill_id}/feedback/${ticket.id}`

        socket?.emit('sendNotification', {
          sender: loggedUser,
          receiver: ticket.User,
          type: type,
          url: url
        })
      })
      .catch((e) => {
        toast.error('Ticket reply failed, please try again!')
      })

    setReplying(false)
  }

  const handleWindowSizeChange = () => {
    setPageWidth(window.innerWidth)
  }

  const scrollBottom = () => {
    if (scrollRef) {
      scrollRef.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' })
      })
    }
  }

  useEffect(() => {
    scrollBottom()
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
      setReplying(false)
      setFetching(false)
    }
  }, [setFetching, setReplying])

  useEffect(() => {
    setMessageInput('')
    setMessages([])

    const getMessages = async () => {
      setFetching(true)

      await axiosInstance
        .get(`instructor/iamr/tickets/messages/${ticket.id}`)
        .then(({ data }) => setMessages(data))

      setFetching(false)
    }

    getMessages()
  }, [ticket])

  useEffect(() => {
    if (!ticket.read_by_instructor) {
      ticketOpened(ticket)
    }
  }, [ticket, ticketOpened])

  useEffect(() => {
    if (!messageBoxRef.current) return

    if (messageBoxRef.current.value.split('\n').length > 5) {
      submitIconRef.current.style.right = '38px'
    } else {
      submitIconRef.current.style.right = '22px'
    }
  }, [messageInput])

  const isMobile = pageWidth <= 768

  return (
    <div
      className='ticket-chat p-0'
      style={{ display: isTicketOpened ? 'block' : 'none' }}
    >
      <div className='header'>
        <div className='d-flex' onClick={() => close()}>
          <FontAwesomeIcon
            icon={faCaretLeft}
            style={{
              // color: 'white',
              height: '20px',
              width: '20px'
            }}
          />
          <p className='p-0 m-0 my-auto'> INBOX</p>
        </div>
        <p className='p-0 m-0'>
          {ticket.type === 'instruction'
            ? 'RESPONSES TO QUESTIONS'
            : 'FEEDBACK RESPONSES'}
        </p>
      </div>
      <div className='chat-container'>
        <div className='chat-header row m-0'>
          <div className='chat-user p-0 col-12 col-sm-6'>
            {/* prettier-ignore */}
            <img src={imgTest} alt='profile' className='rounded-circle'/>
            <div className='d-flex flex-column ms-2'>
              <p>{ticket.User.name}</p>
              <p className='subject'>
                <span className='fw-bold'>Subject:</span>{' '}
                {ticket.IamrSkill.title}
              </p>
            </div>
          </div>
          <div className='status col-12 col-sm-6 mt-2 mt-lg-0 p-0 d-flex align-items-center justify-content-end'>
            <p className='m-0 me-2'>{ticket.resolved ? 'Resolved' : ''}</p>
            <button className='lts-button'>VIEW IAMR</button>
          </div>
        </div>
        <div className='messages-container' ref={scrollRef}>
          <LoadingAnimation show={fetching} />

          {messages.map((message) => (
            <TicketMessage key={message.id} message={message} />
          ))}
        </div>
        <hr />
        {ticket.type === 'instruction' && ticket.resolved ? (
          <p className='resolved mt-3'>Ticket is resolved.</p>
        ) : (
          <div className='new-message'>
            <TextareaAutosize
              className=''
              placeholder='Aa'
              maxRows={5}
              ref={messageBoxRef}
              onKeyDown={handleSubmit}
              onChange={(e) => setMessageInput(e.target.value)}
              value={messageInput}
              disabled={replying}
            />
            <div className='submit-icon' ref={submitIconRef}>
              <FontAwesomeIcon
                icon={faAngleDoubleRight}
                style={{
                  color: 'white',
                  height: '15px',
                  width: '15px'
                }}
                onClick={handleSubmitMobile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketChat
