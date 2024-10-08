import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import './index.css'
import TicketMessage from './message'
import Input from '../customComponents/input'
import { showErrors } from '../../../../utils/helpers'
import axiosInstance from '../../../../utils/AxiosInstance'
import notificationSocket from '../../../../utils/notificationSocket'
import notificationTypes from '../../../../utils/notificationTypes'

function TicketChat({ ticket, updateTickets }) {
  const [loading, setLoading] = useState(false)
  const loggedUser = useSelector((state) => state.user.user.user)
  const scrollRef = useRef(null)

  const messages = ticket.TicketAnswers

  const submitMessage = async (message) => {
    setLoading(true)

    await axiosInstance
      .post(`iamr/tickets/reply/${ticket.id}`, { message })
      .then((res) => {
        const { id, name, profile_image } = loggedUser
        const message = { ...res.data, User: { id, name, profile_image } }
        updateTickets({
          ticketId: ticket.id,
          field: 'TicketAnswers',
          values: [...messages, message]
        })

        if (loggedUser && loggedUser.Instructor) {
          notificationSocket?.emit('sendNotification', {
            sender: loggedUser,
            // later this will change
            receivers: [loggedUser.Instructor.User],
            type: notificationTypes.IAMR_STUDENT_QUESTION.key,
            url: '/my-inbox'
          })
        }
      })
      .catch((e) => showErrors(e))
    setLoading(false)
  }

  const resolveTicket = async () => {
    if (loading) return

    setLoading(true)
    await axiosInstance
      .put(`iamr/tickets/resolve/${ticket.id}`)
      .then(({ data }) => {
        updateTickets({
          ticketId: ticket.id,
          field: 'resolved',
          values: data.resolved
        })
      })
      .catch((e) => showErrors(e))
    setLoading(false)
  }

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="ticket-chat p-0 mt-4">
      <div className="chat-container">
        <div className="chat-header d-flex justify-content-between">
          <p className="subject">
            <span className="fw-bold">Subject:</span> {ticket.subject}
          </p>
          <p className="subject text-end">
            <span className="fw-bold">Skill:</span> {ticket.IamrSkill.title}
          </p>
        </div>
        <div className="messages-container">
          {messages.map((message) => (
            <TicketMessage key={message.id} message={message} />
          ))}
          {ticket.type === 'instruction' && !ticket.resolved && (
            <button
              className="ms-auto float-end resolve-btn rounded fw-bold"
              onClick={resolveTicket}
            >
              RESOLVE
            </button>
          )}

          {ticket.type === 'instruction' && ticket.resolved && (
            <p className="resolved mt-3">Question resolved.</p>
          )}
          <div ref={scrollRef} />
        </div>
        {!ticket.resolved && (
          <>
            <hr />
            <Input loading={loading} onSubmit={submitMessage} />
          </>
        )}
      </div>
    </div>
  )
}

export default TicketChat
