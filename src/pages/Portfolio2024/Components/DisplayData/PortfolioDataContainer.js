import React from 'react'
import { editWhoSection } from '../../../../redux/portfolio/Actions'
import SectionActions from '../Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'

function PortfolioDataContainer(props) {
  return (
    <div
      className={'portfolio-data-container proveit-container'}
      style={{ background: props.background, minHeight: props.height }}
    >
      {props.title && (
        <div
          className={'portfolio-data-container-title py-2'}
          style={{ textAlign: props.titleAlign }}
        >
          {props.title}
          {props.description && (
            <div className={'portfolio-data-container-description py-2'}>
              {props.description}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          marginTop:
            props.title && props.description
              ? 110
              : props.title && !props.description
              ? 70
              : 0
          // overflow: 'hidden'
        }}
      >
        {props.children}
      </div>
    </div>
  )
}

export default PortfolioDataContainer
