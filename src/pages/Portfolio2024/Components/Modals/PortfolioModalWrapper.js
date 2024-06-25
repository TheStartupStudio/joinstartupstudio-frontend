import React from 'react'
import { Modal } from 'react-bootstrap'
import SectionButton from '../../../PortfolioNew/HsPortfolio/Components/SectionButton'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import SectionActions from '../Actions/SectionActions'

function PortfolioModalWrapper(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      id="portfolio-modal-wrapper"
      className={` portfolio-modal-wrapper ${props.class ? props.class : ''}`}
    >
      <SectionActions actions={props.actions} />
      <div className={'p-2 mt-2 w-100'}>
        {!props.hideHeader && (
          <div
            style={{
              font: 'normal normal bold 22px/15px Montserrat',
              letterSpacing: 0.88,
              color: '#231F20',
              borderBottom: '1px solid #e3e3e3'
            }}
            className={'text-uppercase pb-3'}
          >
            {props.title}
          </div>
        )}
        <div className={'mt-4'}>{props.children}</div>
      </div>
    </Modal>
  )
}

export default PortfolioModalWrapper
