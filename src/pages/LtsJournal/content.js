import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { faPlus, faPlay } from '@fortawesome/free-solid-svg-icons'
import { injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LtsJournalReflection from './reflection'
import ReactPlayer from 'react-player'
import MediaLightbox from '../../components/MediaLightbox'
import markdown from './markdown'
import parse from 'html-react-parser'

function LtsJournalContent(props) {
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(true)
  let [showVideo, setShowVideo] = useState(false)

  async function saveWatchData(data) {
    await axiosInstance.put(
      `/ltsJournals/${props.match.params.journalId}/videoWatchData`,
      {
        videoWatchData: JSON.stringify(data)
      }
    )
  }

  async function saveVideoWatched() {
    await axiosInstance.put(
      `/ltsJournals/${props.match.params.journalId}/watchedVideo`
    )
  }

  async function getJournal() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${props.match.params.journalId}`
      )
      return data
    } catch (err) {}
  }

  async function getUserJournalEntries() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${props.match.params.journalId}/userEntries`
      )
      let groupedByJournalEntry = {}

      if (data) {
        for (var userJournalEntry of data) {
          if (groupedByJournalEntry[userJournalEntry.journalEntryId]) {
            groupedByJournalEntry[userJournalEntry.journalEntryId].push(
              userJournalEntry
            )
          } else {
            groupedByJournalEntry[userJournalEntry.journalEntryId] = [
              userJournalEntry
            ]
          }
        }
      }

      return groupedByJournalEntry
    } catch (err) {}
  }

  function loadData() {
    setLoading(true)
    Promise.all([getJournal(), getUserJournalEntries()])
      .then(([journalData, userJournalEntries]) => {
        setJournal(journalData)
        if (
          journalData.userEntry &&
          journalData.userEntry.length > 0 &&
          journalData.userEntry[0].videoWatchData
        ) {
          try {
            setVideoWatchData(
              JSON.parse(journalData.userEntry[0].videoWatchData)
            )
          } catch (err) {}
        }
        setUserJournalEntries(userJournalEntries)

        if (props.contentContainer && props.contentContainer.current) {
          props.contentContainer.current.scrollTop = 0
        }

        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(
    function () {
      loadData()
    },
    [props.match.params.journalId]
  )

  function deleteReflection(entry, userJournalEntry) {
    return (data) => {
      let filtered = userJournalEntries[entry.id].filter(
        (mapUserJournalEntry) => {
          return mapUserJournalEntry.id !== userJournalEntry.id
        }
      )

      if (filtered.length) {
        setUserJournalEntries({
          ...userJournalEntries,
          [entry.id]: filtered
        })
      } else {
        delete userJournalEntries[entry.id]

        setUserJournalEntries({
          ...userJournalEntries
        })
      }
    }
  }

  function addReflection(entry) {
    return (data) => {
      setUserJournalEntries({
        ...userJournalEntries,
        [entry.id]: [...(userJournalEntries[entry.id] || []), data.entry]
      })
      setShowAddReflection({ ...showAddReflection, [entry.id]: false })

      props.saved && props.saved(data.journal)
    }
  }

  function updateReflection(entry, userJournalEntry) {
    return (data) => {
      setUserJournalEntries({
        ...userJournalEntries,
        [entry.id]: userJournalEntries[entry.id].map((mapUserJournalEntry) => {
          return mapUserJournalEntry.id === userJournalEntry.id
            ? data.entry
            : mapUserJournalEntry
        })
      })

      props.saved && props.saved(data.journal)
    }
  }

  if (!journal) {
    return null
  }

  let videos = (
    journal.videos && journal.videos.constructor == Array
      ? journal.videos
      : [journal.video]
  ).filter(Boolean)

  return (
    <>
      <div className='row'>
        <div className='col-12'>
          <div className='journal-entries__back'>
            <NavLink to={props.backRoute}>Back</NavLink>
          </div>

          <h4 className='page-card__content-title'>{journal.title}</h4>

          {videos &&
            videos.constructor == Array &&
            videos.map((video, index) => (
              <MediaLightbox
                video={video}
                key={index}
                show={showVideo === video.id}
                onClose={() => setShowVideo(false)}
                // watchData={videoWatchData}
                // onVideoData={saveWatchData}
                // onVideoWatched={saveVideoWatched}
              />
            ))}
          {videos && videos.constructor == Array && videos.length > 0 && (
            <div
              className={`journal-entries__videos journal-entries__videos--${
                videos.length > 1 ? 'multiple' : 'single'
              }`}
            >
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`journal-entries__video${
                    journal.content == '' ? '--welcome-video' : ''
                  }`}
                >
                  <div
                    className={`journal-entries__video-thumbnail${
                      journal.content == '' ? '--welcome-video' : ''
                    }`}
                    onClick={() => setShowVideo(video.id)}
                  >
                    <img src={video.thumbnail} />
                    <div
                      className={`journal-entries__video-thumbnail-icon${
                        journal.content == '' ? '--welcome-video' : ''
                      }`}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {journal?.content?.includes('<p') ? (
            parse(`${journal.content}`)
          ) : (
            <p className='page-card__content-description'>{journal.content}</p>
          )}
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <div className='journal-entries'>
            {journal.entries &&
              journal.entries.map((entry) => (
                <div className='journal-entries__entry' key={entry.id}>
                  <h5
                    className={
                      'journal-entries__entry-title' +
                      (entry.title.indexOf('**') !== -1
                        ? ' journal-entries__entry-title--md'
                        : '')
                    }
                    dangerouslySetInnerHTML={{
                      __html:
                        entry.title.indexOf('<h2>') === -1
                          ? markdown(entry.title)
                          : entry.title.replace(
                              new RegExp('\r?\n', 'g'),
                              '<br />'
                            )
                    }}
                  ></h5>

                  <div className='journal-entries__entry-reflections'>
                    {/* List created reflections */}
                    {userJournalEntries[entry.id] &&
                      userJournalEntries[entry.id].map((userJournalEntry) => (
                        <LtsJournalReflection
                          key={userJournalEntry.id}
                          journal={journal}
                          journalEntry={entry}
                          entry={userJournalEntry}
                          deleted={deleteReflection(entry, userJournalEntry)}
                          saved={updateReflection(entry, userJournalEntry)}
                        />
                      ))}

                    {/* Add new reflection */}
                    {(!userJournalEntries[entry.id] ||
                      showAddReflection[entry.id]) && (
                      <LtsJournalReflection
                        journal={journal}
                        journalEntry={entry}
                        entry={null}
                        saved={addReflection(entry)}
                        showCancel={!!userJournalEntries[entry.id]}
                        cancel={(e) => {
                          setShowAddReflection({
                            ...showAddReflection,
                            [entry.id]: false
                          })
                        }}
                      />
                    )}

                    {/* Show add new reflection */}
                    <div
                      className={`journal-entries__entry-reflections-actions ${
                        userJournalEntries[entry.id] &&
                        !showAddReflection[entry.id]
                          ? 'active'
                          : ''
                      }`}
                    >
                      <a
                        href='#'
                        className='journal-entries__entry-reflections-action'
                        onClick={(e) => {
                          e.preventDefault()
                          setShowAddReflection({
                            ...showAddReflection,
                            [entry.id]: true
                          })
                        }}
                      >
                        Add reflection <FontAwesomeIcon icon={faPlus} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default injectIntl(LtsJournalContent, {
  withRef: false
})
