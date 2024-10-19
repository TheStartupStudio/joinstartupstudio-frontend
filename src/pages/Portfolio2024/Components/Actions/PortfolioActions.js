import React from 'react'
import { IoShareOutline } from 'react-icons/io5'
import Tooltip from 'react-bootstrap/Tooltip'
import { useSelector } from 'react-redux'
import { FaEye, FaX } from 'react-icons/fa6'
import { FaPencilAlt } from 'react-icons/fa'
import shareToPeersIcon from '../../../../assets/images/HS-Portfolio-Icons/Share Icon PEERS v2 (BLU)x1200.png'
import shareToPublicIcon from '../../../../assets/images/HS-Portfolio-Icons/Share Icon (BLU)x1200.png'
import noSharePinkIcon from '../../../../assets/images/HS-Portfolio-Icons/NO Share Icon (PINK)x1200.png'
import TooltipAction from './TooltipAction'

function PortfolioActions(props) {
  const viewMode = useSelector((state) => state.portfolio.mode)
  const sharingSettings = useSelector(
    (state) => state.portfolio.sharingSettings
  )
  // const publishToPeers = useSelector((state) => state.portfolio.publishToPeers)
  // const publishToPublic = useSelector(
  //   (state) => state.portfolio.publishToPublic
  // )

  const renderIcon = () => {
    const iconStyle = { width: 30, height: 30, objectFit: 'contain' }
    if (sharingSettings?.isPeerShared && !sharingSettings?.isPublicShared) {
      return (
        <img
          src={shareToPeersIcon}
          style={iconStyle}
          alt={'publish-to-peers'}
        />
      )
    } else if (sharingSettings?.isPublicShared) {
      return (
        <img
          src={shareToPublicIcon}
          style={iconStyle}
          alt={'publish-to-public'}
        />
      )
    } else if (
      !sharingSettings?.isPublicShared &&
      !sharingSettings?.isPeerShared
    ) {
      return (
        <img
          src={noSharePinkIcon}
          style={iconStyle}
          alt={'publish-to-public'}
        />
      )
    }
  }

  const foundedAction = (type) =>
    props.actions?.find((action) => action.type === type)
  const editButton = foundedAction('edit')
  const previewButton = foundedAction('preview')
  const saveButton = foundedAction('save')
  const shareButton = foundedAction('share')
  const publishButton = foundedAction('publish')

  return (
    <React.Fragment>
      <div className={'portfolio-actions'}>
        {viewMode === 'preview' && (
          <React.Fragment>
            {editButton && (
              <TooltipAction
                onClick={() => editButton?.action()}
                icon={<FaPencilAlt className={'action-icon pencil-icon'} />}
                tooltipContent={editButton.tooltipContent}
              />
            )}

            {publishButton?.isDisplayed && (
              <TooltipAction
                onClick={() => publishButton?.action()}
                icon={renderIcon()}
                tooltipContent={publishButton.tooltipContent}
              />
            )}
            {shareButton?.isDisplayed && (
              <TooltipAction
                onClick={() => shareButton?.action()}
                icon={<IoShareOutline className={'action-icon share-icon'} />}
                tooltipContent={shareButton.tooltipContent}
              />
            )}
          </React.Fragment>
        )}
        {viewMode === 'edit' && previewButton && (
          <React.Fragment>
            <TooltipAction
              onClick={() => previewButton.action()}
              icon={<FaX className={'action-icon eye-icon'} />}
              tooltipContent={previewButton.tooltipContent}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

export default PortfolioActions
