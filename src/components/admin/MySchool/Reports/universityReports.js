import React from 'react'
import {
  CircularProgressComponent,
  CountTotalReport,
  CustomDropdown,
  InfoBox
} from '../ContentItems'
import { Col, Row } from 'react-bootstrap'
import CustomSpinner from '../../../CustomSpinner'
import { LineChart } from '../../../Charts/BarChartJs'

const UniversityReports = ({
  chartLoading,
  rangeFilter,
  progressLoading,
  progressData,
  chartData,
  studentsCount,
  studentsCountLoading,
  setFilterProgram
}) => {
  return (
    <>
      <InfoBox cn='my-3' style={{ maxHeight: '350px' }}>
        <Row className='justify-content-between align-items-center'>
          <Col md='6'>
            <span class='me-2'>Active Users</span>
          </Col>
          <Col md='6' className='d-flex justify-content-end'>
            <CustomDropdown
              title='Filter by program'
              btnClassName={'gray-border'}
              options={[
                { name: 'Market-Ready (LTS1)', value: 'LTS1' },
                { name: 'Market-Ready (LTS2)', value: 'LTS2' },
                { name: 'Market-Ready (LTS3)', value: 'LTS3' },
                { name: 'Market-Ready (LTS4)', value: 'LTS4' }
              ]}
              onClick={(school) => setFilterProgram(school.value)}
              width='250px'
            />
          </Col>
        </Row>

        <Col md='12' style={{ minHeight: '330px' }}>
          {chartLoading ? (
            <div
              style={{ height: '300px' }}
              className='d-flex align-items-center justify-content-center'
            >
              <CustomSpinner />
            </div>
          ) : (
            <LineChart
              rangeFilter={rangeFilter}
              datasets={[
                {
                  label: rangeFilter.label,
                  data:
                    chartData && chartData[rangeFilter?.value]
                      ? chartData[rangeFilter?.value].dailyCounts
                      : [],
                  fill: false,
                  backgroundColor: 'rgba(45,192,192,0.2)',
                  borderColor: '#52c7de',
                  tension: 0.1,
                  pointRadius: 5,
                  pointHoverRadius: 10
                }
              ]}
            />
          )}
        </Col>
      </InfoBox>

      <InfoBox cn='my-3'>
        <Row className=' justify-content-around'>
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
                loading={progressLoading}
              />
            ))
          )}
        </Row>

        <Col className='col-12 d-flex justify-content-end'>
          <Row className='col-2 m-0 justify-content-around'>
            {studentsCountLoading
              ? Array(2)
                  .fill()
                  .map((_, idx) => (
                    <CountTotalReport key={idx} loading={true} />
                  ))
              : studentsCount?.instructorSpecialistResults?.map((item) => (
                  <CountTotalReport
                    title={item.value}
                    totalCount={item.totalCount}
                    iconIdentifier={'studying'}
                  />
                ))}
          </Row>
        </Col>
      </InfoBox>
    </>
  )
}

export default UniversityReports
