import React from 'react'
import { Col, Row } from 'react-bootstrap'
import './style.css'

const QuickFactRow = ({ article, value }) => {
  return (
    <Row className="quick-facts_content">
      <span className="article">{article}</span>
      <span className="value">{value}</span>
    </Row>
  )
}

const DetailsRow = ({ title, text }) => {
  return (
    <Col className="details-row">
      <p className="title"> {title} </p>
      <p className="">{text}</p>
    </Col>
  )
}

const OccupationJobDetails = ({ occupationJob, occupationJobLoading }) => {
  return (
    <Col className="occupation-job-details">
      <h5>SUMMARY</h5>
      <Col className="quick-facts_header bg-info">
        <p className="p-0 m-0">Quick facts: {occupationJob?.name}</p>
      </Col>
      {occupationJob?.quick_facts?.map((fact) => {
        return <QuickFactRow article={fact.title} value={fact.text} />
      })}
      {occupationJob?.details?.map((detail) => (
        <DetailsRow title={detail.title} text={detail.text} />
      ))}
    </Col>
  )
}

export default OccupationJobDetails
