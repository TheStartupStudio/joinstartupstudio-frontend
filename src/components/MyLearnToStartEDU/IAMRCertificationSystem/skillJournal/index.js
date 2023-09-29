import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import './index.css'
import JournalEntry from './journalEntry'
import LoadingAnimation from '../loadingAnimation'
import Input from '../customComponents/input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import UserEntryInput from './userEntryInput'
import axiosInstance from '../../../../utils/AxiosInstance'
import { showErrors } from '../../../../utils/helpers'

const SkillJournal = ({ skill }) => {
  const [journalEntries, setJournalEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!skill?.id) return
    axiosInstance.get(`/iamr/journals/skill/${skill.id}`).then(({ data }) => {
      setJournalEntries(data)
      setLoading(false)
    })
  }, [skill?.id])

  const submitEntry = (content, { entryId, userEntryId }) => {
    if (!content) {
      return
    }

    if (userEntryId) return updateEntry(content, userEntryId)
    else return newEntry(content, entryId)
  }

  const updateEntry = async (content, userEntryId) => {
    axiosInstance
      .put(`/iamr/journals/editEntry/${userEntryId}`, { content })
      .then(({ data }) => {
        const updatedJournals = journalEntries.map((entry) => {
          const userEntries = entry.UserEntries.map((userEntry) => {
            if (userEntry.id === userEntryId) return data
            return userEntry
          })
          return { ...entry, UserEntries: userEntries }
        })
        setJournalEntries(updatedJournals)
        toast.success('Your journal entry has been updated.')
      })
      .catch((e) => showErrors(e))
  }

  const newEntry = async (content, entryId) => {
    axiosInstance
      .post(`/iamr/journals/${entryId}`, { content })
      .then(({ data }) => {
        const updatedJournals = journalEntries.map((entry) => {
          if (entry.id === entryId)
            return {
              ...entry,
              UserEntries: [
                ...entry.UserEntries.filter((userEntry) => !userEntry.notSaved),
                data
              ]
            }
          return entry
        })
        setJournalEntries(updatedJournals)
        toast.success('Your journal entry has been saved.')
      })
      .catch((e) => showErrors(e))
  }

  const newEmptyReflection = (entryId) => {
    const updatedJournals = journalEntries.map((entry) => {
      if (entry.id === entryId)
        return {
          ...entry,
          UserEntries: [
            ...entry.UserEntries,
            { content: '', notSaved: true, createdAt: new Date() }
          ]
        }
      return entry
    })
    setJournalEntries(updatedJournals)
  }

  const removeEmptyReflection = (entryId) => {
    const updatedJournals = journalEntries.map((entry) => {
      if (entry.id === entryId)
        return {
          ...entry,
          UserEntries: entry.UserEntries.filter((x) => !x.notSaved)
        }
      return entry
    })
    setJournalEntries(updatedJournals)
  }

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
          <p className="page-content-text fw-normal">REFLECT HERE</p>
          {journalEntries.map((entry, index) => (
            <JournalEntry
              entry={entry}
              index={index}
              skillTags={skill.SkillTags}
              key={entry.id}
            >
              {entry.UserEntries.map((userEntry) => (
                <UserEntryInput
                  key={userEntry.id}
                  entry={entry}
                  userEntry={userEntry}
                  loading={loading}
                  submitEntry={submitEntry}
                  removeEmptyReflection={removeEmptyReflection}
                />
              ))}
              {!entry.UserEntries.length && (
                <Input
                  loading={loading}
                  onSubmit={submitEntry}
                  className="m-0 mb-1"
                  rowData={{ entryId: entry.id }}
                  clearOnSubmit={false}
                  onNullError={() =>
                    toast.error('Journal entry cannot be empty.')
                  }
                />
              )}
              {entry.UserEntries?.[entry.UserEntries.length - 1]?.content && (
                <button
                  className="ms-auto float-end new-ticket-btn rounded fw-bold"
                  onClick={() => newEmptyReflection(entry.id)}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="me-2 align-middle"
                  />
                  <span className="align-middle">Add reflection</span>
                </button>
              )}
            </JournalEntry>
          ))}
        </>
      )}
    </>
  )
}

export default SkillJournal
