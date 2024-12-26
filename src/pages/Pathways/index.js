import React, { useEffect } from 'react'
import Pathways from '../../components/Pathways'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOccupationGroups } from '../../redux/pathways/actions'
import { changeSidebarState } from '../../redux'

const PathwaysContianer = () => {
  const dispatch = useDispatch()
  const pathways = useSelector((state) => state.pathways)

  useEffect(() => {
    dispatch(fetchOccupationGroups())
  }, [dispatch])

    useEffect(() => {
      dispatch(changeSidebarState(false))
    })
    
  return (
    <div className="p-3">
      <div className="header py-3 ">
        <h3>PATHWAYS</h3>
        <p>
          Engage with industry trainings from Learn to Start's Industry Partners
        </p>
      </div>

      <div style={{ background: '#f8f7f7' }} className="p-2">
        <Pathways pathways={pathways} />
      </div>
      <div className="my-3 text-center">
        <a href="https://www.bls.gov/ooh/" rel="noopener noreferrer">
          {' '}
          U.S Bureau of Labor Statistics
        </a>
      </div>
    </div>
  )
}

export default PathwaysContianer
