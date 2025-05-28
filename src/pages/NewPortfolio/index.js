import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Portfolio.css'
import whoami from '../../assets/images/whoami.png'
import WhoAmI from './whoami'
import WhatCanIDo from './whatcanido'
import HowDoIProveIt from './howdoiproveit'

import {
  getMyCompetitiveness,
  getMyCredentials,
  getMyEducations,
  getMyFailures,
  getMyImmersions,
  getMyMentors,
  getMyRelationships,
  getMyWorkExperiences,
  getSharingSettings,
  getUserBasicInfo,
  getUserStory,
  getMyProjectsAPI,
  getProjects
} from '../../redux/portfolio/Actions'
import Start from './start'
import StartProd from './startProd'
import StartCompetitiveness from './startcompetitiveness'

const Portfolio = (props) => {
  const dispatch = useDispatch()
  const [activeSection, setActiveSection] = useState('who-am-i')
  const [refreshData, setRefreshData] = useState(false)

  useEffect(() => {
    // Dispatch all the actions when the component mounts
    dispatch(getUserBasicInfo())
    dispatch(getUserStory())
    dispatch(getMyWorkExperiences())
    dispatch(getMyEducations())
    dispatch(getMyCredentials())
    dispatch(getMyCompetitiveness())
    dispatch(getMyImmersions())
    dispatch(getMyRelationships())
    dispatch(getMyMentors())
    dispatch(getMyFailures())
    dispatch(getSharingSettings())
    dispatch(getProjects()), dispatch(getMyEducations())
  }, [dispatch, refreshData]) // The effect will only run when dispatch changes

  const { userBasicInfo } = useSelector((state) => state.portfolio.whoSection)
  const { myRelationships } = useSelector((state) => state.portfolio.whoSection)
  const { myFailures } = useSelector((state) => state.portfolio.whoSection)
  const { myMentors } = useSelector((state) => state.portfolio.whoSection)
  const { myProjects } = useSelector((state) => state.portfolio.whatSection)
  const { myAlignments } = useSelector((state) => state.portfolio.howSection)
  const { myProductivity } = useSelector((state) => state.portfolio.howSection)

  const { educations } = myAlignments
  const { workExperiences } = myProductivity

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'who-am-i':
        return (
          <WhoAmI
            sectionTitle={'WHO AM I?'}
            sectionDescription={
              'LTS participants communicate the value they have produced in themselves through Story, Relationship, Mentorship and Failure'
            }
            userBasicInfo={userBasicInfo?.data}
            myRelationships={myRelationships?.data}
            myFailures={myFailures?.data}
            myMentors={myMentors?.data}
          />
        )
      case 'what-can-i-do':
        return (
          <WhatCanIDo
            sectionTitle={'WHAT CAN I DO?'}
            sectionDescription={
              'LTS participants communicate the value they have produced in themselves through the outcomes of Learn, Develop and Brand'
            }
            myProjects={myProjects}
            setRefreshData={setRefreshData}
          />
        )
      case 'how-do-i-prove-it':
        return (
          <HowDoIProveIt
            sectionTitle={'HOW DO I PROVE IT?'}
            sectionDescription={
              'LTS participants communicate the value they have produced in themselves through the outcomes of Alignment, Productivity, and Competitiveness. '
            }
            educations={educations?.data}
            workExprience={workExperiences?.data}
          />
        )
      case 'start':
        return (
          <Start
            sectionTitle={'START:ALIGNMENT'}
            sectionDescription={
              'My ability to prove the quality of my outcomes through the test metrics of alignment, productivity, and competitiveness.'
            }
          />
        )
      default:
        return (
          <WhoAmI
            sectionTitle={'WHO AM I?'}
            sectionDescription={
              'LTS participants communicate the value they have produced in themselves through Story, Relationship, Mentorship and Failure'
            }
            userBasicInfo={userBasicInfo?.data}
            myRelationships={myRelationships?.data}
            myFailures={myFailures?.data}
            myMentors={myMentors?.data}
          />
        )
    }
  }

  return (
    <div>
      <div className='porfolio-header'>
        <h3>MY PORTFOLIO</h3>
        <p>
          Complete your assigned tasks, works towards building out your
          Market-Ready Portfolio and develop you Market-Ready skills.
        </p>
      </div>
      <div className='portfolio-container'>
        <div className='portfolio-navbar'>
          <div
            className={`portfolio-navbar-item ${
              activeSection === 'who-am-i' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('who-am-i')}
          >
            Who am I?
          </div>
          <div
            className={`portfolio-navbar-item ${
              activeSection === 'what-can-i-do' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('what-can-i-do')}
          >
            What Can I Do?
          </div>
          <div
            className={`portfolio-navbar-item ${
              activeSection === 'how-do-i-prove-it' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('how-do-i-prove-it')}
          >
            How Do I Prove it?
          </div>
          <div
            className={`portfolio-navbar-item ${
              activeSection === 'start' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('start')}
          >
            Start
          </div>
        </div>

        {renderActiveSection()}
      </div>
    </div>
  )
}

export default Portfolio
