// import React, { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import './index.css'
// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'
// import { useSelector } from 'react-redux'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons'
// import DownloadFormatModal from './downloadFormatModal'
// import Certification from './Certification'
// import LoadingAnimation from '../../../../ui/loadingAnimation'

// const CertificationStatus = () => {
//   const { user } = useSelector((state) => state.user)
//   const [loading, setLoading] = useState(true)
//   const [downloadFormatModal, setDownloadFormatModal] = useState(false)
//   const [certificationId, setCertificationId] = useState()

// const date = new Date()
// const formattedDate = date.toLocaleDateString('en-US', {
//   day: '2-digit',
//   month: '2-digit',
//   year: 'numeric'
// })

//   const { id } = useParams()

//   //below implementation was needed because id was changing twice in the first render
//   //calling getCertificationStatus twice aswell
//   useEffect(() => {
//     if (id !== certificationId) {
//       setCertificationId(id)
//       setLoading(true)
//     }
//     setLoading(false)
//   }, [id, certificationId])

//   const downloadCertificateAsPdf = () => {
//     const certificate = document.querySelector('.certificate-container')
//     html2canvas(certificate).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png')
//       const pdf = new jsPDF('p', 'mm', 'a4')
//       const imgProps = pdf.getImageProperties(imgData)
//       const pdfWidth = pdf.internal.pageSize.getWidth() - 20 // Subtract 20mm for padding
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
//       pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight)
//       pdf.save('certificate.pdf')
//     })
//   }

//   const downloadCertificateAsPng = () => {
//     const certificate = document.querySelector('.certificate-container')
//     html2canvas(certificate).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png')
//       const link = document.createElement('a')
//       link.download = 'certificate.png'
//       link.href = imgData
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     })
//   }

//   return (
//     <>
//       <div className="certification-status">
//         {loading ? (
//           <LoadingAnimation show={loading} />
//         ) : (
//           <>
//             <div className="my-3">
//               <p className="pb-0 mb-0">
//                 Congratulations! You have earned your Market-Ready <br />
//               </p>
//               <span className="d-flex">
//                 <p>{`Certification ${id}`}: </p>
//                 <p className="text-info">
//                   Competitive Entry Level Employability
//                 </p>
//               </span>
//             </div>
//             <div className="d-flex justify-content-end mb-3">
//               <FontAwesomeIcon
//                 icon={faCloudDownloadAlt}
//                 title="Download certification"
//                 onClick={() => setDownloadFormatModal(true)}
//                 style={{
//                   fontSize: '20px',
//                   color: 'lightgrey',
//                   cursor: 'pointer'
//                 }}
//               />
//             </div>
//             <Certification
//               id={id}
//               user={user.user.name}
//               completionDate={formattedDate}
//             />
//           </>
//         )}
//       </div>
//       <DownloadFormatModal
//         show={downloadFormatModal}
//         onHide={() => setDownloadFormatModal(false)}
//         downloadCertificateAsPdf={downloadCertificateAsPdf}
//         downloadCertificateAsPng={downloadCertificateAsPng}
//       />
//     </>
//   )
// }

// export default CertificationStatus

import React, { useState, useEffect, useRef } from 'react'

import { useParams } from 'react-router-dom'
import './index.css'

import { toast } from 'react-toastify'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons'
import DownloadFormatModal from './downloadFormatModal'
import Certification from './Certification'
import axiosInstance from '../../../../utils/AxiosInstance'
import { showErrors } from '../../../../utils/helpers'
import LoadingAnimation from '../../../../ui/loadingAnimation'
import notificationTypes from '../../../../utils/notificationTypes'
import notificationSocket from '../../../../utils/notificationSocket'
import DialogModal from '../customComponents/dialogModal'

