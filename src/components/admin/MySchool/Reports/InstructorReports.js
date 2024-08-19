import React from 'react'
import { InfoBox } from '../ContentItems'
import { Col } from 'react-bootstrap'

import Learners from '../Learners'
import ActiveUsers from './ActiveUsers'
import ProgressTowardCertification from './ProgressTowardCertification'
import CompletionSections from './CompletionSections'
import SectionTwo from './sectionTwo'

const InstructorReports = ({
  selectedInstructor,
  chartLoading,
  setFilterProgram,
  rangeFilter,
  chartData,
  progressData,
  progressLoading,
  studentsCount,
  studentsCountLoading
}) => {
  function handleProgressValue(value) {
    if (isNaN(value) || value === undefined || value === null) {
      return 0
    }
    return value
  }

  return (
    <>
      <ActiveUsers
        chartData={chartData}
        chartLoading={chartLoading}
        progressLoading={progressLoading}
        rangeFilter={rangeFilter}
        setFilterProgram={setFilterProgram}
      />
      <ProgressTowardCertification
        progressData={progressData}
        progressLoading={progressLoading}
        studentsCount={studentsCount}
        studentsCountLoading={studentsCountLoading}
      />

      <CompletionSections
        handleProgressValue={handleProgressValue}
        selectedInstructor={selectedInstructor}
      />

      <SectionTwo
        selectedInstructor={selectedInstructor}
        handleProgressValue={handleProgressValue}
      />

      <Col>
        <InfoBox>
          <Learners
            justSearchable
            instructor_id={selectedInstructor.id}
            tableTitle='STUDENT DATA'
            usedIn={'reports'}
          />
        </InfoBox>
      </Col>
    </>
  )
}

export default InstructorReports
