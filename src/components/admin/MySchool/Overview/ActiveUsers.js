import React, { useEffect, useState } from 'react'
import { InfoBox } from '../ContentItems'
import CustomSpinner from '../../../CustomSpinner'
import { Col, Dropdown, Row } from 'react-bootstrap'
import { LineChart } from '../../../Charts/BarChartJs'
import axiosInstance from '../../../../utils/AxiosInstance'

const ActiveUsers = ({ universityId }) => {
  const [rangeFilter, setRangeFilter] = useState({
    value: 'last30Days',
    label: 'Last 30 Days'
  })
  const [chartLoading, setChartLoading] = useState(false)
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true)
      axiosInstance
        .get(
          `/my-school/overview/active-users/${universityId}?ranges=last30Days,last7Days,1Day`
        )
        .then((res) => {
          if (res.status === 200) {
            setChartData(res.data)
            setChartLoading(false)
          }
        })
    }
    fetchChartData()
  }, [universityId])

  return (
    <InfoBox style={{ minHeight: '330px' }}>
      {chartLoading ? (
        <div
          style={{ height: '300px' }}
          className='d-flex align-items-center justify-content-center'
        >
          <CustomSpinner />
        </div>
      ) : (
        <div className='border'>
          <Row>
            <Col md='10' className='pe-0'>
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
                    pointHoverRadius: 10
                  }
                ]}
              />
            </Col>
            <Col
              className='d-flex  align-items-center ps-1 m-0 w-100'
              style={{ fontSize: '10px' }}
            >
              <Col>
                <div
                  className='d-flex flex-column justify-content-center my-2 '
                  style={{ wordBreak: 'keep-all' }}
                >
                  <div className='d-flex align-items-center'>
                    {/* <span className='dot__transfer__requested me-1'></span> */}
                    <div>30 Days</div>
                    <br />
                  </div>

                  <p
                    className='p-0 m-0 text-center fw-bold'
                    style={{ fontSize: '14px' }}
                  >
                    {chartData.last30Days?.totalUserCount}
                  </p>
                </div>
                <div
                  className='d-flex flex-column justify-content-center my-2'
                  style={{ wordBreak: 'keep-all' }}
                >
                  <div className='d-flex align-items-center'>
                    {/* <span className='dot__transfer__requested me-1'></span> */}
                    <div>7 Days</div>
                    <br />
                  </div>

                  <p
                    className='p-0 m-0 text-center fw-bold'
                    style={{ fontSize: '14px' }}
                  >
                    {chartData.last7Days?.totalUserCount}
                  </p>
                </div>
                <div
                  className='d-flex flex-column justify-content-center my-2'
                  style={{ wordBreak: 'keep-all' }}
                >
                  <div className='d-flex align-items-center'>
                    {/* <span className='dot__transfer__requested me-1'></span> */}
                    <div>1 Days</div>
                    <br />
                  </div>

                  <p
                    className='p-0 m-0 text-center fw-bold'
                    style={{ fontSize: '14px' }}
                  >
                    {chartData['1Day']?.totalUserCount}
                  </p>
                </div>
              </Col>
            </Col>
          </Row>

          <hr className='m-1' />
          <Col md='5'>
            <Dropdown>
              <Dropdown.Toggle
                variant='success'
                className='bg-transparent'
                style={{ color: '#000', fontSize: '12px' }}
                id='dropdown-basic'
              >
                {rangeFilter.label}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    setRangeFilter({
                      value: 'last30Days',
                      label: 'Last 30 Days'
                    })
                  }
                >
                  Last 30 days
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setRangeFilter({
                      value: 'last7Days',
                      label: 'Last 7 Days'
                    })
                  }
                >
                  Last 7 days
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setRangeFilter({
                      value: '1Day',
                      label: '1 Day'
                    })
                  }
                >
                  1 day
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </div>
      )}
    </InfoBox>
  )
}

export default ActiveUsers
