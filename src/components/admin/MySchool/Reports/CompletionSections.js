import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { InfoBox } from '../ContentItems'
import { ProgressCard } from '../../../../pages/MyPerformanceData/MyPerformanceDataComponents'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInstructorCertificationData,
  fetchInstructorSectionTwoData
} from '../../../../redux/myPerformanceData/actions'

const CompletionSections = ({ handleProgressValue, selectedInstructor }) => {
  const dispatch = useDispatch()

  const { sectionTwoData, sectionTwoLoading } = useSelector(
    (state) => state.performanceData
  )

  useEffect(() => {
    if (selectedInstructor) {
      dispatch(fetchInstructorSectionTwoData(selectedInstructor.userId))
      dispatch(fetchInstructorCertificationData(selectedInstructor.userId))
    }
  }, [dispatch, selectedInstructor])

  return (
    <Row className='m-0 p-0'>
      <Col md='3' className='ps-0'>
        <InfoBox cn={'p-0'} style={{ minHeight: '175px' }}>
          <ProgressCard
            progress={handleProgressValue(sectionTwoData?.trainingCompletion)}
            title={'Training completion'}
            loading={sectionTwoLoading}
            withDot={false}
          />
        </InfoBox>
      </Col>
      <Col md='3'>
        <InfoBox cn={'p-0'} style={{ minHeight: '175px' }}>
          <ProgressCard
            progress={handleProgressValue(
              sectionTwoData?.instructorNotesCompletion
            )}
            title={'Instructor notes'}
            loading={sectionTwoLoading}
            withDot={false}
          />
        </InfoBox>
      </Col>
      <Col md='3'>
        <InfoBox cn={'p-0'} style={{ minHeight: '175px' }}>
          <ProgressCard
            progress={handleProgressValue(sectionTwoData?.trainingCompletion)}
            title={'Feedback given'}
            loading={sectionTwoLoading}
            withDot={false}
          />
        </InfoBox>
      </Col>
      <Col md='3' className='pe-0'>
        <InfoBox cn='p-0' style={{ maxHeight: '175px' }}>
          <ProgressCard
            progress={handleProgressValue(
              sectionTwoData?.instructorNotesCompletion
            )}
            title={'Student portfolios received'}
            loading={sectionTwoLoading}
            withDot={false}
          />
        </InfoBox>
      </Col>
    </Row>
  )
}

export default CompletionSections
