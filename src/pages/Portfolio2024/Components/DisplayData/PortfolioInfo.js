import React from 'react'

function PortfolioInfoBox(props) {
  return (
    <React.Fragment>
      <div
        style={{ height: props.titleHeight }}
        className={'portfolio-info-title'}
      >
        {props.title ?? 'Title'}
      </div>
      <div
        className={'portfolio-info-content'}
        style={{ height: props.inputHeight }}
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    </React.Fragment>
  )
}

export default PortfolioInfoBox
