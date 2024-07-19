import React from 'react'
import { editWhoSection } from '../../../../redux/portfolio/Actions'
import SectionActions from '../Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'

function PortfolioDataContainer(props) {
  return (
    <div
      className={'portfolio-data-container'}
      style={{ background: props.background }}
    >
      {props.title && (
        <div
          className={'portfolio-data-container-title py-2'}
          style={{ textAlign: props.titleAlign }}
        >
          {props.title}
        </div>
      )}
      {props.description && (
        <div className={'portfolio-data-container-description py-2'}>
          {props.description}
        </div>
      )}
      {props.children}
    </div>
  )
}

export default PortfolioDataContainer
