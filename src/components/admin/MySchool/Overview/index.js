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

export const ItemProfileDetails = ({ img, title }) => {
  return (
    <Col md='6' sm='12'>
      <div className='item-profile__details'>
        <img src={img || DefaultImage} alt='' />
        <p className='p-0 m-0'>{title}</p>
      </div>
    </Col>
  )
}

const Overview = ({ universityId, programs }) => {
  const [loading, setLoading] = useState(true)
  const [schoolDetails, setSchoolDetails] = useState({})

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  const fetchSchoolDetails = useCallback(async () => {
    axiosInstance.get('/my-school/overview').then(({ data }) => {
      setSchoolDetails(data)
    })
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
          <Row className='overview-school-program-info py-3'>
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
          <Col className='py-3'>
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
