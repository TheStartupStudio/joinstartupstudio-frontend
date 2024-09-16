import React, { useEffect, useState } from 'react'
import { CustomDropdown, InfoBox } from '../../ContentItems'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInstructorDebriefDataWithId } from '../../../../../redux/myPerformanceData/actions'
import { ProgressBar } from '../../../../../pages/MyPerformanceData/MyPerformanceDataComponents'

const CompletionProgress = ({ handleProgressValue, selectedInstructor }) => {
  const dispatch = useDispatch()
  const [curriculumCompletion, setCurriculumCompletion] = useState('')
  const { instructorDebriefData, instructorDebriefLoading } = useSelector(
    (state) => state.performanceData
  )

  const handleCurriculumCompletionChange = (e) => {
    setCurriculumCompletion(e.value)
  }

  useEffect(() => {
    if (selectedInstructor) {
      dispatch(
        fetchInstructorDebriefDataWithId(
          curriculumCompletion,
          selectedInstructor.userId
        )
      )
    }
  }, [dispatch, curriculumCompletion, selectedInstructor])

  return (
    <InfoBox cn={'mb-3 '} style={{ minHeight: '50%' }}>
      <Row className='m-0 mb-3 justify-content-between align-items-center'>
        <Col>
          <span className='fw-bold'>COMPLETION PROGRESS</span>
        </Col>
        <Col className='d-flex justify-content-end'>
          <CustomDropdown
            title='Filter by program'
            btnClassName={'gray-border'}
            options={[
              {
                name: 'Curriculum Completion',
                value: '',
                disabled: true
              },
              { name: 'LTS1', value: 'lts1' },
              { name: 'LTS2', value: 'lts2' },
              { name: 'LTS3&4', value: 'lts3&4' }
            ]}
            onClick={(e) => handleCurriculumCompletionChange(e)}
            width='200px'
          />
        </Col>
      </Row>
      <Col>
        <Row className='m-0 py-2 align-items-center'>
          <Col>
            <small>News briefings conducted</small>
          </Col>
          <Col>
            <ProgressBar
              progress={handleProgressValue(
                instructorDebriefData?.news_briefing
              )}
              loading={instructorDebriefLoading}
              withDot={false}
              progressHeight={25}
            />
          </Col>
        </Row>
        <Row className='m-0 py-2 align-items-center'>
          <Col>
            <small>Student voice opportunity</small>
          </Col>
          <Col>
            <ProgressBar
              progress={handleProgressValue(
                instructorDebriefData?.student_voice
              )}
              loading={instructorDebriefLoading}
              withDot={false}
              progressHeight={25}
            />
          </Col>
        </Row>
        <Row className='m-0 py-2 align-items-center'>
          <Col>
            <small>Journal/Portfolio Work Time</small>
          </Col>
          <Col>
            <ProgressBar
              progress={handleProgressValue(
                instructorDebriefData?.time_for_portfolio
              )}
              loading={instructorDebriefLoading}
              withDot={false}
              progressHeight={25}
            />
          </Col>
        </Row>
      </Col>
    </InfoBox>
  )
}

export default CompletionProgress
