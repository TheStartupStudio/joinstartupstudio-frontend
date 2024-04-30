import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareAltSquare } from '@fortawesome/free-solid-svg-icons'
import './css/shareMyPortfolio.css'
import ShareMyPortfolio from '../../Modals/Profile/shareMyPortfolio'

export const ShareMyPortfolioWidget = (propsi) => {
  const [showShareMyPortfolioModal, shareMyPortfolioModal] = useState(false)

  return (
    <>
      {' '}
      <div className='d-flex justify-content-end'>
        <div className='px-0 mx-0 gx-0 shareMyPortfolio'>
          <FontAwesomeIcon
            icon={faShareAltSquare}
            style={{ width: '30px', height: '35px', cursor: 'pointer' }}
            className='float-end'
            onClick={() => shareMyPortfolioModal(true)}
          />
        </div>
        <div className='ps-2 d-flex flex-wrap'>
          <span
            className='title pb-md-0 mb-md-0'
            onClick={() => shareMyPortfolioModal(true)}
            style={{ cursor: 'pointer' }}
          >
            Share My Portfolio
          </span>
          <p className='w-100 py-0 my-0 gy-0' />
          <span
            className='d-block desc'
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
        userLink={propsi.user && propsi.user.username}
      />
    </>
  )
}
