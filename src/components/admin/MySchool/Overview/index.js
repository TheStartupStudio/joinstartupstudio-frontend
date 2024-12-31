import React, { useCallback, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import DefaultImage from '../../../../assets/images/profile-image.png'
import axiosInstance from '../../../../utils/AxiosInstance'
import LoadingAnimation from '../../../../ui/loadingAnimation'
import ProgramDetails from './ProgramDetails'
import SchoolDetails from './SchoolDetails'
import ActiveUsers from './ActiveUsers'
import RecentActivity from './RecentActivity'
import CoursesAndCredentials from './CoursesAndCredentials'
import LtsImmersion from './LtsImmersion'

export const ItemProfileDetails = ({ img, title, className }) => {
  return (
    <Col md='6' sm='12'>
      <div className={` ${className} item-profile__details`}>
        <div className='item-img-myschool'>
          <img src={img || DefaultImage} alt='' />
        </div>
        <p className='p-0 m-0'>{title}</p>
      </div>
    </Col>
  )
}

const Overview = ({ universityId, programs }) => {
  const [loading, setLoading] = useState(true)
  const [schoolDetails, setSchoolDetails] = useState({})

  useEffect(() => {
    let isMounted = true

    const timeoutId = setTimeout(() => {
      if (isMounted) setLoading(false)
    }, 1500)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  const fetchSchoolDetails = useCallback(async () => {
    let isMounted = true

    try {
      const { data } = await axiosInstance.get('/my-school/overview')
      if (isMounted) setSchoolDetails(data)
    } catch (error) {
      console.error('Error fetching school details:', error)
    }

    return () => {
      isMounted = false
    }
  }, [])

  const refreshData = useCallback(() => {
    fetchSchoolDetails()
  }, [fetchSchoolDetails])

  useEffect(() => {
    fetchSchoolDetails()
  }, [fetchSchoolDetails])

  return (
    <>
      {loading ? (
        <LoadingAnimation show={true} />
      ) : (
        <>
          <Row className='overview-school-program-info py-2'>
            <Col md='4'>
              <SchoolDetails
                schoolDetails={schoolDetails}
                universityId={universityId}
                onSuccess={refreshData}
              />
            </Col>
            <Col md='4'>
              <ProgramDetails
                programs={programs}
                schoolDetails={schoolDetails}
                universityId={universityId}
                onSuccess={refreshData}
              />
            </Col>
            <Col md='4' className='h-100'>
              <ActiveUsers universityId={universityId} />
            </Col>
          </Row>
          <Col className='py-2'>
            <LtsImmersion />
          </Col>
          <Row className='recact-courses-row py-3'>
            <Col md='5'>
              <RecentActivity />
            </Col>

            <Col md='7'>
              <CoursesAndCredentials />
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default Overview
