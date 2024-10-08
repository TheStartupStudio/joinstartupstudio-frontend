import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import LtsJournalReflection from './reflection'

const InterviewSection = ({ part, interviews, setVideo, journal }) => {
  const [mentorInterviews, setMentorInterviews] = useState([])

  useEffect(() => {
    if (interviews) {
      const sortedInterviews = [...interviews]?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setMentorInterviews(sortedInterviews)
    }
  }, [interviews])

  const interviewReflection = (entry, userEntry, interview) => {
    const updatedInterviews = mentorInterviews.map((i) => {
      if (i.id === interview.id) {
        return {
          ...i,
          entry: {
            ...i.entry,
            userAnswers: [userEntry]
          }
        }
      }
      return i
    })
    setMentorInterviews(updatedInterviews)
  }

  return (
    <>
      <div className={'interview-part '}>
        {part === 'part-1'
          ? 'Part One Clips & Reflections'
          : 'Part Two Clips & Reflections'}
      </div>
      {mentorInterviews
        ?.filter((interview) => interview.part === part)
        .map((interview, index) => {
          return (
            <React.Fragment key={interview.id}>
              <div className={'gap-2 d-flex align-items-center'}>
                <div className={'mr-2'}>
                  <FontAwesomeIcon
                    className={'play-icon'}
                    icon={faPlay}
                    onClick={() => setVideo(interview.interview)}
                    style={{ cursor: 'pointer', width: 20, height: 20 }}
                  />
                </div>
                <div className={'interview-description'}>
                  {interview.description}
                </div>
              </div>
              {interview?.entry && (
                <div className={'pe-1 pt-1 py-2'} style={{ paddingLeft: 28 }}>
                  <LtsJournalReflection
                    journal={journal}
                    journalEntry={interview?.entry} // parent entry
                    entry={interview?.entry?.userAnswers[0] ?? {}} // user entry
                    boxStyles={{ border: '1px solid #bbbdbf' }}
                    footerStyles={{ padding: '0' }}
                    saved={(userEntry) => {
                      return interviewReflection(
                        interview?.entry,
                        userEntry.content
                          ? {
                              ...userEntry.entry,
                              content: userEntry.content,
                              updatedAt: userEntry.updatedAt
                            }
                          : { ...userEntry.entry },
                        interview
                      )
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
    </>
  )
}

export default InterviewSection
