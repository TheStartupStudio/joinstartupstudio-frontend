import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import StudentsSlider from '../Slider/studentsSlider'

export const ActiveStudents = () => {
  const [activeStudents, setActiveStudents] = useState([])
  const [width, setWidth] = useState(window.innerWidth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActiveStudents()
  }, [])

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  const getActiveStudents = async () => {
    await axiosInstance
      .get('/instructor/active-students')
      .then((res) => {
        if (res.data.users.length) setActiveStudents(res.data.users)
        setLoading(false)
      })
      .catch((e) => e)
  }

  return activeStudents.length === 0 ? (
    <>
      {!loading ? (
        <p className='page-description'>
          You don’t have any active students yet!
        </p>
      ) : null}
    </>
  ) : (
    <StudentsSlider width={width} data={activeStudents} />
  )
}
