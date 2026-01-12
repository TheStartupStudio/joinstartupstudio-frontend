import React, { useState } from 'react'
import PortfolioModalWrapper from './PortfolioModalWrapper'
import { IoMdCopy } from 'react-icons/io'
import SectionActions from '../Actions/SectionActions'
import TooltipAction from '../Actions/TooltipAction'
import Tooltip from 'react-bootstrap/Tooltip'
import { useSelector } from 'react-redux'

function SharePortfolioModal(props) {
  const loggedUser = useSelector((state) => state.user.user.user)
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

  const [copied, setCopied] = useState(false)

  const portfolioUrl = () => {
    let portfolioUrl = ''
    if (
      props.sharingSettings?.isPeerShared &&
      !props.sharingSettings?.isPublicShared
    ) {
      portfolioUrl = '/peer-portfolio/'
    } else if (
      (!props.sharingSettings?.isPeerShared &&
        props.sharingSettings?.isPublicShared) ||
      (props.sharingSettings?.isPeerShared &&
        props.sharingSettings?.isPublicShared)
    ) {
      portfolioUrl = '/public-portfolio/'
    }

    let url = window.location.origin + portfolioUrl + encodeURIComponent(loggedUser?.username)
    return url
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl())
    setCopied(true)
  }

  return (
    <PortfolioModalWrapper
      {...props}
      hideHeader={true}
      class={'share-portfolio-modal'}
    >
      <div
        className={
          'd-flex flex-column align-items-center justify-content-center gap-3'
        }
      >
        <div className={'published-portfolio-label'}>
          YOUR PORTFOLIO IS PUBLISHED!
        </div>
        <div className={'share-the-link'}>
          {props.modalContent?.description}
        </div>
        <div className={'copy-to-clipboard-box d-flex align-items-center'}>
          <input
            value={portfolioUrl()}
            readOnly
            className={'share-portfolio-input'}
          />
          <TooltipAction
            onClick={handleCopy}
            icon={<IoMdCopy className={'action-icon pencil-icon'} />}
            tooltipContent={
              <Tooltip id='tooltip' className={'tooltip-content'}>
                {copied ? 'Copied!' : 'Click here to copy URL to clipboard'}
              </Tooltip>
            }
          />
        </div>
      </div>

      <SectionActions actions={actions} />
    </PortfolioModalWrapper>
  )
}

export default SharePortfolioModal
