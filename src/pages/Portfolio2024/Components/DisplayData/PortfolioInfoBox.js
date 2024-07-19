import React from 'react'
import PortfolioInfo from './PortfolioInfo'

function PortfolioInfoBox(props) {
  return (
    <div
      className={'portfolio-info-container'}
      style={{ minHeight: props.height }}
    >
      <PortfolioInfo {...props} />
    </div>
  )
}

export default PortfolioInfoBox
