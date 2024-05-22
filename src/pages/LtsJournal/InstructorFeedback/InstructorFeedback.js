import React, { useEffect, useState } from 'react'
import JournalTextEditor from '../../../components/JournalTextEditor/JournalTextEditor'

function InstructorFeedback(props) {
  const [instructorFeedback, setInstructorFeedback] = useState(null)

  console.log('userData', instructorFeedback)
  const handleChangeInstructorFeedback = (data) => {
    console.log('data', data)
  }

  const handleSave = (updatedData) => {
    console.log('updatedData', { ...updatedData })
  }
  // const [content, setContent] = useState('')

  useEffect(() => {
    if (props.data) setInstructorFeedback(props.data)
  }, [])

  return (
    <JournalTextEditor
      userData={instructorFeedback?.userInstructorFeedback}
      value={instructorFeedback?.userInstructorFeedback?.content}
      handleChange={handleChangeInstructorFeedback}
      handleSave={(data) => {
        handleSave(data)
      }}
      title={'Instructor feedback'}
    />
  )
}

export default InstructorFeedback
