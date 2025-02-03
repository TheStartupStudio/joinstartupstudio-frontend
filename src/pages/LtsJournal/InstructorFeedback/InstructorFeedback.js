import React, { useEffect, useState } from 'react'
import JournalTextEditor from '../../../components/JournalTextEditor/JournalTextEditor'
import { useRouteMatch } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import notificationSocket from '../../../utils/notificationSocket'
import NotificationTypes from '../../../utils/notificationTypes'

function InstructorFeedback(props) {
  const { id: loggedUserId, name: loggedUserName } = useSelector(
    (state) => state.user.user.user
  )
  const [instructorFeedback, setInstructorFeedback] = useState(null)
  const routeMatch = useRouteMatch()
  const [, , ...ids] = routeMatch.url.split('/')

  const [userId, journalId] = ids.map((id) => +id)

  const handleSave = (updatedData) => {
    const isEdit = !!updatedData.id
    let newData = {
      ...updatedData,
      userId,
      journalId,
      submitted: new Date(),
      instructorFeedbackId: +instructorFeedback.id,
      instructorId: loggedUserId
    }

    delete newData.id

    const journalType = () => {
      let type = props.journalType.value
        ? props.journalType.value
        : props.journalType

      if (type === 'personal-finance') {
        return 'student-personal-finance'
      } else if (type === 'student-lts') {
        return 'lts-journal'
      } else if (type === 'student-wellnes') {
        return 'wellness-journal'
      }

      return type
    }

    if (!isEdit) {
      axiosInstance
        .post('/ltsJournals/instructor-feedback', newData)
        .then((res) => {
          setInstructorFeedback({
            ...instructorFeedback,
            userInstructorFeedback: res.data
          })
          toast.success('Instructor feedback updated successfully!')

          notificationSocket?.emit('sendNotification', {
            sender: { id: loggedUserId, name: loggedUserName },
            receivers: [{ id: userId }],
            type: NotificationTypes.INSTRUCTOR_FEEDBACK_ADDED.key,
            url: `/${journalType()}?${props.data?.journalId}`,
            description: ` on ${props.journal?.title} of ${
              props.journalType.label
                ? props.journalType.label
                : props.journalType
            }`
          })
        })
        .catch((e) => {
          toast.error('Error occurred during updating instructor feedback!')
        })
    } else {
      axiosInstance
        .put(`/ltsJournals/instructor-feedback/${updatedData.id}`, newData)
        .then((res) => {
          setInstructorFeedback({
            ...instructorFeedback,
            userInstructorFeedback: res.data
          })
          notificationSocket?.emit('sendNotification', {
            sender: { id: loggedUserId, name: loggedUserName },
            receivers: [{ id: userId }],
            type: NotificationTypes.INSTRUCTOR_FEEDBACK_UPDATED.key,
            url: `/${journalType()}?${props.data?.journalId}`,
            description: ` on ${props.journal?.title} of ${
              props.journalType.label
                ? props.journalType.label
                : props.journalType
            }`
          })
          toast.success('Instructor feedback updated successfully!')
        })
        .catch((e) => {
          toast.error('Error occurred during updating instructor feedback!')
        })
    }
  }
  useEffect(() => {
    if (props.data) setInstructorFeedback(props.data)
  }, [props.data])

  return (
    <JournalTextEditor
      userRole={props.userRole}
      userData={instructorFeedback?.userInstructorFeedback}
      value={instructorFeedback?.userInstructorFeedback?.content}
      handleSave={(data) => {
        handleSave({
          ...data,
          id: instructorFeedback?.userInstructorFeedback?.id
        })
      }}
      title={'Instructor feedback'}
      alignFooter={'end'}
    />
  )
}

export default InstructorFeedback
