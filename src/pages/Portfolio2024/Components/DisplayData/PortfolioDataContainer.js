import React from 'react'
import { editWhoSection } from '../../../../redux/portfolio/Actions'
import SectionActions from '../Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'

function PortfolioDataContainer(props) {
  const whoSection = useSelector((state) => state.portfolio.whoSection)
  const dispatch = useDispatch()

  return (
    <div className={'portfolio-data-container'}>
      {/*{<SectionActions actions={props.actions} />}*/}
      {props.title && (
        <div className={'portfolio-data-container-title py-2'}>
          {props.title}
        </div>
      )}

      {props.children}
    </div>
  )
}

export default PortfolioDataContainer
