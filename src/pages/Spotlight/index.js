import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { changeSidebarState } from '../../redux'
import { setBackButton } from '../../redux/backButtonReducer'
import SubmittedApplications from './SubmittedApplications'
import InstructorFeedback from './InstructorFeedback'
import ArchiveSpotlightModal from '../../components/Modals/Spotlight/ArchiveSpotlightModal'
import { fetchSpotlights } from '../../redux/myImmersion/actions'
import SpotlightArchive from './SpotlightArchive'
import SpotlightInfoSection from './SpotlightInfoSection'
import SpotlightCompetition from './SpotlightCompetition'
import './index.css'

function StartupLive() {
  const dispatch = useDispatch()
  const userRole = localStorage.getItem('role')
  const { spotlights } = useSelector((state) => state.myImmersion)
  const [archiveSpotlightModal, setArchiveSpotlightModal] = useState({
    state: false,
    data: {}
  })

  useEffect(() => {
    dispatch(fetchSpotlights())
  }, [dispatch])

  useEffect(() => {
    dispatch(setBackButton(true, 'my-immersion'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  return (
    <Container fluid>
      <Row>
        <div className='spotlight-column col-12  pe-0'>
          <div
            className='spotlight-container spotlight-page-wrapper account-page-padding page-border '
            style={{ minHeight: '100vh' }}
          >
            <div className='spotlight-header'>
              <h3 className='page-title'>SPOTLIGHT®</h3>
              <p className='page-description'>
                Pitch your industry solution to the Industry Partners of Learn
                to Start.
              </p>
            </div>
            <div className='spotlight-wrapper'>
              <SpotlightInfoSection />
              <SpotlightCompetition />
              {userRole === 'student' && (
                <Row className='m-0 pt-3 pb-0 justify-content-between'>
                  <SubmittedApplications
                    spotlights={spotlights}
                    setArchiveSpotlightModal={setArchiveSpotlightModal}
                  />
                  <InstructorFeedback
                    spotlights={spotlights}
                    setArchiveSpotlightModal={setArchiveSpotlightModal}
                  />
                </Row>
              )}
              <SpotlightArchive />
            </div>
          </div>
        </div>
      </Row>

      {archiveSpotlightModal.state && (
        <ArchiveSpotlightModal
          show={archiveSpotlightModal.state}
          onHide={() => setArchiveSpotlightModal({ state: false, data: {} })}
          spotlight={archiveSpotlightModal.data}
          mode={'edit'}
        />
      )}
    </Container>
  )
}

export default StartupLive
