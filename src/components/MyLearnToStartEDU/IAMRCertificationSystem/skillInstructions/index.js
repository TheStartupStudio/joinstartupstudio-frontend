import React, { useEffect, useState } from 'react'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'
import TicketChat from '../ticketChat'
import Dropdown from '../customComponents/dropdown'
import DropdownOption from './dropdownOption'
import NewTicketModal from './newTicketModal'
import { useParams } from 'react-router-dom'
import Description from './description'
import axiosInstance from '../../../../utils/AxiosInstance'
import LoadingAnimation from '../../../../ui/loadingAnimation'

const SkillInstructions = ({ skill, groupingStrings }) => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState()
  const [expandedDropdown, setExpandedDropdown] = useState(false)
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const { ticketId } = useParams()

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

  const addNewTicket = (ticket) => {
    setTickets((tickets) => [ticket, ...tickets])
    setSelectedTicket(ticket)
  }

  useEffect(() => {
    if (!skill?.id) return
    axiosInstance
      .get(`/iamr/tickets/instruction/${skill.id}`)
      .then(({ data }) => {
        setTickets(data)
        const ticket = data.find((ticket) => ticket.id === Number(ticketId))
        ticket
          ? setSelectedTicket(ticket)
          : data[0] && setSelectedTicket(data[0])
        setLoading(false)
      })
  }, [skill?.id])

  return (
    <>
      <p className='skill-title'>
        <span className='text-info fw-bold'>{skill?.category} - </span>
        <span className='fw-bold'>{skill?.title} - </span> Instructions &
        Questions
      </p>
      <ReactPlayer
        className='video_inner media-lightbox__video-player my-3'
        url={skill?.video}
        controls={true}
        light={
          'https://d5tx03iw7t69i.cloudfront.net/Journal/MarketReadyGuide/MRG-Thumbnail.jpg'
        }
        playing={true}
        width='100%'
        height='300px'
        config={{
          file: { attributes: { controlsList: 'nodownload' } }
        }}
      />
      <p className='page-content-title my-2'>GUIDANCE/INSTRUCTIONAL:</p>
      <Description skill={skill} />
      {loading ? (
        <LoadingAnimation show={loading} />
      ) : (
        <>
          {tickets.length > 0 && (
            <Dropdown
              title={'Previous question threads'}
              expanded={expandedDropdown}
              toggle={setExpandedDropdown}
            >
              <ul className='tickets-options'>
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
          )}

          {selectedTicket && (
            <TicketChat ticket={selectedTicket} updateTickets={updateTickets} />
          )}
          <button
            className='ms-auto float-end mt-2 mb-4 new-ticket-btn rounded fw-bold'
            onClick={() => setShowNewTicketModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className='me-2 align-middle' />
            <span className='align-middle'>Add question </span>
          </button>
        </>
      )}

      <NewTicketModal
        show={showNewTicketModal}
        skillId={skill?.id}
        addNewTicket={addNewTicket}
        onHide={() => setShowNewTicketModal(false)}
      />
    </>
  )
}

export default SkillInstructions
