import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { CustomDropdown, InfoBox } from '../ContentItems'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInstructorCertificationData,
  fetchInstructorSectionOneData,
  fetchInstructorSectionTwoData,
  fetchMasterclassPercentage,
  fetchPodcastPercentage,
  fetchQAPercentage
} from '../../../../redux/myPerformanceData/actions'
import axiosInstance from '../../../../utils/AxiosInstance'
import UniversityReports from './universityReports'
import SelectInstructorView from './SelectInstructorView'
import InstructorReports from './InstructorReports'
import {
  useHistory,
  useParams
} from 'react-router-dom/cjs/react-router-dom.min'

const Reports = ({ instructors, universityId }) => {
  const rangeFilter = {
    value: 'last30Days',
    label: 'Last 30 Days'
  }
  const [dataToView, setDataToView] = useState('school')
  const [dropdownOptions, setDropdownOptions] = useState([])
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [filterProgram, setFilterProgram] = useState('LTS1')
  const [chartLoading, setChartLoading] = useState(false)
  const [chartData, setChartData] = useState({})
  const [progressData, setProgressData] = useState([])
  const [progressLoading, setProgressLoading] = useState(false)
  const [studentsCount, setStudentsCount] = useState([])
  const [studentsCountLoading, setStudentsCountLoading] = useState()
  const { instructorId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()

  const { sectionOneData } = useSelector((state) => state.performanceData)

  useEffect(() => {
    if (instructorId) {
      setDataToView('instructor')
      const instructor = instructors.find(
        (inst) => inst.id === parseInt(instructorId, 10)
      )
      if (instructor) {
        setSelectedInstructor({
          name: instructor.User.name,
          value: instructor.User.name,
          userId: instructor.User.id,
          id: instructor.id
        })
      }
    }
  }, [instructorId, instructors])

  useEffect(() => {
    setStudentsCountLoading(true)
    let url = ''

    if (selectedInstructor) {
      url = `/my-school/reports/studentsCount/${universityId}/${selectedInstructor.id}`
    } else {
      url = `/my-school/reports/studentsCount/${universityId}`
    }
    const fetchStudentsCount = async () => {
      await axiosInstance.get(url).then(({ data }) => {
        setStudentsCount(data)
        setStudentsCountLoading(false)
      })
    }
    fetchStudentsCount()
  }, [universityId, selectedInstructor])

  useEffect(() => {
    if (dataToView === 'school') {
      setDropdownOptions([
        { name: 'School', value: 'school' },
        { name: 'Instructor', value: 'instructor' }
      ])
    } else {
      setDropdownOptions(
        instructors?.map((instructor) => ({
          name: instructor.User.name,
          value: instructor.User.name,
          userId: instructor.User.id,
          id: instructor.id
        }))
      )
    }
  }, [dataToView, instructors])

  useEffect(() => {
    if (selectedInstructor) {
      dispatch(fetchInstructorSectionOneData(selectedInstructor.userId))
    }
  }, [dispatch, selectedInstructor])

  useEffect(() => {
    if (selectedInstructor) {
      dispatch(fetchInstructorSectionTwoData(selectedInstructor.userId))
      dispatch(fetchInstructorCertificationData(selectedInstructor.userId))
    }
  }, [dispatch, selectedInstructor])

  useEffect(() => {
    dispatch(fetchMasterclassPercentage(''))
    dispatch(fetchPodcastPercentage(''))
    dispatch(fetchQAPercentage(''))
  }, [dispatch])

  useEffect(() => {
    let url = ''

    if (selectedInstructor) {
      url = `/my-school/overview/active-users/${universityId}/${filterProgram}/${selectedInstructor.id}`
    } else {
      url = `/my-school/overview/active-users/${universityId}/${filterProgram}`
    }

    const fetchChartData = async () => {
      setChartLoading(true)
      axiosInstance.get(url).then((res) => {
        if (res.status === 200) {
          setChartData(res.data)
          setChartLoading(false)
        }
      })
    }
    fetchChartData()
  }, [filterProgram, universityId, selectedInstructor])

  useEffect(() => {
    setProgressLoading(true)
    let url = ''

    if (selectedInstructor) {
      url = `/my-school/reports/progress/${universityId}/${selectedInstructor.id}`
    } else {
      url = `/my-school/reports/progress/${universityId}`
    }

    const fetchProgress = async () => {
      await axiosInstance
        .get(url)
        .then((res) => {
          setProgressData(res.data)
          setProgressLoading(false)
        })
        .catch((error) => console.log('error', error))
    }
    fetchProgress()
  }, [universityId, selectedInstructor])

  const handleSchoolFilter = (school) => {
    if (school) {
      setDataToView(school.value)
    } else {
      setDataToView('school')
    }
  }
  const handleInstructorFilter = (instructor) => {
    setSelectedInstructor(instructor)

    if (instructorId) {
      history.push(`/my-school/reports/${instructor.id}`)
    }
  }

  return (
    <div>
      <Row className='justify-content-between'>
        <Col md={`${selectedInstructor ? 5 : 6}`}>
          <CustomDropdown
            title='Select Data to view'
            btnClassName={'gray-border '}
            itemClassName={'datatoview-dropdown'}
            options={dropdownOptions}
            onClick={(item) => {
              dataToView === 'school'
                ? handleSchoolFilter(item)
                : handleInstructorFilter(item)
            }}
            width='300px'
          />
        </Col>
        {selectedInstructor && (
          <Col md='4' className='d-flex justify-content-end align-items-center'>
            <InfoBox
              cn={'pt-2 d-flex justify-content-end align-items-center'}
              style={{
                maxHeight: '40px',
                width: 'auto',
                wordBreak: 'unset',
                fontSize: '12px'
              }}
            >
              <span className='d-flex align-items-center'>
                Instructor time spent on platform:{' '}
                <strong>
                  {(sectionOneData?.userActiveTime ||
                    sectionOneData?.userActiveTime?.length) ??
                    0}
                </strong>
              </span>
            </InfoBox>
          </Col>
        )}
        {(dataToView === 'school' || selectedInstructor) && (
          <Col md='3' className='d-flex justify-content-end'>
            <InfoBox
              cn={'pt-2 pb-2'}
              style={{
                maxHeight: '40px',
                width: '200px',
                alignContent: 'center'
              }}
            >
              <span className='d-flex align-items-center'>
                <span className='dot me-2'></span>
                <span className='on-users-text'> Online Users: </span>
                <span className='on-users-number'>
                  {dataToView === 'instructor'
                    ? (sectionOneData?.activeStudents ||
                        sectionOneData?.activeStudents?.length) ??
                      0
                    : '12'}
                </span>
              </span>
            </InfoBox>
          </Col>
        )}
      </Row>
      {dataToView === 'instructor' ? (
        selectedInstructor ? (
          <InstructorReports
            selectedInstructor={selectedInstructor}
            chartLoading={chartLoading}
            setFilterProgram={setFilterProgram}
            rangeFilter={rangeFilter}
            chartData={chartData}
            progressData={progressData}
            progressLoading={progressLoading}
            studentsCount={studentsCount}
            studentsCountLoading={studentsCountLoading}
          />
        ) : (
          <SelectInstructorView />
        )
      ) : (
        <UniversityReports
          progressLoading={progressLoading}
          chartLoading={chartLoading}
          progressData={progressData}
          chartData={chartData}
          rangeFilter={rangeFilter}
          studentsCount={studentsCount}
          studentsCountLoading={studentsCountLoading}
          setFilterProgram={setFilterProgram}
        />
      )}
    </div>
  )
}

export default Reports
