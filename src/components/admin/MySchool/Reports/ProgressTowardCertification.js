import React from 'react'
import {
  CircularProgressComponent,
  CountTotalReport,
  InfoBox
} from '../ContentItems'
import { Row } from 'react-bootstrap'
import CustomSpinner from '../../../CustomSpinner'

const ProgressTowardCertification = ({
  progressData,
  progressLoading,
  studentsCount,
  studentsCountLoading
}) => {
  return (
    <InfoBox cn='my-3'>
      <Row className=' justify-content-around test'>
        {studentsCountLoading
          ? Array(8)
              .fill()
              .map((_, idx) => <CountTotalReport key={idx} loading={true} />)
          : studentsCount?.yearLevelResults?.map((item, idx) => (
              <CountTotalReport
                key={idx}
                title={item.value + ' Students'}
                totalCount={item.totalCount}
                iconIdentifier={'studying'}
                loading={false}
              />
            ))}

        {studentsCountLoading
          ? Array(1)
              .fill()
              .map((_, idx) => <CountTotalReport key={idx} loading={true} />)
          : studentsCount?.certificationResults?.map((item, idx) => (
              <CountTotalReport
                key={idx}
                title={item.value}
                totalCount={item.totalCount}
                iconIdentifier={'award'}
                loading={false}
              />
            ))}
      </Row>
      <Row className='m-0 py-5 justify-content-around'>
        {progressLoading ? (
          <div
            style={{ height: '300px' }}
            className='d-flex align-items-center justify-content-center'
          >
            <CustomSpinner />
          </div>
        ) : (
          progressData?.map((progress) => (
            <CircularProgressComponent
              percentage={progress.percentage.toFixed(0)}
              year={progress.year}
            />
          ))
        )}
      </Row>
    </InfoBox>
  )
}

export default ProgressTowardCertification
