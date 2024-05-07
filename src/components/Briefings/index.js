import React, { useEffect, useState } from 'react'
import './style.css'
import BriefingModal from '../Modals/BriefingModal'
import { useDispatch, useSelector } from 'react-redux'
import { getBriefingsStart } from '../../redux/header/Actions'
import LoadingAnimation from '../IAMRinbox/loadingAnimation'
import BriefingBox from './BriefingBox'

const BriefingsArchive = () => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBriefing, setSelectedBriefing] = useState(null)
  const { briefings, loading } = useSelector((state) => state.header)

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
    <div className="col-12 col-md-12 col-xl-9 pe-0 me-0 ">
      <div className="account-page-padding page-border">
        {loading ? (
          <LoadingAnimation show={loading} />
        ) : (
          <>
            <div className="pt-4 ">
              <h2 className="fw-bold">MY NEWS BRIEFING ARCHIVE</h2>
              <p>Welcome to Your Dashboard</p>
            </div>
            <div className="skills-box">
              {briefings.map((briefing) => (
                <BriefingBox
                  briefing={briefing}
                  handleOpenBriefingModal={handleOpenBriefingModal}
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
    </div>
  )
}

export default BriefingsArchive
