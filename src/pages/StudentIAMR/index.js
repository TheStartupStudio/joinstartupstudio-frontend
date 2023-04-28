import IAMR from '../../components/StudentIAMR'
import {
  IamrProvider,
  useIamrContext
} from '../../components/StudentIAMR/iamrContext/context'
import './index.css'
import Calendar from '../../components/Calendar'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axiosInstance from '../../utils/AxiosInstance'
import LoadingAnimation from '../../components/StudentIAMR/loadingAnimation'

export default function StudentIAMR() {
  return (
    <IamrProvider>
      <StudentIamrContainer />
    </IamrProvider>
  )
}

function StudentIamrContainer() {
  const {
    loading,
    student,
    setStudent,
    setSkills,
    setCertificationOneStatus,
    setCertificationTwoStatus,
    setLoading
  } = useIamrContext()
  const { studentId } = useParams()
  const [error, setError] = useState(false)

  useEffect(() => {
    axiosInstance
      .get(`/instructor/iamr/students/${studentId}`)
      .then(({ data }) => {
        const {
          skills,
          certificationOneStatus,
          certificationTwoStatus,
          student
        } = data
        setSkills(skills)
        setCertificationOneStatus(certificationOneStatus)
        setCertificationTwoStatus(certificationTwoStatus)
        setStudent(student)
        setLoading(false)
      })
      .catch((e) => {
        if (e.response?.status === 404) setError(e.response.data)
        else setError('Something went wrong, please try again!')
        setLoading(false)
      })
  }, [])

  return (
    <div className='container-fluid iamr-page'>
      <div className='row'>
        <div className='col-12 col-xl-9 px-0'>
          <div className='page-border'>
            {loading ? (
              <LoadingAnimation show={loading} />
            ) : error ? (
              <p className='error my-5 py-5'>{error}</p>
            ) : (
              <>
                <div className='iamr-page-padding iamr-page-header border-bottom'>
                  <h3 className='page-title'>STUDENT UPLOADS</h3>
                  <h3 className='page-title student-name'>{student?.name}</h3>
                  <p className='page-description mt-3 mt-md-5'>
                    WELCOME TO{' '}
                    <span className='fw-bold'>
                      I AM MARKET READY CERTIFICATION SYSTEM{' '}
                    </span>
                  </p>
                </div>
                <IAMR />
              </>
            )}
          </div>
        </div>
        <div className='col-12 col-xl-3 px-0'>
          <div className='account-page-padding' style={{ paddingLeft: '20px' }}>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  )
}
