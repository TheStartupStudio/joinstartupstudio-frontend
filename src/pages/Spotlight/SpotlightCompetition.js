import React, { useState } from 'react'
import { Row } from 'react-bootstrap'
import spotlightBulb from '../../assets/images/Immersion/SpotlightBulbImg2.png'
import SpotlightApplyModal from '../../components/Modals/Spotlight/SpotlightApplyModal'
import { fetchSpotlights } from '../../redux/myImmersion/actions'
import { useDispatch } from 'react-redux'

const SpotlightApplyBtn = ({ isApplicationSaved, onOpen }) => {
  return (
    <div className='apply-btn-wrapper'>
      <button
        className='apply-btn'
        onClick={() => {
          onOpen()
        }}
      >
        {isApplicationSaved
          ? 'Edit My Spotlight Application'
          : 'Apply for the Spotlight Competition'}
      </button>
    </div>
  )
}

const SpotlightCompetition = () => {
  const dispatch = useDispatch()
  const userRole = localStorage.getItem('role')
  const [spotlightApplyModal, setSpotlightApplyModal] = useState(false)
  const [isApplicationSaved, setIsApplicationSaved] = useState(false)

  const openSpotlightApplyModal = () => {
    setSpotlightApplyModal(true)
  }
  const closeSpotlightApplyModal = () => {
    setSpotlightApplyModal(false)
  }
  const handleSaveAndContinue = () => {
    setIsApplicationSaved(true)
    closeSpotlightApplyModal()
  }
  return (
    <>
      <Row>
        <div className='comp-apply-container'>
          <div className='apply-title'>
            <img
              src={spotlightBulb}
              width={'100%'}
              height={'55px'}
              alt='spotlight bulb'
            />
          </div>
          <SpotlightApplyBtn
            type={'applyNow'}
            onOpen={() => openSpotlightApplyModal()}
            isApplicationSaved={isApplicationSaved}
          />
        </div>
      </Row>
      {spotlightApplyModal && (
        <SpotlightApplyModal
          show={spotlightApplyModal}
          onHide={() => closeSpotlightApplyModal()}
          title={'Apply to Pitch'}
          onSuccess={() => dispatch(fetchSpotlights())}
          onSave={handleSaveAndContinue}
          userRole={userRole}
        />
      )}
    </>
  )
}

export default SpotlightCompetition
