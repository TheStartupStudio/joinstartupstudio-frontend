import React from 'react'
import { Col, Row } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
  Redirect,
  useParams
} from 'react-router-dom'
import Overview from './Overview'
import Instructors from './Instructors'
import Learners from './Learners'
import Reports from './Reports'

const pages = {
  overview: Overview,
  instructors: Instructors,
  learners: Learners,
  reports: Reports
}

const Page = ({
  programs,
  levels,
  instructors,
  periods,
  universityId,
  universities
}) => {
  const { page } = useParams()

  const Component = pages[page] || Overview
  return (
    <Component
      programs={programs}
      levels={levels}
      instructors={instructors}
      periods={periods}
      universityId={universityId}
      universities={universities}
    />
  )
}

const MySchoolRouter = ({
  programs,
  levels,
  instructors,
  periods,
  universityId,
  universities
}) => {
  return (
    <Router>
      <div className='my-school__container'>
        <Row className='my-school__panel mb-3 m-0'>
          <Col>
            <NavLink
              to='/my-school/overview'
              activeClassName='active'
              className={'schoolpanel-nav-title'}
            >
              Overview
            </NavLink>
          </Col>
          <Col>
            <NavLink
              to='/my-school/instructors'
              activeClassName='active'
              className={'schoolpanel-nav-title'}
            >
              Instructors
            </NavLink>
          </Col>
          <Col>
            <NavLink
              to='/my-school/learners'
              activeClassName='active'
              className={'schoolpanel-nav-title'}
            >
              Learners
            </NavLink>
          </Col>
          <Col>
            <NavLink
              to='/my-school/reports'
              activeClassName='active'
              className={'schoolpanel-nav-title'}
            >
              Reports
            </NavLink>
          </Col>
        </Row>

        <Switch>
          <Route
            path='/my-school/:page/:instructorId?'
            render={() => (
              <Page
                programs={programs}
                levels={levels}
                instructors={instructors}
                periods={periods}
                universityId={universityId}
                universities={universities}
              />
            )}
          />
          <Redirect exact from='/my-school' to='/my-school/overview' />
        </Switch>
      </div>
    </Router>
  )
}

export default MySchoolRouter
