import React, { useEffect, useState } from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import IAMRModal from './iamrModal'
import DeleteSubmissionModal from './deleteSubmissionModal'
import EditModal from './editModal'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { NavLink } from 'react-router-dom'

import './index.css'
import { useSelector } from 'react-redux'
import PortfolioSection from '../../../pages/PortfolioNew/PortfolioSection'
import useWindowWidth from '../../../utils/hooks/useWindowWidth'

export const IAMR = (props) => {
  const [iamrModal, setIamrModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [savingLoading, setSavingLoading] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [activeSubmission, setActiveSubmission] = useState(null)
  const [isPublished, setIsPublished] = useState(false)
  const user = useSelector((state) => state?.user?.user?.user)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(null)

  useEffect(() => {
    setIsPreview(props.isPreview)
  }, [props.isPreview])

  // useEffect(() => {
  //   setSubmissions(props.submissions)
  // }, [props.submissions])

  useEffect(() => {
    props.user !== undefined && setIsPublished(props.user?.show_iamr)
  }, [props.user])

  const updateShowPreference = async () => {
    const oldPublishValue = isPublished
    setIsPublished(!isPublished)
    await axiosInstance
      .put(`/users`, {
        show_iamr: !oldPublishValue
      })
      .then()
      .catch((e) => {
        setIsPublished(!oldPublishValue)
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
  }

  useEffect(() => {
    setIsLoading(true)
    axiosInstance.get(`/submissions/user/${props.user?.id}`).then((data) => {
      setIsLoading(false)
      setSubmissions(data?.data?.submissions)
    })
  }, [])

  const updateSubmission = (submission) => {
    setActiveSubmission(submission)
    setEditModal(true)
  }

  const deleteSubmission = (submission) => {
    setActiveSubmission(submission)
    setDeleteModal(true)
  }

  const windowWidth = useWindowWidth()

  const cardWidth = () => {
    if (windowWidth > 800) {
      return '80%'
    } else if (windowWidth < 800 && windowWidth > 720) {
      return '55%'
    } else if (windowWidth < 720 && windowWidth > 640) {
      return '70%'
    } else if (windowWidth < 640 && windowWidth > 520) {
      return '85%'
    } else if (windowWidth < 520) {
      return '95%'
    }
  }
  const IAMRSubmissionCard = (props) => {
    return (
      <a
        href={
          props.submission?.link?.startsWith('http')
            ? props.submission?.link
            : 'https://' + props.submission?.link
        }
        target="_blank"
        style={{
          position: 'relative',
          // width: 'calc(100% - 30px)',
          // width: 'calc(100% - 110px)',
          // width: windowWidth < 800 ? '70%' : '80%',
          width: cardWidth(),
          height: 200,
          border: '1px solid #E5E5E5'
        }}
      >
        <img
          src={props.submission?.imageUrl}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            border: '1px solid #e3e3e3'
          }}
        />
        {!isPreview && (
          <div
            style={{
              backgroundColor: 'rgba(207, 207, 207, 0.90)',
              color: '#fff',
              fontWeight: 500,
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'flex',
              height: '30px',
              paddingRight: 3,
              zIndex: 1
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 7,
                padding: '5px 3px'
              }}
              onClick={(e) => {
                props.updateSubmission(props.submission)
                e.preventDefault()
              }}
            >
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="mb-2 ms-1 icon"
                style={{ height: '15px', width: '15px' }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 7,
                padding: '5px 3px'
              }}
              onClick={(e) => {
                props.deleteSubmission(props.submission)
                e.preventDefault()
              }}
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="mb-2 ms-1 icon"
                style={{ height: '15px', width: '15px' }}
              />
            </div>
          </div>
        )}
        <div
          style={{
            backgroundColor: '#51C7DF',
            padding: '10px 20px',
            color: '#fff',
            fontWeight: 500,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            zIndex: 1
          }}
        >
          {props.submission?.title?.toUpperCase()}
        </div>

        {
          <div
            style={{
              position: 'absolute',
              left: '33%',
              top: '66%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          ></div>
        }

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.15)'
          }}
        ></div>
      </a>
    )
  }
  const AddSubmissionCard = (props) => {
    return (
      <div
        onClick={props.onOpenIamrModal}
        style={{
          position: 'relative',
          // width: 'calc(100% - 30px)',
          width: cardWidth(),
          height: 200,
          border: '1px solid #E5E5E5',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            backgroundColor: '#CFCFCF',
            padding: '10px 20px',
            color: '#fff',
            fontWeight: 500,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            zIndex: 1
          }}
        >
          Add Another Submission
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1
            // width: '50px',
          }}
        >
          <div
            className="add-submission"
            style={{ width: '100%', position: 'relative' }}
            onClick={() => setIamrModal(true)}
          >
            <span className="submission-plus">
              <FontAwesomeIcon
                icon={faPlus}
                className="mx-4  "
                style={{ height: '60px', width: '60px' }}
                color={'#BBBDBF'}
              />
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PortfolioSection
      showLinkToProjects={true}
      isShownLinkInPortfolio={isPublished}
      handleShowLinkInPortfolio={() => updateShowPreference()}
      isIAMR={true}
      isPreview={isPreview}
    >
      {props?.preview !== 'undefined' ? (
        <div className={['iamr-section', props.className].join(' ')}>
          <div
          // className="my-account rounded  iamr-section mx-0 mt-4"
          // style={{
          //   border: props?.preview ? 'none' : '1px solid #bbbdbf',
          // }}
          >
            <div
            // className="iamr-content"
            // style={{
            //   margin: props?.preview ? '40px 0 20px 0' : '40px 20px 20px 20px',
            // }}
            >
              <h4 className="m-3 text-center iamr-title">I AM MARKET-READY</h4>

              <p className="row m-3" style={{ paddingInline: '4.2%' }}>
                The components of your portfolio speak to your level of
                market-ready skills as you introduce the world to who you are,
                what you can do, and your ability to prove it.
              </p>

              <div className="iamr-submissions m-3">
                <div
                  // className="row d-flex justify-content-between"
                  // className={'row d-grid '}
                  style={{
                    rowGap: 30,
                    display: 'grid',
                    gridTemplateColumns: windowWidth < 800 ? '1fr' : '2fr 2fr',
                    justifyContent: 'center'
                  }}
                >
                  {submissions?.map((submission, index) => {
                    return (
                      <div
                        className={`d-flex justify-content-center`}
                        // className="col-12 col-sm-8 col-lg-5 px-0 d-flex justify-content-center"
                        key={submission.id}
                      >
                        <IAMRSubmissionCard
                          submission={submission}
                          index={index}
                          updateSubmission={(submission) =>
                            updateSubmission(submission)
                          }
                          deleteSubmission={(submission) =>
                            deleteSubmission(submission)
                          }
                        />
                      </div>
                    )
                  })}
                  {!isPreview && (
                    <>
                      {!props.preview && props.preview !== '1' && (
                        <div
                          className={`d-flex justify-content-center`}
                          // className="col-12 col-sm-8 col-lg-5 px-0 d-flex justify-content-center"
                        >
                          <AddSubmissionCard
                            onOpenIamrModal={() => setIamrModal(true)}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {!props.preview && props.preview !== '1' ? (
                    <div className="col-12">
                      {/* <div className='d-flex justify-content-end show_in_portfolio'>
                    <p className='py-3 py-md-0 my-auto px-md-3 p-0 pe-2 show-portfolio-text'>
                      Show link to My Projects in My Portfolio
                    </p>

                    <label className='px-0 ps-sm-1 ps-md-1 float-end my-auto form-switch d-flex'>
                      <input
                        type='checkbox'
                        checked={isPublished}
                        onChange={() => updateShowPreference()}
                      />
                      <i className='my-auto'></i>
                    </label>
                  </div>
                  <div className='col-12 text-end'>
                    <NavLink
                      to='/MyStartupProfile'
                      className='d-block me-2 mt-2'
                    >
                      <strong>EDIT MY PROJECT</strong>
                    </NavLink>
                  </div> */}
                    </div>
                  ) : (
                    <div className="col-12 text-end">
                      <NavLink
                        to={
                          props.user.id !== user?.id
                            ? `/UserProject/${props.user.id}`
                            : '/MyStartupProfile'
                        }
                        className="d-block me-2 mt-2"
                      >
                        {isPublished ? <strong>VIEW MY PROJECTS</strong> : ''}
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {submissions && (
            <IAMRModal
              show={iamrModal}
              user={props.user}
              onHide={() => {
                setIamrModal(false)
              }}
              loading={savingLoading}
              setModal={(data) => setIamrModal(data)}
              onSave={(submission) => {
                setSubmissions([...submissions, submission])
              }}
            />
          )}

          {activeSubmission && (
            <div>
              <EditModal
                show={editModal}
                user={props.user}
                submission={activeSubmission}
                onHide={() => {
                  setEditModal(false)
                }}
                loading={savingLoading}
                onSave={(submission) => {
                  setSubmissions([
                    ...submissions.filter((s) => s.id != submission.id),
                    submission
                  ])
                }}
              />

              <DeleteSubmissionModal
                show={deleteModal}
                user={props.user}
                submissionId={activeSubmission.id}
                onHide={() => {
                  setDeleteModal(false)
                }}
                setModal={(data) => setDeleteModal(data)}
                onSave={(submissionId) => {
                  setSubmissions(
                    submissions.filter(
                      (submission) => submission.id !== submissionId
                    )
                  )
                }}
              />
            </div>
          )}
        </div>
      ) : null}
    </PortfolioSection>
  )
}
