import React, {useEffect} from 'react'
import { Container, Row } from 'react-bootstrap'
import './style.css'
import SectionOne from './Sections/SectionOne'
import SectionTwo from './Sections/SectionTwo'
import SectionThree from './Sections/SectionThree'
import { useDispatch } from 'react-redux'
import { changeSidebarState } from '../../redux'

function MyPerformanceData({ instructorId }) {
    const dispatch = useDispatch()
  
    useEffect(() => {
          dispatch(changeSidebarState(false))
    })
        
  return (
    <Container fluid>
      <Row className={'g-2'}>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2 pb-4">
              <div className="col-md-12 d-flex align-items-center ">
                <h3 className="page-title mb-0">My PERFORMANCE DATA</h3>
              </div>
              <div className="col-md-12 d-flex align-items-center ">
                <p className="page-description">
                  Welcome to the Performance Data page of your platform. Here
                  you will access graphs and tables that demonstrate how you and
                  your students are using the platform.
                </p>
              </div>
            </div>
            <div
              className="row ps-2 pb-4"
              style={{ backgroundColor: '#f8f7f7', minHeight: 200 }}
            >
              <SectionOne instructorId={instructorId} />
              <SectionTwo instructorId={instructorId} />
              <SectionThree instructorId={instructorId} />
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MyPerformanceData
