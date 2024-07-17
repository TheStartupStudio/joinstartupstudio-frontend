import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { DetailsInfoBox, InfoBox } from './ContentItems'
import DefaultImage from '../../../assets/images/profile-image.png'

const SkillBox = ({ color, text }) => {
  return (
    <span
      className='border'
      style={{
        borderRadius: '20px',
        minHeight: '30px',
        width: 'auto',
        margin: '.5rem .5rem'
      }}
    >
      {text}
    </span>
  )
}

const Overview = () => {
  return (
    <>
      <Row className='py-3'>
        <Col md='4'>
          <InfoBox isEditable>
            <Row className='justify-content-center align-items-center'>
              <Col md='6' sm='12'>
                <Row className='item-profile__details '>
                  <img src={DefaultImage} alt='' />
                  <p className='p-0 m-0'>School Details</p>
                </Row>
              </Col>
              <Col md='6' sm='12'>
                <Row className='align-items-center'>
                  <div
                    style={{
                      height: '10px',
                      width: '1px',
                      borderRadius: '50%',
                      background: 'green'
                    }}
                  ></div>
                  Active
                </Row>
              </Col>
            </Row>
            <Col>
              <DetailsInfoBox>
                <label htmlFor='schoolName'>School Name</label>
                <p className='p-0 m-0'>North Broward Preparatory School</p>
              </DetailsInfoBox>
              <DetailsInfoBox>
                <label htmlFor='schoolName'>School Name</label>
                <p className='p-0 m-0'>North Broward Preparatory School</p>
              </DetailsInfoBox>
              <DetailsInfoBox>
                <label htmlFor='schoolName'>School Name</label>
                <p className='p-0 m-0'>North Broward Preparatory School</p>
              </DetailsInfoBox>
            </Col>
          </InfoBox>
        </Col>
        <Col md='4'>
          <InfoBox isEditable>
            <Col className='justify-content-center align-items-center item-profile__details'>
              <Row className='item-profile__details '>
                <img src={DefaultImage} alt='' />
                <p className='p-0 m-0'>School Details</p>
              </Row>
            </Col>
            <Col>
              <label htmlFor=''>Number of Instructors</label>
              <p className='p-0 m-0'>6</p>
            </Col>
            <Col>
              <label htmlFor=''>Programs Implemented</label>
              <Row>
                <SkillBox color={'#asdasd'} text={'Community-Ready'} />
                <SkillBox color={'#asdasd'} text={'Community-Ready'} />
                <SkillBox color={'#asdasd'} text={'Community-Ready'} />
              </Row>
            </Col>
          </InfoBox>
        </Col>
        <Col md='4'>
          <InfoBox>test</InfoBox>
        </Col>
      </Row>
      <Col className='py-3'>
        <InfoBox>LTS IMMERSION </InfoBox>
      </Col>
      <Row className='py-3'>
        <Col md='5'>
          <InfoBox>Recent Activity </InfoBox>
        </Col>

        <Col md='7'>
          <InfoBox>Courses & Credentials </InfoBox>
        </Col>
      </Row>
    </>
  )
}

export default Overview
