import React, { useEffect, useState } from 'react'
import './style.css'
import BriefingModal from '../Modals/BriefingModal'
import { useDispatch, useSelector } from 'react-redux'
import { getBriefingsStart } from '../../redux/header/Actions'
import BriefingBox from './BriefingBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import BriefingEditor from './BriefingEditor'
import LoadingAnimation from '../../ui/loadingAnimation'

const BriefingsArchive = () => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBriefing, setSelectedBriefing] = useState(null)
  const [addBriefingModal, setAddBriefingModal] = useState(false)
  const { briefings, loading } = useSelector((state) => state.header)
  const { isAdmin, user } = useSelector((state) => state.user.user)

  useEffect(() => {
    dispatch(getBriefingsStart())
  }, [dispatch])

  const handleOpenBriefingModal = (briefing) => {
    setSelectedBriefing(briefing)
    setIsModalOpen(true)
  }

  const handleCloseBriefingModal = () => {
    setIsModalOpen(false)
    setSelectedBriefing(null)
  }

  return (
    <div className='col-12 col-md-12 col-xl-9 pe-0 me-0 '>
      <div className='account-page-padding page-border position-relative'>
        {loading ? (
          <LoadingAnimation show={loading} />
        ) : (
          <>
            {isAdmin && (
              <div
                className='add-briefing-container p-3'
                onClick={() => setAddBriefingModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </div>
            )}
            <div className='pt-4 '>
              <h2 className='fw-bold'>MY NEWS BRIEFING ARCHIVE</h2>
              <p>Welcome to Your Dashboard</p>
            </div>
            <div className='skills-box'>
              {briefings.map((briefing) => (
                <BriefingBox
                  briefing={briefing}
                  handleOpenBriefingModal={handleOpenBriefingModal}
                  isAdmin={isAdmin}
                  user={user}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {selectedBriefing && (
        <BriefingModal
          briefing={selectedBriefing}
          show={isModalOpen}
          onHide={handleCloseBriefingModal}
        />
      )}

      {addBriefingModal && (
        <BriefingEditor
          show={addBriefingModal}
          onHide={() => setAddBriefingModal(false)}
          mode='add'
          user={user}
        />
      )}
    </div>
  )
}

export default BriefingsArchive
