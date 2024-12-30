import React, { useEffect, useState } from 'react'
import './style.css'
import MySchoolRouter from './MySchoolRouter'
import axiosInstance from '../../../utils/AxiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import { getPeriodsStart } from '../../../redux/dashboard/Actions'
import LoadingAnimation from '../../../ui/loadingAnimation'

const levelDescriptions = {
  HS: 'High School',
  MS: 'Middle School',
  LS: 'Lower School',
  HE: 'Higher Education'
}

const MySchool = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [programs, setPrograms] = useState([])
  const [levels, setLevels] = useState([])
  const [instructors, setInstructors] = useState([])
  const [universities, setUniversities] = useState([])
  const { universityId } = useSelector((state) => state.user.user.user)
  const periods = useSelector((state) => state.dashboard.periods)

  useEffect(() => {
    dispatch(getPeriodsStart())
  }, [dispatch])

  useEffect(() => {
    setLoading(true)
    const fetchUniversities = async () => {
      await axiosInstance.get('/universities').then((res) => {
        setUniversities(res.data.universities)
        setLoading(false)
      })
    }
    fetchUniversities()
  }, [])

  useEffect(() => {
    const fetchPrograms = async () => {
      await axiosInstance.get('/programs').then(({ data }) => setPrograms(data))
    }
    fetchPrograms()
  }, [])

  useEffect(() => {
    const fetchLevels = async () => {
      await axiosInstance.get('/levels').then(({ data }) => setLevels(data))
    }
    fetchLevels()
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchInstructors = async () => {
      try {
        const { data } = await axiosInstance.get('/users/instructors')

        const formattedData = data.instructors.filter(
          (instructor) => instructor.User !== null
        )

        setInstructors(formattedData)

        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchInstructors()
  }, [])

  return (
    <div>
      {loading ? (
        <LoadingAnimation show={true} />
      ) : (
        <MySchoolRouter
          programs={programs}
          levels={levels}
          instructors={instructors}
          periods={periods}
          universityId={universityId}
          universities={universities}
          levelDescriptions={levelDescriptions}
        />
      )}
    </div>
  )
}

export default MySchool
