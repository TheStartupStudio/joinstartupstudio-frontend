import React from 'react'
import { IoShareOutline } from 'react-icons/io5'
import Tooltip from 'react-bootstrap/Tooltip'
import { useSelector } from 'react-redux'
import { FaEye } from 'react-icons/fa6'
import { FaPencilAlt } from 'react-icons/fa'
import shareToPeersIcon from '../../../../assets/images/HS-Portfolio-Icons/Share Icon PEERS v2 (BLU)x1200.png'
import shareToPublicIcon from '../../../../assets/images/HS-Portfolio-Icons/Share Icon (BLU)x1200.png'
import noSharePinkIcon from '../../../../assets/images/HS-Portfolio-Icons/NO Share Icon (PINK)x1200.png'
import TooltipAction from './TooltipAction'

function PortfolioActions(props) {
  const viewMode = useSelector((state) => state.portfolio.mode)

  const publishToPeers = useSelector((state) => state.portfolio.publishToPeers)
  const publishToPublic = useSelector(
    (state) => state.portfolio.publishToPublic
  )

  const renderIcon = () => {
    const iconStyle = { width: 30, height: 30, objectFit: 'contain' }
    if (publishToPeers && !publishToPublic) {
      return (
        <img
          src={shareToPeersIcon}
          style={iconStyle}
          alt={'publish-to-peers'}
        />
      )
    } else if (publishToPublic) {
      return (
        <img
          src={shareToPublicIcon}
          style={iconStyle}
          alt={'publish-to-public'}
        />
      )
    } else if (!publishToPublic && !publishToPeers) {
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
                tooltipContent={
                  <Tooltip id="tooltip" className={'tooltip-content'}>
                    Click here to return to edit mode
                  </Tooltip>
                }
              />
            )}

            {publishButton?.isDisplayed && (
              <TooltipAction
                onClick={() => publishButton?.action()}
                icon={renderIcon()}
                tooltipContent={
                  <Tooltip id="tooltip" className={'tooltip-content '}>
                    <div className={'text-center bold-text'}>PUBLISHED</div>
                    <div className={'text-center'}>
                      Click to UNPUBLISH portfolio.
                    </div>
                  </Tooltip>
                }
              />
            )}
            {shareButton?.isDisplayed && (
              <TooltipAction
                onClick={() => shareButton?.action()}
                icon={<IoShareOutline className={'action-icon share-icon'} />}
                tooltipContent={
                  <Tooltip
                    id="tooltip"
                    className={'tooltip-content text-center'}
                  >
                    <div className={'text-center'}>
                      Click here share your portfolio
                    </div>
                  </Tooltip>
                }
              />
            )}
          </React.Fragment>
        )}
        {viewMode === 'edit' && previewButton && (
          <React.Fragment>
            <TooltipAction
              onClick={() => previewButton.action()}
              icon={<FaEye className={'action-icon eye-icon'} />}
              tooltipContent={
                <Tooltip id="tooltip" className={'tooltip-content'}>
                  Click here to preview
                </Tooltip>
              }
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

export default PortfolioActions
