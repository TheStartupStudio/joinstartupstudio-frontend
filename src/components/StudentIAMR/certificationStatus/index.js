import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import { useParams } from 'react-router-dom'
import './certificationStatus.css'
import LoadingAnimation from '../loadingAnimation'
import { showErrors } from '../../../utils/helpers'

const CertificationStatus = () => {
  const [loading, setLoading] = useState(true)
  const [certificationStatus, setCertificationStatus] = useState()
  const { studentId, id } = useParams()

  const certificationType =
    id == 1
      ? 'student-certification-1'
      : id == 2
      ? 'student-certification-2'
      : ''

  const { status, unCompletedSkills } = certificationStatus || {}

  useEffect(() => {
    if (id == 1 || id == 2) {
      getCertificationStatus()
      setLoading(true)
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

  return (
    <>
      <div className='certification-status'>
        {loading ? (
          <LoadingAnimation show={loading} />
        ) : !certificationType ? (
          <p className='title text-danger'>Invalid certification type</p>
        ) : (
          <>
            <p className='title'>Certification {id} Skills</p>
            {!status && unCompletedSkills?.length > 0 && (
              <>
                <p>
                  Student is still developing certian skills and will need to
                  update their proof to earn certification:
                </p>
                {certificationStatus.unCompletedSkills.map((skill) => (
                  <p className='text-danger' key={skill}>
                    {skill}
                  </p>
                ))}
              </>
            )}

            {status &&
              (status === 'pending' ? (
                <p> Student has a pending certification request! </p>
              ) : (
                status === 'approved' && (
                  <p> Student`s certification has been approved!</p>
                )
              ))}

            {!status && unCompletedSkills?.length === 0 && (
              <div className='completed-certification'>
                <p>
                  It is time for student to submit their proof of skills to The
                  Startup Studio to earn the Market-Ready Certification {id}:{' '}
                  <span style={{ color: '#333d3d', fontWeight: 500 }}>
                    Competitive Entry Level Employability
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default CertificationStatus
