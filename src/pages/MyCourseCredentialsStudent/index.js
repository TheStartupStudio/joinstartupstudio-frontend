import React, { useState, useEffect, useCallback } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './styles.css'

const CoursesSection = () => {
  const [rowData, setRowData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null) // Selected course for modal
  const [isModalVisible, setModalVisible] = useState(false) // Modal visibility state
  const [page, setPage] = useState(1) // Current page
  const pageSize = 6 // Number of cards per page

  const fetchCourses = useCallback(() => {
    setLoading(true)
    const url = '/coursesandcredentials/get-courses-credentials'

    axiosInstance
      .get(url)
      .then(({ data }) => {
        setRowData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching courses:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const openModal = (course) => {
    setSelectedCourse(course)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedCourse(null)
  }

  const totalItems = rowData.length
  const totalPages = Math.ceil(totalItems / pageSize)

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  const paginatedData = rowData.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className='courses-section'>
      <h2 style={{ textAlign: 'left' }}>COURSES & CREDENTIALS</h2>
      <p style={{ textAlign: 'left', marginBottom: '10px' }}>
        Find external courses to earn certifications and micro-credentials to
        add to your industry alignment and value.
      </p>
      <div className='courses-grid'>
        {paginatedData.map((course) => (
          <div key={course.id} className='course-card'>
            <img
              src={course.image_preview || 'default-image.png'}
              alt={course.name_course_credential}
            />
            <h3 style={{ textAlign: 'left' }}>
              {course.name_course_credential}
            </h3>
            <button
              style={{
                background: 'white',
                textAlign: 'left',
                color: '#72c0da'
              }}
              className='learn-more'
              onClick={() => openModal(course)}
            >
              Learn More
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}

      <Modal
        isVisible={isModalVisible}
        onClose={closeModal}
        course={selectedCourse}
      />

      <div className='pagination'>
        <div
          style={{ marginRight: '5px' }}
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <span>
          {page} of {totalPages}
        </span>
        <div
          style={{ marginLeft: '5px' }}
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    </div>
  )
}

const Modal = ({ isVisible, onClose, course }) => {
  if (!isVisible || !course) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div
        className='modal-container'
        style={{ textAlign: 'left' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className='close-button' onClick={onClose}>
          ×
        </button>

        <h2>{course.name_course_credential}</h2>
        <p>
          <strong>By:</strong> {course.name_course_credential_provider}
        </p>
        <p>{course.course_credential_description}</p>

        <div style={{ display: 'flex' }}>
          <p>
            <strong>Rating:</strong> {course.course_rating} ⭐ (
            {course.number_reviews} reviews)
          </p>

          <p>{course.total_completion_time} hours to complete</p>

          <p>
            <strong>Schedule:</strong> {course.schedule_type || 'N/A'}
          </p>
        </div>
        <p>
          <strong>Skills You’ll Gain:</strong> {course.skills_developed}
        </p>

        <a
          href={
            course.url_link.startsWith('http')
              ? course.url_link
              : `https://${course.url_link}`
          }
          target='_blank'
          rel='noopener noreferrer'
          className='go-to-course'
        >
          Go to Course
        </a>
      </div>
    </div>
  )
}

export default CoursesSection
