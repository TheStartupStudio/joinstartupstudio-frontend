import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import { useParams } from 'react-router-dom'
import './index.css'
import LoadingAnimation from '../loadingAnimation'
import { showErrors } from '../../../utils/helpers'
import { toast } from 'react-toastify'

const CertificationStatus = () => {
  const [loading, setLoading] = useState(true)
  const [certificationStatus, setCertificationStatus] = useState()
  const [approvalRequestStatus, setApprovalRequestStatus] = useState()
  const [hasAccess, setHasAccess] = useState(false)

  const { studentId, id } = useParams()

  const certificationType =
    id == 1
      ? 'student-certification-1'
      : id == 2
      ? 'student-certification-2'
      : ''

  const { status, unApprovedSkills } = certificationStatus || {}
  const { status: approvedStatus, unCompletedSkills } =
    approvalRequestStatus || {}

  useEffect(() => {
    if (id == 1 || id == 2) {
      getCertificationStatus()
      getApprovalRequestStatus()
      setLoading(true)
      hasAccessHandler()
      return
    }
    setLoading(false)
  }, [id])

  const getCertificationStatus = async () => {
    if (!certificationType) {
      setLoading(false)
      return
    }

    await axiosInstance
      .get(
        `/instructor/iamr/students/certification-status/${studentId}/${certificationType}`
      )
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
      .get(
        `/instructor/iamr/students/approval-request/${studentId}/${certificationType}`
      )
      .then(({ data }) => {
        setApprovalRequestStatus(data)
      })
      .catch((e) => showErrors(e))
    setLoading(false)
  }

  const hasAccessHandler = async () => {
    await axiosInstance
      .get('/studentsInstructorss/has-access')
      .then((data) => setHasAccess(data.data.allow))
  }

  const approvalRequestStutusHandler = async (status) => {
    await axiosInstance
      .patch(
        `/iamr/certifications/status/approval-request/${studentId}/${certificationType}`,
        {
          status: status,
        }
      )
      .then((data) =>
        toast.success(
          'Certification Successful: The student has been certified successfully'
        )
      )
  }

  return (
    <>
      <div className="certification-status">
        {loading ? (
          <LoadingAnimation show={loading} />
        ) : !certificationType ? (
          <p className="title text-danger">Invalid certification type</p>
        ) : (
          <>
            <p className="title">Certification {id} Skills</p>

            {approvedStatus === 'denied' && unCompletedSkills?.length === 0 && (
              <p>The user needs to resubmit the approval request</p>
            )}

            {hasAccess &&
              approvedStatus === 'denied' &&
              unCompletedSkills?.length > 0 && (
                <>
                  <p>
                    The student's request requires additional skill development
                    and proof before resubmission for approval.
                  </p>
                  {approvalRequestStatus.unCompletedSkills.map((skill) => (
                    <p className="text-danger" key={skill}>
                      {skill}
                    </p>
                  ))}
                </>
              )}

            {hasAccess &&
              approvedStatus !== 'denied' &&
              (unCompletedSkills?.length > 0 ? (
                <>
                  <p>
                    Student needs to complete their skill development and update
                    their proof to earn approval.
                  </p>
                  {approvalRequestStatus.unCompletedSkills.map((skill) => (
                    <p className="text-danger" key={skill}>
                      {skill}
                    </p>
                  ))}
                </>
              ) : (
                unApprovedSkills?.length > 0 && (
                  <>
                    <p>
                      Skill Approval Required: Please review the following
                      skills for student request approval.
                    </p>
                    {certificationStatus.unApprovedSkills.map((skill) => (
                      <p className="text-danger" key={skill}>
                        {skill}
                      </p>
                    ))}
                  </>
                )
              ))}

            {hasAccess && unCompletedSkills?.length === 0 ? (
              approvedStatus === 'pending' &&
              unCompletedSkills?.length === 0 && (
                <div>
                  <div className="completed-certification">
                    <p>
                      It is time for student to submit their proof of skills to
                      The Startup Studio to earn the Market-Ready Certification{' '}
                      {id}:{' '}
                      <span style={{ color: '#333d3d', fontWeight: 500 }}>
                        Competitive Entry Level Employability
                      </span>
                    </p>
                    <button
                      className="lts-button float-end mt-2 me-sm-3"
                      style={{ background: '#99cc33' }}
                      onClick={() => approvalRequestStutusHandler('approved')}
                      disabled={
                        approvedStatus === 'approved' ||
                        !approvedStatus ||
                        unApprovedSkills?.length > 0
                      }
                    >
                      Certify
                    </button>
                  </div>
                </div>
              )
            ) : approvedStatus && approvedStatus === 'pending' ? (
              <p> Student has a pending approval request! </p>
            ) : (
              approvedStatus === 'approved' && (
                <p> Student approval request has been approved!</p>
              )
            )}

            {approvedStatus === 'approved' && (
              <h6 className="certified">
                <span className="text-success">Certification Achieved: </span>
                Student has successfully obtained the certificate.
              </h6>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default CertificationStatus
