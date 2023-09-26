import React, { useEffect, useState } from 'react'
import KendoTextEditor from '../../components/JournalsManagement/TextEditor'
import triangleIcon from '../../assets/images/triangle.png'
import MediaLightbox from '../../components/MediaLightbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import AccordionItemWrapper from './AccordionItemWrapper'
import axiosInstance from '../../utils/AxiosInstance'

const MyTrainingContent = (props) => {
  let openAccordion = 'instructor'
  let [journal, setJournal] = useState({})
  let [showVideo, setShowVideo] = useState({})
  let [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  let videos = (
    journal.videos && journal.videos.constructor == Array
      ? journal.videos
      : [journal.video]
  ).filter(Boolean)

  useEffect(() => {
    async function getJournal() {
      try {
        let { data } = await axiosInstance.get(
          `/my-training/${+props.match.params.id}`
        )
        return data
      } catch (err) {}
    }
    getJournal()
  }, [props.match.params.id])

  useEffect(() => {
    setIsExpanded(false)
  }, [props.match.params.id])

  return (
    <>
      <>
        <div className={'journal-title'}>{props.journal?.title}</div>
        <div
          className={'d-flex justify-content-between w-100'}
          style={{ marginTop: 40, gap: 4 }}
        >
          <div className={'video-container'}>
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
          </div>
          <div className={'lts-triangle-container'}>
            <img
              alt={'triangleIcon'}
              className={'triangle-icon'}
              src={triangleIcon}
            />
          </div>
        </div>
        <div className={'journal-paragraph my-4'}>{journal?.paragraph}</div>
        <div className={'custom-breakdowns-container'}>
          {/* {!journal?.hasInstructorDebrief && !journal?.tasks?.length && (
            <>
              <CurriculumOverview
                title={'curriculum overview'}
                isExanded={isExpanded}
                isOpened={openAccordion === 'curriculumOverview'}
                handleAccordionClick={() =>
                  handleAccordionClick('curriculumOverview')
                }
                data={journal?.curriculumOverview}
              />{' '}
              <ExpectedOutcomes
                title={'expected outcomes'}
                isExanded={isExpanded}
                isOpened={openAccordion === 'expectedOutcomes'}
                handleAccordionClick={() =>
                  handleAccordionClick('expectedOutcomes')
                }
                data={journal?.expectedOutcomes}
              />
              <ProgramOpportunities
                title={'program opportunities'}
                isExanded={isExpanded}
                isOpened={openAccordion === 'programOpportunities'}
                handleAccordionClick={() =>
                  handleAccordionClick('programOpportunities')
                }
                data={journal?.programOpportunities}
              />
            </>
          )} */}
          {/* 
          {!journal?.hasInstructorDebrief &&
            journal?.tasks?.length &&
            journal?.tasks?.map((task, index) => {
              return (
                <>
                  <CurriculumOverview
                    title={'curriculum overview'}
                    isExanded={isExpanded}
                    isOpened={openAccordion === 'curriculumOverview'}
                    handleAccordionClick={() =>
                      handleAccordionClick('curriculumOverview')
                    }
                    data={task?.curriculumOverview}
                  />{' '}
                  <ExpectedOutcomes
                    title={'expected outcomes'}
                    isExanded={isExpanded}
                    isOpened={openAccordion === 'expectedOutcomes'}
                    handleAccordionClick={() =>
                      handleAccordionClick('expectedOutcomes')
                    }
                    data={task?.expectedOutcomes}
                  />
                  <ProgramOpportunities
                    title={'program opportunities'}
                    isExanded={isExpanded}
                    isOpened={openAccordion === 'programOpportunities'}
                    handleAccordionClick={() =>
                      handleAccordionClick('programOpportunities')
                    }
                    data={task?.programOpportunities}
                  />
                </>
              )
            })} */}

          {/* {!loading && journal?.hasInstructorDebrief && (
            <div style={{ order: 1 }}>
              {props.view === 'task' && (
                <AccordionItemWrapper
                  isOpened={openAccordion === 'steps'}
                  handleAccordionClick={() => handleAccordionClick('steps')}
                  isExanded={isExpanded}
                  title={'task breakdown'}
                >
                  {openAccordion === 'steps' && (
                    <div className="accordion-content">
                      <StepsBox
                        containsTitle={false}
                        steps={journal?.steps}
                        selectStep={selectStep}
                        selectedStepIndex={selectedStepIndex}
                        handleOpenPopup={handleOpenPopup}
                        selectedStep={selectedStep}
                      />
                    </div>
                  )}
                </AccordionItemWrapper>
              )}
              {props.view === 'week' && (
                <AccordionItemWrapper
                  isOpened={openAccordion === 'steps'}
                  handleAccordionClick={() => handleAccordionClick('steps')}
                  isExanded={isExpanded}
                  title={'weeks and their breakdowns'}
                >
                  {openAccordion === 'steps' && (
                    <div>
                      {journal?.tasks?.length === 1 && (
                        <div className="accordion-content">
                          <StepsBox
                            task={journal?.tasks[0]}
                            steps={journal?.tasks[0]?.steps}
                            selectStep={selectStep}
                            selectedStepIndex={selectedStepIndex}
                            handleOpenPopup={handleOpenPopup}
                            selectedStep={selectedStep}
                          />
                        </div>
                      )}
                      {journal?.tasks?.length > 1 && (
                        <>
                          <div
                            className={'select-task-buttons'}
                            style={{
                              backgroundColor: selectedTask ? '#f8f7f7' : '#fff'
                            }}
                          >
                            {journal?.tasks.map((task, index) => (
                              <SelectTaskButton
                                key={index}
                                handleSelectTask={() =>
                                  handleSelectTask(task, index)
                                }
                                task={task}
                                index={index}
                                selectedTaskIndex={selectedTaskIndex}
                              />
                            ))}
                          </div>
                          {journal?.tasks.map((task) => {
                            if (task?.id === selectedTask?.task?.id) {
                              return (
                                <div
                                  key={task.id}
                                  className="accordion-content"
                                >
                                  <StepsBox
                                    task={task}
                                    steps={task?.steps}
                                    selectStep={selectStep}
                                    selectedStepIndex={selectedStepIndex}
                                    handleOpenPopup={handleOpenPopup}
                                    selectedStep={selectedStep}
                                  />
                                </div>
                              )
                            }
                            return null
                          })}
                        </>
                      )}
                    </div>
                  )}
                </AccordionItemWrapper>
              )}
            </div>
          )} */}

          {/* {journal?.category !== 'financial-literacy' && (
            <div style={{ order: 2 }}>
              {!loading && journal?.hasInstructorDebrief && (
                <AccordionItemWrapper
                  isOpened={openAccordion === 'connection'}
                  handleAccordionClick={() =>
                    handleAccordionClick('connection')
                  }
                  isExanded={isExpanded}
                  title={'Connection to lts model and outcomes'}
                >
                  {openAccordion === 'connection' && (
                    <>
                      <div className="accordion-content">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                font: 'normal normal 600 17px/17px Montserrat',
                                letterSpacing: 0.68,
                                color: '#333D3D',
                                textAlign: 'center'
                              }}
                            >
                              THE LEARN TO START MODEL
                            </div>
                            <img
                              style={{
                                width: 340,
                                height: 300,
                                objectFit: 'contain'
                              }}
                              alt={'lts-triangle'}
                              src={LtsDiagram}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: 'Montserrat',
                              backgroundColor: '#fff',
                              marginBottom: 20,
                              textAlign: 'start',
                              width: '100%',
                              flexDirection: 'column'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: journal?.ltsConnection?.firstParagraph
                            }}
                          />

                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                font: 'normal normal 600 17px/17px Montserrat',
                                letterSpacing: 0.68,
                                color: '#333D3D',
                                textAlign: 'center'
                              }}
                            >
                              MARKET-READY OUTCOMES
                            </div>
                            <img
                              style={{
                                width: 180,
                                height: 180,
                                objectFit: 'contain',
                                marginBottom: 20
                              }}
                              alt={'lts-triangle'}
                              src={LtsCertification}
                            />
                          </div>

                          <div
                            style={{
                              fontFamily: 'Montserrat',
                              backgroundColor: '#fff',
                              display: 'flex',
                              justifyContent: 'start',
                              width: '100%',
                              flexDirection: 'column'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: journal?.ltsConnection?.secondParagraph
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </AccordionItemWrapper>
              )}
            </div>
          )}
          {journal?.category === 'financial-literacy' && (
            <div style={{ order: 2 }}>
              {!loading && journal?.hasInstructorDebrief && (
                <AccordionItemWrapper
                  isOpened={openAccordion === 'connection'}
                  handleAccordionClick={() =>
                    handleAccordionClick('connection')
                  }
                  isExanded={isExpanded}
                  title={'Extending task'}
                >
                  {openAccordion === 'connection' && (
                    <>
                      <div className="accordion-content">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          <div
                            style={{
                              fontFamily: 'Montserrat',
                              backgroundColor: '#fff',
                              marginBottom: 20,
                              textAlign: 'start',
                              width: '100%'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: journal?.ltsConnection?.firstParagraph
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </AccordionItemWrapper>
              )}
            </div>
          )} */}
          <div style={{ order: 3 }}>
            {/* {!loading && journal?.hasInstructorDebrief && ( */}
            {!loading && (
              <AccordionItemWrapper
                isOpened={openAccordion === 'instructor'}
                // handleAccordionClick={() => handleAccordionClick('instructor')}
                isExanded={isExpanded}
                title={'Instructor debrief'}
              >
                {/* {openAccordion === 'instructor' && ( */}
                <div className="accordion-content">
                  <div
                    style={{
                      font: 'normal normal 500 11px/17px Montserrat',
                      letterSpacing: 0.18,
                      color: '#333D3D'
                    }}
                  >
                    Welcome to the instructor debrief section of this task. This
                    tool is designed to help you use the LTS program and
                    platform to their maximum potential, and to provide LTS with
                    feedback so we can continue to meet your needs.
                  </div>

                  <>
                    <div
                      style={{
                        font: 'normal normal 600 11px/17px Montserrat',
                        letterSpacing: 0.18,
                        color: '#000000',
                        paddingTop: '20px',
                        paddingBottom: '10px'
                      }}
                    >
                      In completing this task did you:
                    </div>
                    <div class="d-flex mb-1 ">
                      <div
                        style={{
                          width: '25px',
                          flexShrink: 0,
                          marginRight: 5
                        }}
                      >
                        <input
                          style={{ width: '15px', height: '15px' }}
                          className="form-check-input "
                          type="checkbox"
                          // checked={instructorDebrief.checkbox1}
                          id="flexCheckDefault"
                          // onChange={(e) =>
                          //   handleChangeInstructorDebrief2(
                          //     'checkbox1',
                          //     e.target.checked
                          //   )
                          // }
                        />
                      </div>
                      <div
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                        style={{
                          font: 'normal normal 500 12px/18px Montserrat !important',
                          letterSpacing: 0.24,
                          color: '#231F20',
                          marginTop: '0.250rem',
                          fontSize: 12
                        }}
                      >
                        Give each student an opportunity to use their voice.
                      </div>
                    </div>
                    <div class="d-flex mb-1">
                      <div
                        style={{
                          width: '25px',
                          flexShrink: 0,
                          marginRight: 5
                        }}
                      >
                        <input
                          style={{ width: '15px', height: '15px' }}
                          className="form-check-input "
                          type="checkbox"
                          // checked={instructorDebrief.checkbox2}
                          id="flexCheckDefault"
                          // onChange={(e) =>
                          //   handleChangeInstructorDebrief2(
                          //     'checkbox2',
                          //     e.target.checked
                          //   )
                          // }
                        />
                      </div>
                      <div
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                        style={{
                          font: 'normal normal 500 12px/18px Montserrat !important',
                          letterSpacing: 0.24,
                          color: '#231F20',
                          marginTop: '0.250rem',
                          fontSize: 12
                        }}
                      >
                        Conduct at least one news briefing to start class.
                      </div>
                    </div>
                    <div class="d-flex mb-1 ">
                      <div
                        style={{
                          width: '25px',
                          flexShrink: 0,
                          marginRight: 5
                        }}
                      >
                        <input
                          style={{ width: '15px', height: '15px' }}
                          className="form-check-input "
                          type="checkbox"
                          // checked={instructorDebrief.checkbox3}
                          id="flexCheckDefault"
                          // onChange={(e) =>
                          //   handleChangeInstructorDebrief2(
                          //     'checkbox3',
                          //     e.target.checked
                          //   )
                          // }
                        />
                      </div>

                      <div
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                        style={{
                          font: 'normal normal 500 12px/18px Montserrat !important',
                          letterSpacing: 0.24,
                          color: '#231F20',
                          marginTop: '0.250rem',
                          fontSize: 12
                        }}
                      >
                        Give students adequate time to complete work inside of
                        their Journal or Portfolio.
                      </div>
                    </div>
                  </>
                  <>
                    <>
                      <div
                        style={{
                          font: 'normal normal 600 11px/17px Montserrat !important',
                          letterSpacing: 0.18,
                          color: '#000000',
                          paddingTop: '15px',
                          paddingBottom: '6px'
                        }}
                      >
                        Please submit any questions or feedback regarding this
                        task in the curriculum to the LTS team.
                      </div>
                    </>
                  </>
                  <div className={'d-flex justify-content-end mt-3'}>
                    <button
                      style={{
                        backgroundColor: '#51c7df',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600
                      }}
                      className="px-4 py-2 border-0 color transform my-1"
                      // onClick={() =>
                      //   onSubmitInstructorDebrief(newInstructorBriefData)
                      // }
                    >
                      Submit
                    </button>
                  </div>
                </div>
                {/* )} */}
              </AccordionItemWrapper>
            )}
          </div>
        </div>

        {/* <BreakdownPopup
              show={openPopup}
              onHide={handleClosePopup}
              popupContent={selectedStep?.popupContent}
            /> */}
      </>
      <div className="row">
        <div className="col-12">
          <div className="journal-entries__back">
            {/* <NavLink to={props.backRoute}>Back</NavLink> */}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="journal-entries"></div>
        </div>
      </div>
    </>
  )
}

export default MyTrainingContent
