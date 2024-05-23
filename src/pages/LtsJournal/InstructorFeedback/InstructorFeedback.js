import React, { useEffect, useState } from 'react'
import JournalTextEditor from '../../../components/JournalTextEditor/JournalTextEditor'
import { useRouteMatch } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

function InstructorFeedback(props) {
  const loggedUserId = useSelector((state) => state.user.user.user.id)
  const [instructorFeedback, setInstructorFeedback] = useState(null)
  const routeMatch = useRouteMatch()

  const [, , ...ids] = routeMatch.url.split('/')

  const [userId, journalId] = ids.map((id) => +id)

  const handleChangeInstructorFeedback = (data) => {
    console.log('data', data)
  }

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

    if (!isEdit) {
      axiosInstance
        .post('/ltsJournals/instructor-feedback', newData)
        .then((res) => {
          setInstructorFeedback({
            ...instructorFeedback,
            userInstructorFeedback: res.data
          })
          toast.success('Instructor feedback updated successfully!')
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
      userData={instructorFeedback?.userInstructorFeedback}
      value={instructorFeedback?.userInstructorFeedback?.content}
      handleChange={handleChangeInstructorFeedback}
      handleSave={(data) => {
        handleSave({
          ...data,
          id: instructorFeedback?.userInstructorFeedback?.id
        })
      }}
      title={'Instructor feedback'}
    />
  )
}

export default InstructorFeedback