const CertificationStatus = () => {
  const { user } = useSelector((state) => state.user)
  const userRole = localStorage.getItem('role')
  const [loading, setLoading] = useState(true)
  const [certificationStatus, setCertificationStatus] = useState()
  const [approvalRequestStatus, setApprovalRequestStatus] = useState()
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [downloadFormatModal, setDownloadFormatModal] = useState(false)
  const [certificationId, setCertificationId] = useState()
  const [approvalDate, setApprovalDate] = useState(null)
  const loggedUser = useSelector((state) => state.user.user.user)

  const date = userRole === 'student' ? new Date(approvalDate) : new Date()
  const formattedDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  const { id } = useParams()

  const certificationType =
    id == 1
      ? 'student-certification-1'
      : id == 2
      ? 'student-certification-2'
      : ''

  const { status, unApprovedSkills } = certificationStatus || {}
  const { status: approvedStatus, unCompletedSkills } =
    approvalRequestStatus || {}

  //below implementation was needed because id was changing twice in the first render
  //calling getCertificationStatus twice aswell
  useEffect(() => {
    if (id !== certificationId) setCertificationId(id)
  }, [id, certificationId])

  useEffect(() => {
    if (certificationId == 1 || certificationId == 2) {
      getCertificationStatus()
      getApprovalRequestStatus()
      setLoading(true)
      return
    }
    setLoading(false)
  }, [certificationId])

  const getCertificationStatus = async () => {
    if (!certificationType) {
      setLoading(false)
      return
    }

    await axiosInstance
      .get(`/iamr/certifications/status/${certificationType}`)
      .then(({ data }) => {
        setCertificationStatus(data)
      })
      .catch((e) => showErrors(e))
    setLoading(false)
  }

  const getApprovalRequestStatus = async () => {
    if (!certificationType) {
      setLoading(false)
      return
    }

    await axiosInstance
      .get(`/iamr/certifications/status/approval-request/${certificationType}`)
      .then(({ data }) => {
        setApprovalDate(data.approvalRequest?.approval_date)
        setApprovalRequestStatus(data)
      })
      .catch((e) => showErrors(e))
    setLoading(false)
  }

  const submitApproval = async () => {
    try {
      if (approvedStatus && approvedStatus === 'denied') {
        setSubmitLoading(true)
        // If there is an existing approval request and the status of request is denied, update the status to pending again
        await axiosInstance
          .patch(
            `/iamr/certifications/status/approval-request/${loggedUser.id}/${certificationType}`,
            {
              status: 'pending'
            }
          )
          .then(({ data }) => {
            const type = notificationTypes.REAPPROVAL_REQUEST.key
            setApprovalRequestStatus(data)
            notificationSocket?.emit('sendNotification', {
              sender: loggedUser,
              // later this will change
              receivers: [
                { id: 933, email: 'ahall@learntostart.com' },
                { id: 128, email: 'Legjenda@eduongo.com' },
                { id: 122, email: 'albion@eduongo.com' }
              ],
              type: type,
              url: `/student-iamr/${loggedUser.id}}/${id}/certification-status`
            })

            toast.success('An approval request has been re-submitted.')
          })
        setSubmitLoading(false)
      } else {
        // If there is no existing approval request
        setSubmitLoading(true)
        await axiosInstance
          .post(`/iamr/certifications/submit/approval/${certificationType}`)
          .then(({ data }) => {
            const type = notificationTypes.APPROVAL_REQUEST.key
            setApprovalRequestStatus(data)
            notificationSocket?.emit('sendNotification', {
              sender: loggedUser,
              // later this will change
              receivers: [
                { id: 933, email: 'ahall@learntostart.com' },
                { id: 128, email: 'Legjenda@eduongo.com' },
                { id: 122, email: 'albion@eduongo.com' }
              ],
              type: type,
              url: `/student-iamr/${loggedUser.id}/${id}/certification-status`
            })

            toast.success('An approval request has been submitted.')
          })
        setSubmitLoading(false)
      }
    } catch (error) {
      showErrors(error)
    }

    setShowSubmitModal(false)
  }

  const downloadCertificateAsPdf = () => {
    const certificate = document.querySelector('.certificate-container')
    html2canvas(certificate).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20 // Subtract 20mm for padding
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight)
      pdf.save('certificate.pdf')
    })
  }

  const downloadCertificateAsPng = () => {
    const certificate = document.querySelector('.certificate-container')
    html2canvas(certificate).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'certificate.png'
      link.href = imgData
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  console.log('loading', loading)

  return (
    <>
      <div className='certification-status'>
        {loading ? (
          <LoadingAnimation show={loading} />
        ) : !certificationType ? (
          <p className='title text-danger'>Invalid certification type</p>
        ) : (
          <>
            {userRole === 'student' && (
              <>
                <p className='title'>Certification {id} Skills</p>
                {approvedStatus && approvedStatus === 'pending' && (
                  <p> You have a pending certification request! </p>
                )}
                {!approvedStatus && unCompletedSkills?.length > 0 && (
                  <>
                    <p>
                      You need to earn proficient in each skill before
                      submitting for approval request.
                    </p>
                    {approvalRequestStatus.unCompletedSkills.map((skill) => (
                      <p className='text-danger' key={skill}>
                        {skill}
                      </p>
                    ))}
                  </>
                )}

                {approvedStatus === 'denied' &&
                  unCompletedSkills?.length > 0 && (
                    <>
                      <p>
                        Please work on improving the following denied skills to
                        achieve proficiency before resubmitting for approval.
                      </p>
                      {approvalRequestStatus.unCompletedSkills.map((skill) => (
                        <p className='text-danger' key={skill}>
                          {skill}
                        </p>
                      ))}
                    </>
                  )}

                {approvedStatus === 'approved' &&
                  !status &&
                  unApprovedSkills?.length > 0 && (
                    <>
                      <p>
                        You need to earn approved in each skill before
                        submitting for certification.
                      </p>
                      {certificationStatus.unApprovedSkills.map((skill) => (
                        <p className='text-danger' key={skill}>
                          {skill}
                        </p>
                      ))}
                    </>
                  )}
              </>
            )}

            {((approvedStatus && approvedStatus === 'approved') ||
              userRole !== 'student') && (
              <>
                <div className='my-3'>
                  <p className='pb-0 mb-0'>
                    Congratulations! You have earned your Market-Ready <br />
                  </p>
                  <span className='d-flex'>
                    <p>{`Certification ${id}`}: </p>
                    <p className='text-info'>
                      Competitive Entry Level Employability
                    </p>
                  </span>
                </div>
                <div className='d-flex justify-content-end mb-3'>
                  <FontAwesomeIcon
                    icon={faCloudDownloadAlt}
                    title='Download certification'
                    onClick={() => setDownloadFormatModal(true)}
                    style={{
                      fontSize: '20px',
                      color: 'lightgrey',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                <Certification
                  id={id}
                  user={user.user.name}
                  completionDate={formattedDate}
                />
              </>
            )}

            {!approvedStatus && unCompletedSkills?.length === 0 ? (
              <div className='completed-certification'>
                <p>
                  It is time for you to submit your proof of skills to The
                  Startup Studio to earn approval
                </p>
                <button
                  className='lts-button view-credential-btn float-end mt-2 px-2'
                  style={{ width: 'auto' }}
                  onClick={() => setShowSubmitModal(true)}
                >
                  SUBMIT FOR APPROVAL
                </button>
              </div>
            ) : (
              // : approvedStatus === 'pending' &&
              //   unCompletedSkills?.length === 0 ? (
              //   <p> You have a pending certification request! </p>
              // )
              approvedStatus &&
              approvedStatus === 'denied' &&
              unCompletedSkills?.length === 0 && (
                <div className='completed-certification'>
                  <p>
                    Please proceed with the resubmission of your updated proof
                    for approval.
                  </p>
                  <button
                    className='lts-button view-credential-btn float-end mt-2 px-2'
                    style={{ width: 'auto' }}
                    onClick={() => submitApproval()}
                    disabled={unCompletedSkills?.length > 0}
                  >
                    RE SUBMIT FOR APPROVAL
                  </button>
                </div>
              )
            )}
          </>
        )}
      </div>
      <DialogModal
        show={showSubmitModal}
        onHide={() => setShowSubmitModal(false)}
        // onSubmit={submitCertification}
        onSubmit={submitApproval}
        title='Are you sure you want submit for certification?'
        isApprovable={true}
        loading={submitLoading}
      />
      <DownloadFormatModal
        show={downloadFormatModal}
        onHide={() => setDownloadFormatModal(false)}
        downloadCertificateAsPdf={downloadCertificateAsPdf}
        downloadCertificateAsPng={downloadCertificateAsPng}
      />
    </>
  )
}

export default CertificationStatus
