import React from 'react'
import { Route } from 'react-router-dom/cjs/react-router-dom'
import OccupationJobs from '../OccupationJobs'
import OccupationJobDetails from '../OccupationJobDetails'
import LoadingAnimation from '../../../ui/loadingAnimation'

const OccupationRouter = ({
  occupationGroup,
  occupationJobs,
  occupationJob,
  occupationContentLoading
}) => {
  if (occupationContentLoading) {
    return (
      <div className="w-100 py-4 d-flex align-items-center justify-content-center">
        <LoadingAnimation show={occupationContentLoading} />
      </div>
    )
  }

  return (
    <div className="py-4">
      <Route
        exact
        path={`/pathways/:occupationId`}
        component={() => (
          <OccupationJobs
            occupationJobs={occupationJobs}
            occupationGroup={occupationGroup}
            occupationJob={occupationJob}
            occupationContentLoading={occupationContentLoading}
          />
        )}
      />
      <Route
        exact
        path={`/pathways/:occupationId?/:occupationJobId?/details`}
        component={() => (
          <OccupationJobDetails
            occupationJobs={occupationJobs}
            occupationGroup={occupationGroup}
            occupationJob={occupationJob}
            occupationContentLoading={occupationContentLoading}
          />
        )}
      />
    </div>
  )
}

export default OccupationRouter
