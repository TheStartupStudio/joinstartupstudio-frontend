import React, { useEffect, useState } from 'react'
import LoadingAnimation from '../loadingAnimation'
import TicketChat from '../ticketChat'
import Dropdown from '../customComponents/dropdown'
import DropdownOption from './dropdownOption'
import './index.css'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../../utils/AxiosInstance'

const SkillFeedbacks = ({ skill }) => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState()
  const [expandedDropdown, setExpandedDropdown] = useState(false)
  const { ticketId } = useParams()

  useEffect(() => {
    if (!skill?.id) return
    axiosInstance.get(`/iamr/tickets/feedback/${skill.id}`).then(({ data }) => {
      setTickets(data)
      if (ticketId) {
        const ticket = data.find((ticket) => ticket.id === Number(ticketId))
        if (ticket) setSelectedTicket(ticket)
      } else data[0] && setSelectedTicket(data[0])

      setLoading(false)
    })
  }, [skill.id])

  const updateTickets = ({ ticketId, field, values }) => {
    setTickets((tickets) =>
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          ticket[field] = values
        }
        return ticket
      })
    )
  }

  return (
    <>
      <p className="skill-title">
      <span className="text-info fw-bold">{skill.category} - </span> 
        <span className="fw-bold">{skill?.title} - </span> FEEDBACK
      </p>
      {loading ? (
        <LoadingAnimation show={loading} />
      ) : (
        <>
          {tickets.length > 0 ? (
            <Dropdown
              title={'STUDENT UPLOADS'}
              expanded={expandedDropdown}
              toggle={setExpandedDropdown}
              className="mt-3"
            >
              <ul className="custom-dropdown-options">
                {tickets.map((ticket) => (
                  <DropdownOption
                    ticket={ticket}
                    setSelectedTicket={setSelectedTicket}
                    selectedTicket={selectedTicket}
                    handleOnClick={(ticket) => {
                      setSelectedTicket(ticket)
                      setExpandedDropdown(false)
                    }}
                    key={ticket.id}
                  />
                ))}
              </ul>
            </Dropdown>
          ) : (
            <p className="page-content-text fw-normal my-5 text-center">
              You haven't received a feedback yet!
            </p>
          )}

          {selectedTicket && (
            <TicketChat ticket={selectedTicket} updateTickets={updateTickets} />
          )}
        </>
      )}
    </>
  )
}

export default SkillFeedbacks
