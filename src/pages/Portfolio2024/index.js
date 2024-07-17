import React, { useEffect } from 'react'
import './index.css'
import PortfolioHeader from './Components/Header/PortfolioHeader'
import { useDispatch, useSelector } from 'react-redux'
import PortfolioActions from './Components/Actions/PortfolioActions'
import PortfolioNavigator from './Components/PortfolioNavigator'
import {
  changeViewMode,
  getPortfolioPrivacy,
  setPublishModal,
  setShareModal,
  setShareModalContent
} from '../../redux/portfolio/Actions'
import WhoAmI from './Sections/WhoAmISection/WhoAmI'
import PortfolioVisibilityModal from './Components/Modals/PortfolioVisibilityModal'
import SharePortfolioModal from './Components/Modals/SharePortfolioModal'

function Index(props) {
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.user.user.user)
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const publishPortfolioModal = useSelector(
    (state) => state.portfolio.publishPortfolioModal
  )

  const publishToPeers = useSelector((state) => state.portfolio.publishToPeers)
  const publishToPublic = useSelector(
    (state) => state.portfolio.publishToPublic
  )

  const showSharePortfolioModal = useSelector(
    (state) => state.portfolio.showSharePortfolioModal
  )
  const sharePortfolioModalContent = useSelector(
    (state) => state.portfolio.showSharePortfolioModalContent
  )

  useEffect(() => {
    if (publishToPeers && !publishToPublic) {
      dispatch(
        setShareModalContent({
          ...sharePortfolioModalContent,
          description: 'Share the link below with peers.'
        })
      )
    } else if (publishToPublic) {
      dispatch(
        setShareModalContent({
          ...sharePortfolioModalContent,
          description: 'Share the link below with anyone.'
        })
      )
    }
  }, [publishToPeers, publishToPublic])

  useEffect(() => {
    dispatch(getPortfolioPrivacy())
  }, [dispatch])

  // console.log('publishToPeers', publishToPeers)
  // console.log('publishToPublic', publishToPublic)
  return (
    <div className={'portfolio-container'}>
      <PortfolioActions
        actions={[
          { type: 'edit', action: () => dispatch(changeViewMode('edit')) },
          {
            type: 'preview',
            action: () => dispatch(changeViewMode('preview'))
          },
          {
            type: 'publish',
            action: () => dispatch(setPublishModal(true)),
            isDisplayed: true
          },
          {
            type: 'share',
            action: () => dispatch(setShareModal(true)),
            isDisplayed: publishToPublic || publishToPeers
          }
        ]}
      />
      <PortfolioHeader user={loggedUser} />
      {activeSection === 'who-section' && <WhoAmI />}
      {activeSection === 'what-section' && 'What section'}
      <PortfolioNavigator />
      <PortfolioVisibilityModal
        show={publishPortfolioModal}
        onHide={() => dispatch(setPublishModal(false))}
        title={'Share your portfolio'}
        publishToPublic={publishToPublic}
        publishToPeers={publishToPeers}
      />
      <SharePortfolioModal
        show={showSharePortfolioModal}
        onHide={() => dispatch(setShareModal(false))}
        publishToPublic={publishToPublic}
        publishToPeers={publishToPeers}
        modalContent={sharePortfolioModalContent}
      />
    </div>
  )
}

export default Index
