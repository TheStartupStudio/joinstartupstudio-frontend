import React, { useEffect, useState } from 'react'
import { CustomDropdown, InfoBox } from '../../ContentItems'
import { Col, Row } from 'react-bootstrap'
import { DisplayCircleData } from '../../../../../pages/MyPerformanceData/Sections/ContentStreamed'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInstructorPodcastPercentage,
  fetchInstructorQAPercentage
} from '../../../../../redux/myPerformanceData/actions'

const ContentStreamed = ({ selectedInstructor }) => {
  const dispatch = useDispatch()
  const myPerformanceData = useSelector((state) => state.performanceData)
  const [podcastPercentage, setPodcastPercentage] = useState(0)
  const [qaPercentage, setQaPercentage] = useState(0)

  useEffect(() => {
    setPodcastPercentage(myPerformanceData.podcastPercentage)
    setQaPercentage(myPerformanceData.qaPercentage)
  }, [
    myPerformanceData.masterclassPercentage,
    myPerformanceData.podcastPercentage,
    myPerformanceData.qaPercentage
  ])

  const handleFilterChange = (value) => {
    if (selectedInstructor) {
      dispatch(
        fetchInstructorPodcastPercentage(value, selectedInstructor.userId)
      )
      dispatch(fetchInstructorQAPercentage(value, selectedInstructor.userId))
    }
  }
  return (
    <InfoBox cn={'mb-3'} style={{ maxHeight: '50%' }}>
      <Row className='m-0 mb-3 justify-content-between align-items-center'>
        <Col>
          <span className='fw-bold'>CONTENT STREAMED</span>
        </Col>
        <Col className='d-flex justify-content-end'>
          <CustomDropdown
            title='Filter by program'
            btnClassName={'instructor'}
            options={[
              { name: 'Filter by', value: '', disabled: true },
              { name: 'Instructor', value: 'instructor' },
              { name: 'LTS1', value: 'LTS1' },
              { name: 'LTS2', value: 'LTS2' },
              { name: 'LTS3', value: 'LTS3' }
            ]}
            onClick={(e) => handleFilterChange(e.value)}
            width='200px'
          />
        </Col>
      </Row>
      <div className='d-flex justify-content-around'>
        <div className={'col-lg-6 col-md-12'}>
          <DisplayCircleData
            backgroundColor={'#99cc33'}
            title={'Q&As'}
            percentage={
              typeof qaPercentage !== 'string'
                ? !isNaN(qaPercentage)
                  ? +qaPercentage.toFixed(2)
                  : 0
                : qaPercentage
            }
            loading={myPerformanceData.qaLoading}
            height={130}
            width={130}
            fontSize={'14px'}
          />
        </div>

        <div className={'col-lg-6 col-md-12'}>
          <DisplayCircleData
            backgroundColor={'#ff3399'}
            title={'Story in Motion Episodes'}
            percentage={
              typeof podcastPercentage !== 'string'
                ? !isNaN(podcastPercentage)
                  ? +podcastPercentage.toFixed(2)
                  : 0
                : podcastPercentage
            }
            loading={myPerformanceData.podcastLoading}
            height={130}
            width={130}
            fontSize={'14px'}
          />
        </div>
      </div>
    </InfoBox>
  )
}

export default ContentStreamed
