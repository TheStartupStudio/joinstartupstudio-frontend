import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareAltSquare } from '@fortawesome/free-solid-svg-icons'
import './css/shareMyPortfolio.css'
import ShareMyPortfolio from '../../Modals/Profile/shareMyPortfolio'

export const ShareMyPortfolioWidget = (props) => {
  const [showShareMyPortfolioModal, shareMyPortfolioModal] = useState(false)

  return (
    <>
      {' '}
      <div className="d-flex ">
        <div className="ps-2 d-flex flex-wrap flex-column ">
          <div className={'d-flex align-items-center gap-2'}>
            <FontAwesomeIcon
              icon={faShareAltSquare}
              style={{ width: '30px', height: '35px', cursor: 'pointer' }}
              className="float-end"
              onClick={() => shareMyPortfolioModal(true)}
            />
            <span
              className="title pb-md-0 mb-md-0"
              onClick={() => shareMyPortfolioModal(true)}
              style={{ cursor: 'pointer' }}
            >
              Share My Portfolio
            </span>
          </div>

          <span
            className="d-block desc text-end"
            style={{ cursor: 'pointer' }}
            onClick={() => shareMyPortfolioModal(true)}
          >
            Portfolio must be published first.
          </span>
        </div>
      </div>
      <ShareMyPortfolio
        show={showShareMyPortfolioModal}
        onHide={() => {
          shareMyPortfolioModal(false)
        }}
        from={'portfolio'}
        userLink={props.user && props.user.username}
      />
    </>
  )
}

