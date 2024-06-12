import React from 'react'
import OccupationRouter from '../OccupationRouter'
import LoadingAnimation from '../../../ui/loadingAnimation'

const OccupationContent = ({
  occupationGroup,
  occupationJobs,
  occupationJob,
  occupationContentLoading
}) => {
  return (
    <>
      {occupationContentLoading ? (
        <div className="w-100 d-flex align-items-center justify-content-center">
          <LoadingAnimation show={occupationContentLoading} />
        </div>
      ) : (
        <div className="page-card__content styled-scrollbar col-lg-8 col-md-7">
          <div className="row">
            <div className="col-12">
              <div className="journal-entries__back">
                <p>Back</p>
              </div>

              <h3 className="page-card__content-title">
                {occupationGroup?.name}
              </h3>
              <hr className="mb-0" />

              <OccupationRouter
                occupationJobs={occupationJobs}
                occupationGroup={occupationGroup}
                occupationJob={occupationJob}
                occupationContentLoading={occupationContentLoading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OccupationContent
