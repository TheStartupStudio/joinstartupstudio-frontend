import React from 'react'
import './style.css'
import { Col, Row } from 'react-bootstrap'
import Overview from './Overview'

const MySchool = () => {
  return (
    <div className='my-school__container'>
      <Row className='my-school__panel mb-3'>
        <Col className='active'>Overview</Col>
        <Col>Instructors</Col>
        <Col>Learners</Col>
        <Col>Reports</Col>
      </Row>

      <Overview />
    </div>
  )
}

export default MySchool
