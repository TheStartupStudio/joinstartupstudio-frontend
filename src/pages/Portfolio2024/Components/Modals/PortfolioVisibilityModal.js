import React, { useEffect, useState } from 'react'
import PortfolioModalWrapper from './PortfolioModalWrapper'
import SectionActions from '../Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import SwitchIcon from '../Actions/SwitchIcon'
import ConfirmVisibilityModal from './ConfirmVisibilityModal'
import {
  setConfirmVisibilityModal,
  setConfirmVisibilityModalContent,
  setShareModal,
  setShareModalContent,
  updateSharingSettings
} from '../../../../redux/portfolio/Actions'
import SharePortfolioModal from './SharePortfolioModal'

function PortfolioVisibilityModal(props) {
  const dispatch = useDispatch()
  const [sharingSettings, setSharingSettings] = useState({})
  const [publishToPeers, setPublishToPeers] = useState(false)
  const [publishToPublic, setPublishToPublic] = useState(false)
  const confirmVisibilityModal = useSelector(
    (state) => state.portfolio.confirmVisibilityModal
  )
  const confirmVisibilityModalContent = useSelector(
    (state) => state.portfolio.confirmVisibilityModalContent
  )
  const showSharePortfolioModal = useSelector(
    (state) => state.portfolio.showSharePortfolioModal
  )
  const sharePortfolioModalContent = useSelector(
    (state) => state.portfolio.showSharePortfolioModalContent
  )

  useEffect(() => {
    if (props.sharingSettings) setSharingSettings(props.sharingSettings)
  }, [props.sharingSettings])

  // useEffect(() => {
  //   setPublishToPublic(props.publishToPublic)
  // }, [props.publishToPublic])
  // useEffect(() => {
  //   setPublishToPeers(props.publishToPeers)
  // }, [props.publishToPeers])

  const actions = [
    {
      type: 'hide',
      action: () => {
        props.onHide()
      },
      isDisplayed: true,
      description: 'Click here to hide modal'
    }
  ]

  const isEdit = () => !!sharingSettings?.id
  const handleTogglePeers = () => {
    if (sharingSettings?.isPeerShared === false) {
      dispatch(
        setConfirmVisibilityModalContent({
          title: 'YOU’RE ABOUT TO PUBLISH YOUR PORTFOLIO TO YOUR PEERS.',
          description:
            'Once you publish your portfolio, your peers will be able to view it.',
          action: () =>
            dispatch(
              updateSharingSettings(
                {
                  ...sharingSettings,
                  isPeerShared: !sharingSettings?.isPeerShared,
                  // isPublicShared: sharingSettings?.isPublicShared,
                  id: sharingSettings?.id
                },
                null,
                isEdit()
              )
            )
        })
      )
      dispatch(
        setShareModalContent({
          description: 'Share the link below with peers.'
        })
      )
      dispatch(setConfirmVisibilityModal(true))
    } else {
      dispatch(
        setConfirmVisibilityModalContent({
          title: 'YOU’RE ABOUT TO UNPUBLISH YOUR PORTFOLIO.',
          description:
            'Once you unpublish your portfolio, nobody will be able to view it.',
          actionTitle: 'YES, UNPUBLISH MY PORTFOLIO',
          action: () =>
            dispatch(
              updateSharingSettings(
                {
                  ...sharingSettings,
                  isPeerShared: !sharingSettings?.isPeerShared,
                  // isPublicShared: sharingSettings?.isPublicShared,
                  id: sharingSettings?.id
                },
                'unPublishing',
                isEdit()
              )
            )
        })
      )
      dispatch(
        setShareModalContent({
          description: 'Share the link below with peers.'
        })
      )
      dispatch(setConfirmVisibilityModal(true))
    }
  }

  const handleTogglePublic = () => {
    if (sharingSettings?.isPublicShared === false) {
      dispatch(
        setConfirmVisibilityModalContent({
          title: 'YOU’RE ABOUT TO PUBLISH YOUR PORTFOLIO TO THE PUBLIC.',
          description:
            'Once you publish your portfolio, others will be able to view it.',
          action: () =>
            dispatch(
              updateSharingSettings(
                {
                  // isPeerShared: sharingSettings?.isPeerShared,
                  ...sharingSettings,
                  isPeerShared: true,
                  isPublicShared: !sharingSettings?.isPublicShared,
                  id: sharingSettings?.id
                },
                null,
                isEdit()
              )
            )
        })
      )
      dispatch(
        setShareModalContent({
          description: 'Share the link below with anyone.'
        })
      )
      dispatch(setConfirmVisibilityModal(true))
    } else {
      dispatch(
        setConfirmVisibilityModalContent({
          title: 'YOU’RE ABOUT TO UNPUBLISH YOUR PORTFOLIO.',
          description:
            'Once you unpublish your portfolio, only your peers will be able to view it.',
          actionTitle: 'YES, UNPUBLISH MY PORTFOLIO',
          containCheckbox: true,
          checkboxContent:
            'Check to unpublished for everyone (nobody will be able to view your portfolio).',
          action: () =>
            dispatch(
              updateSharingSettings(
                {
                  // isPeerShared: sharingSettings?.isPeerShared,
                  ...sharingSettings,
                  isPublicShared: !sharingSettings?.isPublicShared,
                  id: sharingSettings?.id
                },
                'unPublishing',
                isEdit()
              )
            )
        })
      )
      dispatch(
        setShareModalContent({
          description: 'Share the link below with anyone.'
        })
      )
      dispatch(setConfirmVisibilityModal(true))
    }
  }

  return (
    <PortfolioModalWrapper
      {...props}
      hideHeader={true}
      class={'publish-portfolio-modal'}
    >
      <div
        className={
          'd-flex justify-content-center flex-column align-items-center'
        }
      >
        <div className={'share-portfolio-title'}>Share portfolio modal</div>
        <div className={'mt-5'}>
          <div
            className={
              'd-flex gap-5 align-items-center justify-content-between'
            }
          >
            <label className={'switch-input-label'}>
              Publish to your peers
            </label>
            <SwitchIcon
              id='publish-to-peers'
              isChecked={!sharingSettings?.isPeerShared}
              onToggle={handleTogglePeers}
              icon={'custom-switch-label'}
            />
          </div>

          <div
            className={
              'd-flex gap-5 align-items-center justify-content-between mt-4'
            }
          >
            <label className={'switch-input-label'}>
              Publish to the public
            </label>
            <SwitchIcon
              id='publish-to-public'
              isChecked={!sharingSettings?.isPublicShared}
              onToggle={handleTogglePublic}
              icon={'custom-switch-label'}
            />
          </div>
        </div>
      </div>

      <SectionActions actions={actions} />
      <ConfirmVisibilityModal
        show={confirmVisibilityModal}
        onHide={() => dispatch(setConfirmVisibilityModal(false))}
        modalContent={confirmVisibilityModalContent}
      />
      <SharePortfolioModal
        show={showSharePortfolioModal}
        onHide={() => dispatch(setShareModal(false))}
        modalContent={sharePortfolioModalContent}
      />
    </PortfolioModalWrapper>
  )
}

export default PortfolioVisibilityModal
