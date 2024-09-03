import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import {
  fetchInstructorCertificationData,
  fetchInstructorSectionTwoData
} from '../../../../../redux/myPerformanceData/actions'
import Certification from './Certification'
import ContentStreamed from './ContentStreamed'
import CompletionProgress from './CompletionProgress'

const SectionTwo = ({ handleProgressValue, selectedInstructor }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedInstructor) {
      dispatch(fetchInstructorSectionTwoData(selectedInstructor.userId))
      dispatch(fetchInstructorCertificationData(selectedInstructor.userId))
    }
  }, [dispatch, selectedInstructor])

  return (
    <Row className='m-0 my-3'>
      <Certification selectedInstructor={selectedInstructor} />
      <Col className='pe-0 ps-4'>
        <ContentStreamed selectedInstructor={selectedInstructor} />
        <CompletionProgress
          selectedInstructor={selectedInstructor}
          handleProgressValue={handleProgressValue}
        />
      </Col>
    </Row>
  )
}

export default SectionTwo
