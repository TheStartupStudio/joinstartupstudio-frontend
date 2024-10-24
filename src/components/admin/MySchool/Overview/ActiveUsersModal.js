import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Col, Dropdown, Modal, Row } from 'react-bootstrap'
import { LineChart } from '../../../Charts/BarChartJs'

const ActiveUsersModal = ({
  show,
  onHide,
  rangeFilter,
  chartData,
  setRangeFilter
}) => {
  return (
    <Modal
      show={show}
      className={''}
      onHide={() => {
        onHide()
      }}
      centered
    >
      <Modal.Header className='position-relative p-3'>
        <Modal.Title
          className='px-3 py-3 d-flex fw-normal flex-column'
          style={{ fontSize: '16px' }}
        >
          Active Users
        </Modal.Title>
        <div className={`check-button fw-bold`} onClick={() => onHide()}>
          X
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Col>
            <Col md='12' className='pe-0'>
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
            <div
              className='w-100 d-flex justify-content-around align-items-center ps-1 m-0'
              style={{ fontSize: '12px' }}
            >
              <div className='justify-content-center my-2 '>
                <div className='d-flex align-items-center'>
                  <span className='dot__transfer__requested me-1'></span>
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
              <div className='justify-content-center my-2'>
                <div className='d-flex align-items-center'>
                  <span className='dot__transfer__requested me-1'></span>
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
              <div className=' justify-content-center my-2'>
                <div className='d-flex align-items-center'>
                  <span className='dot__transfer__requested me-1'></span>
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
              {/* </div> */}
            </div>
          </Col>

          <hr className='m-1' />
          <Row md='5'>
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
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ActiveUsersModal
