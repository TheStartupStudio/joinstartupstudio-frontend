import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import './index.css'
import axiosInstance from '../../../utils/AxiosInstance'
import JournalEntry from './journalEntry'
import LoadingAnimation from '../loadingAnimation'
import UserEntryInput from './userEntryInput'
import { useParams } from 'react-router'

const SkillJournal = ({ skill }) => {
  const [journalEntries, setJournalEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const { studentId } = useParams()

  useEffect(() => {
    if (!skill?.id) return
    axiosInstance
      .get(`/instructor/iamr/students/journals/${studentId}/${skill.id}`)
      .then(({ data }) => {
        setJournalEntries(data)
        setLoading(false)
      })
  }, [skill?.id])

  return (
    <>
      <p className='skill-title'>
        <span className='fw-bold'>{skill?.title} - </span> JOURNAL
      </p>
      <ReactPlayer
        className='video_inner media-lightbox__video-player my-3'
        url={skill?.journal_video}
        controls={true}
        light={
          'https://d5tx03iw7t69i.cloudfront.net/Journal/MarketReadyGuide/MRG-Thumbnail.jpg'
        }
        width='100%'
        height='300px'
        config={{
          file: { attributes: { controlsList: 'nodownload' } }
        }}
        playing={true}
      />
      <p className='page-content-title mb-2'>Text:</p>
      <p className='page-content-text'>{skill?.journal_description}</p>

      {loading ? (
        <LoadingAnimation show={loading} />
      ) : (
        <>
          <p className='page-content-text fw-normal'>STUDENT JOURNAL ENTRIES</p>
          {journalEntries.map((entry) => (
            <JournalEntry entry={entry} key={entry.id}>
              {entry.UserEntries.map((userEntry) => (
                <UserEntryInput
                  key={userEntry.id}
                  entry={entry}
                  userEntry={userEntry}
                  loading={loading}
                />
              ))}
            </JournalEntry>
          ))}
        </>
      )}
    </>
  )
}

export default SkillJournal
