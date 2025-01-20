import React from 'react'
import '../../index.css'

function PortfolioInfoBox(props) {
  return (
    <React.Fragment>
      {props.title && (
        <div
          style={{ height: props.titleHeight }}
          className={`portfolio-info-title ${props.titleClasses ?? ''}`}
        >
          {props.title ?? 'Title'}
        </div>
      )}
      <div
        className={`${props.contentClasses ?? ''} portfolio-info-content `}
        style={{ minHeight: props.inputHeight }}
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    </React.Fragment>
  )
}

export default PortfolioInfoBox
