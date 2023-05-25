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

export const IAMR = (props) => {
  const [iamrModal, setIamrModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [savingLoading, setSavingLoading] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [activeSubmission, setActiveSubmission] = useState(null)
  const [isPublished, setIsPublished] = useState(false)
  const user = useSelector((state) => state?.user?.user?.user)

  useEffect(() => {
    props.user !== undefined && setIsPublished(props.user?.show_iamr)
  }, [props.user])

  // const updateShowPreference = async () => {
  //   const oldPublishValue = isPublished
  //   setIsPublished(!isPublished)
  //   await axiosInstance
  //     .put(`/users`, {
  //       show_iamr: !oldPublishValue
  //     })
  //     .then()
  //     .catch((e) => {
  //       setIsPublished(!oldPublishValue)
  //       toast.error(<IntlMessages id='alerts.something_went_wrong' />)
  //     })
  // }

  useEffect(() => {
    axiosInstance
      .get(`/submissions/user/${props.user.id}`)
      .then((data) => setSubmissions(data.data.submissions))
  }, [])

  const updateSubmission = (submission) => {
    setActiveSubmission(submission)
    setEditModal(true)
  }

  const deleteSubmission = (submission) => {
    setActiveSubmission(submission)
    setDeleteModal(true)
  }

  const IAMRSubmissionCard = (props) => {
    return (
      <div>
        <div
          style={{
            backgroundImage: `url(${props.submission?.imageUrl})`,
            // backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: 215,
            width: 290,
            display: 'flex',
            alignItems: 'flex-end',
            border: '1px solid #e3e3e3',
            // backgroundSize: '100% 100%',
            backgroundSize: 'cover',
          }}
        >
          <div
            style={{
              backgroundColor: '#51C7DF',
              padding: 10,
              color: '#fff',
              fontWeight: 500,
              width: '100%',
            }}
          >
            I AM VIDEO
          </div>
        </div>
      </div>
    )
  }

  return props?.preview !== 'undefined' ? (
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

          <p className="m-3">
            The components of your portfolio speak to your level of market-ready
            skills as you introduce the world to who you are, what you can do,
            and your ability to prove it.
          </p>

          <div className="iamr-submissions m-3">
            <div className="row d-flex justify-content-between">
              {submissions.map((submission) => {
                return (
                  <div
                    className="col-12 col-sm-5 col-lg-5 px-0"
                    key={submission.id}
                  >
                    <IAMRSubmissionCard submission={submission} />
                    {/*<div className="iamr-submission">*/}
                    {/*  <p className="text-center iamr-Current Positionsubmission-title">*/}
                    {/*    {submission.title}*/}
                    {/*  </p>*/}
                    {/*  {props.preview ? (*/}
                    {/*    <div*/}
                    {/*      className="add-submission"*/}
                    {/*      style={{ width: '100%' }}*/}
                    {/*    >*/}
                    {/*      <a*/}
                    {/*        href={*/}
                    {/*          submission.link.startsWith('http')*/}
                    {/*            ? submission.link*/}
                    {/*            : 'https://' + submission.link*/}
                    {/*        }*/}
                    {/*        target="_blank"*/}
                    {/*      >*/}
                    {/*        <img src={submission.imageUrl} alt="" />*/}
                    {/*      </a>*/}
                    {/*    </div>*/}
                    {/*  ) : (*/}
                    {/*    <div className="add-submission">*/}
                    {/*      <div className="submission-actions">*/}
                    {/*        <a onClick={() => updateSubmission(submission)}>*/}
                    {/*          <FontAwesomeIcon*/}
                    {/*            icon={faPencilAlt}*/}
                    {/*            className="mb-2 ms-1 icon"*/}
                    {/*            style={{ height: '25px', width: '25px' }}*/}
                    {/*          />*/}
                    {/*        </a>*/}
                    {/*        <a onClick={() => deleteSubmission(submission)}>*/}
                    {/*          <FontAwesomeIcon*/}
                    {/*            icon={faTrash}*/}
                    {/*            className="mb-2 ms-1 icon"*/}
                    {/*            style={{ height: '25px', width: '25px' }}*/}
                    {/*          />*/}
                    {/*        </a>*/}
                    {/*      </div>*/}
                    {/*      <a*/}
                    {/*        href={*/}
                    {/*          submission.link?.startsWith('http')*/}
                    {/*            ? submission.link*/}
                    {/*            : `https://${submission.link}`*/}
                    {/*        }*/}
                    {/*        target="_blank"*/}
                    {/*      >*/}
                    {/*        <img src={submission.imageUrl} alt="" />*/}
                    {/*      </a>*/}
                    {/*    </div>*/}
                    {/*  )}*/}
                    {/*</div>*/}
                  </div>
                )
              })}
              {!props.preview && props.preview !== '1' && (
                <div className="col-12 col-sm-5 col-lg-5 px-0">
                  <div className="iamr-submission">
                    <p className="text-center iamr-submission-title">
                      Add Another Submission
                    </p>
                    <div
                      className="add-submission"
                      style={{ width: '100%' }}
                      onClick={() => setIamrModal(true)}
                    >
                      <span className="submission-plus">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="mx-4 icon gray-ico"
                          style={{ height: '60px', width: '60px' }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
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
                submission,
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
  ) : null
}
