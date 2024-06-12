import React from 'react'
import { Route } from 'react-router-dom/cjs/react-router-dom'
import OccupationList from '../OccupationList'
import OccupationSidebar from '../OccupationSidebar'
import OccupationContent from '../OccupationContent'
import LoadingAnimation from '../../../ui/loadingAnimation'

const PathwaysRouter = ({
  pathways,
  occupationGroup,
  occupationJobs,
  occupationJob,
  occupationContentLoading,
  handleSearchInputChange,
  searchQuery,
  filteredOccupationGroups
}) => {
  return (
    <div className="py-4">
      {pathways.loading ? (
        <LoadingAnimation show={pathways.loading} />
      ) : (
        <>
          <Route
            exact
            path={'/pathways'}
            component={() => <OccupationList pathways={pathways} />}
          />
          <Route
            exact
            path={`/pathways/:occupationId`}
            component={() => (
              <div className="page-card">
                <OccupationSidebar
                  searchQuery={searchQuery}
                  handleSearchInputChange={handleSearchInputChange}
                  filteredOccupationGroups={filteredOccupationGroups}
                />
                <OccupationContent
                  occupationGroup={occupationGroup}
                  occupationJobs={occupationJobs}
                  occupationContentLoading={occupationContentLoading}
                  occupationJob={occupationJob}
                />
              </div>
            )}
          />
          <Route
            path={`/pathways/:occupationId?/:occupationJobId?/details`}
            component={() => (
              <div className="page-card">
                <OccupationSidebar
                  searchQuery={searchQuery}
                  handleSearchInputChange={handleSearchInputChange}
                  filteredOccupationGroups={filteredOccupationGroups}
                />
                <OccupationContent
                  occupationGroup={occupationGroup}
                  occupationJobs={occupationJobs}
                  occupationContentLoading={occupationContentLoading}
                  occupationJob={occupationJob}
                />
              </div>
            )}
          />
        </>
      )}
    </div>
  )
}

export default PathwaysRouter
