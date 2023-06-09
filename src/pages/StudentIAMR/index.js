import IAMR from '../../components/StudentIAMR'
import {
  IamrProvider,
  useIamrContext
} from '../../components/StudentIAMR/iamrContext/context'
import './index.css'
import FullCalendarComponent from '../../components/Calendar/FullCalendar'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axiosInstance from '../../utils/AxiosInstance'
import LoadingAnimation from '../../components/StudentIAMR/loadingAnimation'
import { useDispatch, useSelector } from 'react-redux'
import {
  closeTaskModal,
  getEventsStart,
  getPeriodsStart,
  openTaskModal
} from '../../redux/dashboard/Actions'
import TaskEventModal from '../../components/Modals/TaskEventModal'
import CertificationRequestsWidget from '../../components/MyStudents/certificationRequests/certificationRequestsWidget'

export default function StudentIAMR() {
  return (
    <IamrProvider>
      <StudentIamrContainer />
    </IamrProvider>
  )
}

function StudentIamrContainer() {
  const dispatch = useDispatch()
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
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)

  useEffect(() => {
    dispatch(getPeriodsStart())
    dispatch(getEventsStart())
  }, [])

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
  const taskEventModal = useSelector(
    (state) => state.dashboard.addTaskEventModal
  )
  const openTaskEventModal = () => {
    dispatch(openTaskModal('create'))
  }

  const closeTaskEventModal = () => {
    dispatch(closeTaskModal('create'))
  }

  return (
    <div className="container-fluid iamr-page">
      <div className="row">
        <div className="col-12 col-xl-9 px-0">
          <div className="page-border">
            {loading ? (
              <LoadingAnimation show={loading} />
            ) : error ? (
              <p className="error my-5 py-5">{error}</p>
            ) : (
              <>
                <div className="iamr-page-padding iamr-page-header border-bottom">
                  <h3 className="page-title">STUDENT UPLOADS</h3>
                  <h3 className="page-title student-name">{student?.name}</h3>
                  <p className="page-description mt-3 mt-md-5">
                    WELCOME TO{' '}
                    <span className="fw-bold">
                      I AM MARKET READY CERTIFICATION SYSTEM{' '}
                    </span>
                  </p>
                </div>
                <IAMR />
              </>
            )}
          </div>
        </div>
        <div className="col-12 col-xl-3 px-0">
          <div className="account-page-padding" style={{ paddingLeft: '20px' }}>
            <FullCalendarComponent events={events} periods={periods} />
            <button
              style={{
                backgroundColor: '#51c7df',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 14
              }}
              onClick={openTaskEventModal}
              className="px-4 py-2 border-0 rounded color transform text-uppercase font-weight-bold w-100 my-1"
            >
              Create Task/Event
            </button>
            <TaskEventModal
              show={taskEventModal}
              onHide={closeTaskEventModal}
              periods={periods}
              event={null}
              onEdit={null}
              startDate={null}
            />
            {/* <CertificationRequestsWidget /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
