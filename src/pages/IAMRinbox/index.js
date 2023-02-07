import { useEffect, useRef } from 'react'
import useIamrInboxContext, {
  IamrInboxProvider
} from '../../components/IAMRinbox/iamrInboxContext'
import InboxMenu from '../../components/IAMRinbox/inboxMenu'
import InboxTickets from '../../components/IAMRinbox/inboxTickets'
import axiosInstance from '../../utils/AxiosInstance'

import './index.css'

const IAMRinboxContainer = () => {
  //prettier-ignore
  const { setStudentQuestions, setCertificationFeedbackQuestions, questionsMenuSelected, setLoading } = useIamrInboxContext()
  const lastRequest = useRef()

  useEffect(() => {
    getTickets()
  }, [])

  const getTickets = () => {
    axiosInstance.get('instructor/iamr/tickets').then((res) => {
      setStudentQuestions(res.data.student_questions)
      setCertificationFeedbackQuestions(
        res.data.certification_feedback_questions
      )
    })
  }

  const getTicketsByPage = (page) => {
    setLoading(true)
    const type = questionsMenuSelected && 'instruction'
    axiosInstance
      .get(`instructor/iamr/tickets?page=${page}&type=${type}`)
      .then(({ data }) => {
        type === 'instruction'
          ? setStudentQuestions(data)
          : setCertificationFeedbackQuestions(data)
      })

    setLoading(false)
  }

  return (
    <div className='row iamr-inbox p-0 m-0'>
      <InboxMenu />
      <InboxTickets getTicketsByPage={getTicketsByPage} />
    </div>
  )
}

function IAMRinbox() {
  return (
    <IamrInboxProvider>
      <IAMRinboxContainer />
    </IamrInboxProvider>
  )
}

export default IAMRinbox
