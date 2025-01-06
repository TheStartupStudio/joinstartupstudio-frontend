import React, { useEffect, useState } from 'react'
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
  const [applicationData, setApplicationData] = useState(null)

  useEffect(() => {
    const savedData = localStorage.getItem('spotlightApplicationData')
    if (savedData) {
      setIsApplicationSaved(true)
      setApplicationData(JSON.parse(savedData))
    }
  }, [])

  const openSpotlightApplyModal = () => {
    setSpotlightApplyModal(true)
  }
  const closeSpotlightApplyModal = () => {
    setSpotlightApplyModal(false)
  }
  const handleSaveAndContinue = async (data) => {
    const updatedData = { ...data }

    const serializeFile = async (file) => {
      if (!(file instanceof File)) {
        return file
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () =>
          resolve({ base64: reader.result, name: file.name })
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })
    }

    updatedData.businessPlan = await serializeFile(data.businessPlan)
    updatedData.pitchDeck = await serializeFile(data.pitchDeck)
    updatedData.parentGuardianApprovalForm = await serializeFile(
      data.parentGuardianApprovalForm
    )

    localStorage.setItem(
      'spotlightApplicationData',
      JSON.stringify(updatedData)
    )
    setIsApplicationSaved(true)
    closeSpotlightApplyModal()
  }

  const handleRemoveSavedApplication = () => {
    localStorage.removeItem('spotlightApplicationData')
    setIsApplicationSaved(false)
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
          onSave={(data) => handleSaveAndContinue(data)}
          initialData={applicationData}
          isApplicationSaved={isApplicationSaved}
          userRole={userRole}
          removeSavedApplication={handleRemoveSavedApplication}
        />
      )}
    </>
  )
}

export default SpotlightCompetition
