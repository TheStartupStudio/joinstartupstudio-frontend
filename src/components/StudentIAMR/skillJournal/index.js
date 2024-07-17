import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import './index.css'
import axiosInstance from '../../../utils/AxiosInstance'
import JournalEntry from './journalEntry'
import UserEntryInput from './userEntryInput'
import { useParams } from 'react-router'
import LoadingAnimation from '../../../ui/loadingAnimation'

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
      <p className="skill-title">
        <span className="fw-bold">{skill?.title} - </span> JOURNAL
      </p>
      <ReactPlayer
        className="video_inner media-lightbox__video-player my-3"
        url={skill?.journal_video}
        controls={true}
        light={
          'https://d5tx03iw7t69i.cloudfront.net/Journal/MarketReadyGuide/MRG-Thumbnail.jpg'
        }
        width="100%"
        height="300px"
        config={{
          file: { attributes: { controlsList: 'nodownload' } }
        }}
        playing={true}
      />
      {/* <p className='page-content-title mb-2'>Text:</p> */}
      {/* <p className='page-content-text'>{skill?.journal_description}</p> */}
      <p className="page-content-text">
        What do you need to do in order to prove your proficiency, when will you
        be ready to upload your proof? This can include goals you want to set,
        specific actions you want to take, and specific outcomes you want to
        create.
      </p>

      {loading ? (
        <LoadingAnimation show={loading} />
      ) : (
        <>
          <p className="page-content-text fw-normal">STUDENT JOURNAL ENTRIES</p>
          {journalEntries.map((entry, index) => (
            <JournalEntry
              entry={entry}
              index={index}
              key={entry.id}
              skillTags={skill.SkillTags}
            >
              {entry.UserEntries.length > 0 ? (
                entry.UserEntries.map((userEntry) => (
                  <UserEntryInput
                    key={userEntry.id}
                    entry={entry}
                    userEntry={userEntry}
                    loading={loading}
                  />
                ))
              ) : (
                <p className="page-content-text fw-normal">
                  Student hasn't added a entry yet!
                </p>
              )}
            </JournalEntry>
          ))}
        </>
      )}
    </>
  )
}

export default SkillJournal
