import React from 'react'
import { CustomDropdown, InfoBox } from '../ContentItems'
import { Col, Row } from 'react-bootstrap'
import CustomSpinner from '../../../CustomSpinner'
import { LineChart } from '../../../Charts/BarChartJs'

const ActiveUsers = ({
  setFilterProgram,
  chartLoading,
  rangeFilter,
  chartData
}) => {
  return (
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
          <>
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
                  tension: 0.1
                }
              ]}
              numberOfIntervals={4}
            />
          </>
        )}
      </Col>
    </InfoBox>
  )
}

export default ActiveUsers
