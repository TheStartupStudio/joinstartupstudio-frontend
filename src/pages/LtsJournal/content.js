import React, { useState, useEffect, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MediaLightbox from '../../components/MediaLightbox'
import parse from 'html-react-parser'
import EntriesBox from './EntriesBox'
import TableWrapper from './TableWrapper/index'
import TableReflections from './TableReflections/index.js'
import _ from 'lodash'
import MeetingManager from './ArchiveManager/MeetingManager/MeetingManager'
import FeedbackManager from './ArchiveManager/FeedbackManager/FeedbackManager'
import MentorMeetingManager from './ArchiveManager/MentorMeetingManager/MentorMeetingManager'
import ContentUploads from './ContentUploads/ContentUploads'
import CertificationSkills from './CertificationSkills/CertificationSkills'
import AccordionItems from './MyGoals/AccordionItems'
import JournalBrands from './JournalBrands/index'
import Rwl from './rwl'
import JournalTables from './JournalTables/JournalTables'
import AccordionItemWrapper from './UI/AccordionItemWrapper.js'
import IntlMessages from '../../utils/IntlMessages'
import InterviewedMentors from './InterviewedMentors'

function LtsJournalContent(props) {
  const location = useLocation()
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(false)
  let [showVideo, setShowVideo] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAccordionClick = (accordion) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(accordion)
    }
  }

  useEffect(() => {
    setIsExpanded(false)
  }, [props.match.params.id])

  const handleShowAddReflection = (showAddReflection) => {
    setShowAddReflection(showAddReflection)
  }

  // async function saveWatchData(data) {
  //   await axiosInstance.put(
  //     `/ltsJournals/${props.match.params.journalId}/videoWatchData`,
  //     {
  //       videoWatchData: JSON.stringify(data)
  //     }
  //   )
  // }

  // async function saveVideoWatched() {
  //   await axiosInstance.put(
  //     `/ltsJournals/${props.match.params.journalId}/watchedVideo`
  //   )
  // }

  async function getJournal() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${props.match.params.journalId}/student/${0}`
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

  const updateUserReflectionsTable = (updatedTable, index) => {
    const updatedJournal = { ...journal }

    const foundedReflectionsTable = updatedJournal?.reflectionsTable[index]

    if (foundedReflectionsTable) {
      const updatedUserReflectionsTable = [
        ...foundedReflectionsTable.userReflectionsTable
      ]

      updatedUserReflectionsTable.push(updatedTable)

      foundedReflectionsTable.userReflectionsTable = updatedUserReflectionsTable

      updatedJournal.reflectionsTable[index] = foundedReflectionsTable

      setJournal(updatedJournal)
    }
  }

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
  const [isAddReflection, setIsAddReflection] = useState(false)

  useEffect(() => {
    if (location?.pathname?.includes('student-personal-finance')) {
      setIsAddReflection(false)
    } else {
      setIsAddReflection(true)
    }
  }, [location.pathname])

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
          if (mapUserJournalEntry.id === userJournalEntry.id) {
            return data.data.entry
          } else {
            return mapUserJournalEntry
          }
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
                    <img src={video.thumbnail} alt='thumbnail' />
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

          {journal?.content?.includes('<div') ||
          journal?.content?.includes('<p') ? (
            parse(`${journal.content}`)
          ) : (
            <p className='page-card__content-description'>{journal.content}</p>
          )}
        </div>
      </div>
      {/* THIS IS WHERE THE DROPDOWN THING GOES */}
      {props.match.params.journalId.includes('1001006') ? (
        <div
          className='col-12 journal_intro-accordion-title'
          style={{ marginTop: '-20px' }}
        >
          <>
            <AccordionItemWrapper
              isOpened={openAccordion === 'intro-journal'}
              handleAccordionClick={() => handleAccordionClick('intro-journal')}
              isExanded={isExpanded}
              title={'Click here for the LTS Journal Sections breakdown'}
            >
              {openAccordion === 'intro-journal' && (
                <>
                  <ul
                    className='intro-journal'
                    id='intro-journal'
                    style={{ paddingLeft: 0 }}
                  >
                    <li
                      className='journal_intro-list'
                      style={{ fontWeight: '400', fontSize: '13px' }}
                    >
                      <span style={{ fontWeight: '600' }}>SECTION ONE:</span> MY
                      INSPIRATION: In this journal section, you will find
                      guidance to stop feeling stuck and find a new direction to
                      follow{' '}
                    </li>
                    <li style={{ fontWeight: '400', fontSize: '13px' }}>
                      <span style={{ fontWeight: '600' }}>SECTION TWO:</span> MY
                      VALUE PROPOSITION: In this journal section, you will
                      create your statement of value by identifying your
                      interests/passions, skills, and achievable outcomes. You
                      will continue to iterate on this statement so it always
                      reflects who you are, what you can do, and how you can
                      prove it. This section of the journal reflects the
                      Environments and Core Skills layers of the LTS Model.{' '}
                    </li>
                    <li style={{ fontWeight: '400', fontSize: '13px' }}>
                      <span style={{ fontWeight: '600' }}>SECTION THREE:</span>{' '}
                      MY TEAM: In this journal section, you will build a team
                      either as a leader or as a member. When your project needs
                      more than just your skills and knowledge, you will come
                      here to determine who you need, why you need them, and
                      what they will do. This section of the journal reflects
                      the Environments and Core Skills layers of the LTS Model.
                    </li>
                    <li style={{ fontWeight: '400', fontSize: '13px' }}>
                      <span style={{ fontWeight: '600' }}>SECTION FOUR:</span>{' '}
                      MY GOALS: In this journal section, you will identify your
                      individual and team goals. You will create a timeline to
                      achieve these goals. You will complete sprints to execute
                      on your goals. This section of the journal reflects each
                      layer of the LTS Model. Focusing on your individual goals
                      reflects the Environment and Core Skills parts of the
                      model. Focusing on your project goals reflects the LEARN,
                      DEVELOP, BRAND, and START parts of the model.
                    </li>
                    <li style={{ fontWeight: '400', fontSize: '13px' }}>
                      <span style={{ fontWeight: '600' }}>SECTION FIVE:</span>{' '}
                      MY FEEDBACK: In this journal section, you will record all
                      feedback given by your peers, teachers, and more after
                      pitches or other ways of sharing your solutions. This
                      section of the journal reflects on each layer of the LTS
                      Model.
                    </li>
                    <li style={{ fontWeight: '400', fontSize: '13px' }}>
                      <span style={{ fontWeight: '600' }}>SECTION SIX:</span> MY
                      RWL: In this journal section, you will be able to review
                      Read, Watch, Listen market-ready recommendations and add
                      them to your RWL list so you can create and sustain habits
                      around healthy consumption of media. You are able to check
                      off the resources you complete and write articles based on
                      them that you can add to your portfolio.
                    </li>
                  </ul>
                </>
              )}

              {/* {openAccordion === 'evaluation' && <AccordionItems />} */}
            </AccordionItemWrapper>
          </>
        </div>
      ) : null}
      {journal?.journalTables ? (
        <div className='col-12'>
          <>
            <JournalTables
              loadData={loadData}
              tables={journal?.journalTables}
              paragraphs={journal?.journalParagraphs}
              loading={loading}
              setLoading={setLoading}
              backgroundColor={'#fff'}
            />
          </>
        </div>
      ) : null}

      <div className='row'>
        {journal.entries && journal.entries.length ? (
          <div className='col-12'>
            <div className='journal-entries'>
              <EntriesBox
                // accordion={accordion}
                entries={journal.entries}
                entryBoxTitle={journal?.title}
                journal={journal}
                isEditable={true}
                isDeletable={true}
                userJournalEntries={userJournalEntries}
                deleteReflection={(entry, userJournalEntry) =>
                  deleteReflection(entry, userJournalEntry)
                }
                updateReflection={(entry, userJournalEntry) =>
                  updateReflection(entry, userJournalEntry)
                }
                addReflection={(entry) => addReflection(entry)}
                handleShowAddReflection={(reflection) =>
                  handleShowAddReflection(reflection)
                }
                showAddReflection={showAddReflection}
                isAddReflection={isAddReflection}
              />
            </div>
          </div>
        ) : null}
        {journal.hasAccordion ? (
          <div className='col-12'>
            <div className={'custom-breakdowns-container'}>
              <div>
                {!loading && (
                  <div style={{ order: 1 }}>
                    {
                      <AccordionItemWrapper
                        isOpened={openAccordion === 'evaluation'}
                        handleAccordionClick={() =>
                          handleAccordionClick('evaluation')
                        }
                        isExanded={isExpanded}
                        title={'EVALUATION SYSTEM'}
                      >
                        {openAccordion === 'evaluation' && <AccordionItems />}
                      </AccordionItemWrapper>
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* {journal?.ltsJournalAccordions && journal?.ltsJournalAccordions?.length
          ? journal?.ltsJournalAccordions
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              ?.map((accordion) => {
                return (
                  <div className='col-12'>
                    <AccordionItemWrapper
                      isOpened={openAccordion === `accordion-${accordion.id}`}
                      handleAccordionClick={() =>
                        handleAccordionClick(`accordion-${accordion.id}`)
                      }
                      isExanded={false}
                      title={accordion.title}
                      accordionStyle={{ backgroundColor: '#fff' }}
                    >
                      {openAccordion === `accordion-${accordion.id}` && (
                        <InterviewedMentors
                          accordion={accordion}
                          journal={journal}
                        />
                      )}
                    </AccordionItemWrapper>
                  </div>
                )
              })
          : null} */}

        {journal.accordions && journal.accordions.length
          ? journal.accordions.map((accordion) => (
              <div className='col-12'>
                <AccordionItemWrapper
                  isOpened={openAccordion === `accordion-${accordion.id}`}
                  handleAccordionClick={() =>
                    handleAccordionClick(`accordion-${accordion.id}`)
                  }
                  isExanded={false}
                  title={accordion.title}
                >
                  {openAccordion === `accordion-${accordion.id}` && (
                    <>
                      {accordion.ltsJournalAccordionEntries &&
                        accordion.ltsJournalAccordionEntries.length > 0 && (
                          <div className='accordion-content'>
                            <div className='col-12'>
                              <div className=''>
                                <EntriesBox
                                  accordion={accordion}
                                  entries={accordion.ltsJournalAccordionEntries}
                                  entryBoxTitle={journal?.title}
                                  isEditable={true}
                                  journal={journal}
                                  userJournalEntries={userJournalEntries}
                                  deleteReflection={(entry, userJournalEntry) =>
                                    deleteReflection(entry, userJournalEntry)
                                  }
                                  updateReflection={(entry, userJournalEntry) =>
                                    updateReflection(entry, userJournalEntry)
                                  }
                                  addReflection={(entry) =>
                                    addReflection(entry)
                                  }
                                  handleShowAddReflection={(reflection) =>
                                    handleShowAddReflection(reflection)
                                  }
                                  showAddReflection={showAddReflection}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      {accordion.journalTablesAccordions &&
                        accordion.journalTablesAccordions.length > 0 && (
                          <div
                            className='accordion-content'
                            style={{ padding: '15px 15px ' }}
                          >
                            <div className='col-12'>
                              <div className=''>
                                <JournalTables
                                  tables={accordion?.journalTablesAccordions}
                                  paragraphs={null}
                                  loading={loading}
                                  setLoading={setLoading}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                    </>
                  )}
                </AccordionItemWrapper>
              </div>
            ))
          : null}
        {journal.brandsJournal &&
        journal.brandsJournal.length &&
        journal.brandsJournal.find((item) => item.hasAccordion) ? (
          <div className='col-12'>
            <AccordionItemWrapper
              isOpened={openAccordion === `accordion-brand`}
              handleAccordionClick={() =>
                handleAccordionClick(`accordion-brand`)
              }
              isExanded={false}
              title={'BRAND VIDEO SPRINT'}
            >
              {openAccordion === `accordion-brand` && (
                <>
                  <div className='accordion-content'>
                    <div>
                      <div>
                        <div>
                          <div className='col-12'>
                            <div className=''>
                              <JournalBrands
                                hasAccordion={1}
                                loadData={loadData}
                                brands={journal.brandsJournal}
                                journalId={props.match.params.journalId}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </AccordionItemWrapper>
          </div>
        ) : null}
        {journal.reflectionsTable && journal.reflectionsTable.length ? (
          <>
            {journal.reflectionsTable.map((reflectionTable, tableIndex) => (
              <div className='col-12' key={reflectionTable.id}>
                {reflectionTable.userReflectionsTable.length === 0 ? (
                  <TableWrapper title={reflectionTable.title}>
                    <TableReflections
                      name={'reflectionsTable'}
                      isEditable={true}
                      loadData={loadData}
                      tableTitle={reflectionTable.title}
                      start={reflectionTable.startDate}
                      end={reflectionTable.endDate}
                      reflectionTable={reflectionTable}
                      userReflectionsTable={
                        reflectionTable.userReflectionsTable
                      }
                      reflectionTableEntries={
                        reflectionTable.reflectionsTableEntries
                      }
                      userReflectionTableEntries={
                        reflectionTable.userReflectionsTableEntries
                      }
                      updateUserReflectionsTable={(data) =>
                        updateUserReflectionsTable(data, tableIndex)
                      }
                    />
                  </TableWrapper>
                ) : (
                  <>
                    {reflectionTable.userReflectionsTable.map(
                      (userReflectionTable) => (
                        <TableWrapper title={userReflectionTable.title}>
                          <TableReflections
                            name={'userReflectionsTable'}
                            loadData={() => {
                              loadData()
                            }}
                            isEditable={true}
                            tableTitle={userReflectionTable.title}
                            start={userReflectionTable.startDate}
                            end={userReflectionTable.endDate}
                            reflectionTable={userReflectionTable}
                            userReflectionsTable={[
                              ...reflectionTable.userReflectionsTable
                            ]}
                            reflectionTableEntries={[
                              ...(userReflectionTable?.userReflectionsTableEntries ||
                                []),
                              ...reflectionTable.reflectionsTableEntries
                            ]}
                            userReflectionTableEntries={
                              reflectionTable.userReflectionsTableEntries
                            }
                          />
                        </TableWrapper>
                      )
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        ) : null}

        {journal?.teamMeetings ? (
          <MeetingManager journal={journal} isEditable={true} />
        ) : null}
        {journal?.feedbacks ? (
          <FeedbackManager journal={journal} isEditable={true} />
        ) : null}
        {journal?.mentorMeetings ? (
          <MentorMeetingManager journal={journal} isEditable={true} />
        ) : null}
        {journal?.contentUploads ? (
          <ContentUploads journal={journal} isEditable={true} />
        ) : null}
        {journal?.certificationSkills ? (
          <CertificationSkills journal={journal} isEditable={true} />
        ) : null}
        {journal.brandsJournal &&
        journal.brandsJournal.length &&
        !journal.brandsJournal.find((item) => item.hasAccordion) ? (
          <JournalBrands
            hasAccordion={0}
            loadData={loadData}
            brands={journal.brandsJournal}
            journalId={props.match.params.journalId}
            hasActions={true}
          />
        ) : null}

        {props.match.params.journalId === '1001028' && (
          <Rwl isEditable={true} />
        )}
      </div>
    </>
  )
}

export default injectIntl(LtsJournalContent, {
  withRef: false
})
