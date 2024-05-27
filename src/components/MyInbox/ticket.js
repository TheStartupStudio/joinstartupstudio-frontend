import { memo, useEffect, useState } from 'react'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import imgTest from '../../assets/images/performance.png'
import { beautifulDateFormat } from '../../utils/helpers'
import { useHistory } from 'react-router'
import axiosInstance from '../../utils/AxiosInstance'
import SubmitIndustryProblemModal from '../../pages/MyImmersion/Modals/SubmitIndustryProblemModal'
import SubmitExperienceModal from '../../pages/MyImmersion/Modals/SubmitExperienceModal'

function Ticket({ ticket, setSelectedTicket }) {
  const [industryProblemModal, setIndustryProblemModal] = useState(false)
  const [submitExperienceModal, setSubmitExperienceModal] = useState(false)
  console.log('industryProblemModal', industryProblemModal)
  const [solutionData, setSolutionData] = useState({})
  const [experienceData, setExperienceData] = useState({})
  console.log('ticket', ticket)
  const history = useHistory()

  useEffect(() => {
    if (ticket.industry_solution_id) {
      axiosInstance
        .get(
          `/immersion/problems/${ticket.user_id}/${ticket.industry_solution_id}`
        )
        .then((res) => {
          setSolutionData(res.data)
          console.log('res', res)
        })
    }
  }, [ticket.industry_solution_id, ticket.user_id])

  useEffect(() => {
    if (ticket.immersion_experience_id) {
      axiosInstance
        .get(
          `/immersion/experiences/${ticket.user_id}/${ticket.immersion_experience_id}`
        )
        .then((res) => {
          setExperienceData(res.data)
          console.log('res', res)
        })
    }
  }, [ticket.immersion_experience_id, ticket.user_id])

  let uploadUrl
  if (ticket?.type === 'approval') {
    uploadUrl = `/student-iamr/${ticket.User?.id}/1/uploads`
  } else {
    uploadUrl = `/student-iamr/${ticket.User?.id}/${ticket.IamrSkill?.id}/uploads/${ticket.UserSkillUpload?.id}`
  }

  const readByInstructorHandler = async () => {
    await axiosInstance.get(`/instructor/iamr/tickets/${ticket.id}`)
  }
  return (
    <>
      <div
        className={`single-ticket d-flex ${
          !ticket.read_by_instructor ? 'unread' : ''
        }`}
        onClick={() => {
          ticket.type === 'certification_submit' || ticket.type === 'approval'
            ? history.push(uploadUrl)
            : ticket.type === 'approval'
            ? setSelectedTicket(ticket)
            : ticket.type === 'industry_problem'
            ? setIndustryProblemModal(true)
            : setSubmitExperienceModal(true)
          readByInstructorHandler()
        }}
      >
        <img
          src={ticket.User.profile_image ? ticket.User.profile_image : imgTest}
          alt="profile"
          className="rounded-circle"
        />
        <div className="ticket-information d-flex flex-column mx-2 min-w-0">
          <h5 className="from">{ticket.User.name}</h5>
          <p className="subject">
            Subject: <span className="fw-bold"> {ticket.subject} </span>
          </p>
          <p className="last-message">{ticket.TicketAnswers?.message}</p>
        </div>
        <div className="ticket-status d-flex align-items-center">
          <p className="my-auto">
            {beautifulDateFormat(
              ticket.TicketAnswers?.createdAt ?? ticket.createdAt
            )}
          </p>
          <FontAwesomeIcon
            icon={faCircle}
            style={{
              fontSize: '13px',
              textAlign: 'right',
              marginLeft: '5px'
            }}
            className={`status ${
              ticket.type === 'industry_problem'
                ? ticket.user_industry_solution?.status
                : ticket.type === 'immersion_experience'
                ? ticket.user_immersion_experience?.status
                : ticket.UserSkillStatus?.status
            }`}
          />
        </div>
      </div>
      {industryProblemModal && (
        <SubmitIndustryProblemModal
          {...solutionData}
          show={industryProblemModal}
          User={ticket.User}
          onHide={() => setIndustryProblemModal(false)}
          problemID={1}
          companyID={1}
          problemIsSubmitted={false}
          mode="ticket"
        />
      )}
      {submitExperienceModal && (
        <SubmitExperienceModal
          {...experienceData}
          show={submitExperienceModal}
          onHide={() => setSubmitExperienceModal(false)}
          User={ticket.User}
          mode="ticket"
        />
      )}
    </>
  )
}

export default memo(Ticket)
