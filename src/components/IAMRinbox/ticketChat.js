import { useEffect, useState, useContext, useRef } from 'react'
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

function TicketChat({ ticket, close, isTicketOpened }) {
  const { ticketOpened, replying, setLoading, setReplying, newMessage } =
    useIamrInboxContext()
  const submitIconRef = useRef(null)
  const messageBoxRef = useRef(null)
  const [pageWidth, setPageWidth] = useState([window.innerWidth])
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([])
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
    // getMessages()
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
      setReplying(false)
      setLoading(false)
    }
  }, [setLoading, setReplying])

  useEffect(() => {
    setMessageInput('')
    setMessages([])

    const getMessages = async () => {
      setLoading(true)

      await axiosInstance
        .get(`instructor/iamr/tickets/messages/${ticket.id}`)
        .then(({ data }) => setMessages(data))

      setLoading(false)
    }

    getMessages()
  }, [setLoading, ticket])

  useEffect(() => {
    if (!ticket.read_by_instructor) {
      ticketOpened(ticket)
    }
  }, [ticket, ticketOpened])

  useEffect(() => {
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
          <LoadingAnimation />
          {messages.map((message) => (
            <TicketMessage key={message.id} message={message} />
          ))}
        </div>
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
      </div>
    </div>
  )
}

export default TicketChat
