import React, { useEffect, useState } from 'react'
import triangleIcon from '../../../assets/images/triangle.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'
import MediaLightbox from '../../../components/MediaLightbox'
import AccordionItemWrapper from '../UI/AccordionItemWrapper'

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
              videos.constructor === Array &&
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
            {videos && videos.constructor === Array && videos.length > 0 && (
              <div
                className={`journal-entries__videos journal-entries__videos--${
                  videos.length > 1 ? 'multiple' : 'single'
                }`}
              >
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className={`journal-entries__video${
                      journal.content === '' ? '--welcome-video' : ''
                    }`}
                  >
                    <div
                      className={`journal-entries__video-thumbnail${
                        journal.content === '' ? '--welcome-video' : ''
                      }`}
                      onClick={() => setShowVideo(video.id)}
                    >
                      <img src={video.thumbnail} alt="thumbnail" />
                      <div
                        className={`journal-entries__video-thumbnail-icon${
                          journal.content === '' ? '--welcome-video' : ''
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
          <div style={{ order: 3 }}>
            {!loading && (
              <AccordionItemWrapper
                isOpened={openAccordion === 'instructor'}
                isExanded={isExpanded}
                title={'Instructor debrief'}
              >
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
                    <div className="d-flex mb-1 ">
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
                    <div className="d-flex mb-1">
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
                    <div className="d-flex mb-1 ">
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
