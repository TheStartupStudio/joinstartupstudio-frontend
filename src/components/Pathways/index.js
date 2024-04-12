import React, { useEffect, useState } from 'react'
import PathwaysRouter from './PathwaysRouter'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import {
  fetchOccupationGroupWithID,
  fetchOccupationJobWithID,
  fetchOccupationJobsBasedOnGroupID
} from '../../redux/pathways/actions'

const Pathways = ({ pathways }) => {
  const dispatch = useDispatch()
  const { occupationId, occupationJobId } = useParams()
  const {
    occupationGroup,
    occupationContentLoading,
    occupationJobs,
    occupationJob
  } = useSelector((state) => state.pathways)

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredOccupationGroups = pathways.occupationGroups.filter(
    (occupation) =>
      occupation.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    dispatch(fetchOccupationGroupWithID(occupationId))
  }, [occupationId, dispatch])

  useEffect(() => {
    dispatch(fetchOccupationJobsBasedOnGroupID(occupationId))
  }, [occupationId, dispatch])

  useEffect(() => {
    dispatch(fetchOccupationJobWithID(occupationJobId))
  }, [dispatch, occupationJobId])

  return (
    <PathwaysRouter
      pathways={pathways}
      occupationGroup={occupationGroup}
      occupationContentLoading={occupationContentLoading}
      occupationJobs={occupationJobs}
      occupationJob={occupationJob}
      searchQuery={searchQuery}
      handleSearchInputChange={handleSearchInputChange}
      filteredOccupationGroups={filteredOccupationGroups}
    />
  )
}

export default Pathways
