import React from 'react'
import { Modal } from 'react-bootstrap'
import SectionActions from '../Actions/SectionActions'
import SwitchIcon from '../Actions/SwitchIcon'
import LabeledSwitchInput from '../Actions/LabeledSwitchInput'

function PortfolioModalWrapper(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='portfolio-modal-wrapper'
      className={` portfolio-modal-wrapper ${props.class ? props.class : ''} `}
    >
      <SectionActions actions={props.actions} />
      <div className={'p-2 mt-3 w-100  portfolio-modal-content'}>
        <div
          className={'d-flex w-100'}
          style={{
            borderBottom: '1px solid #e3e3e3'
          }}
        >
          <div
            className={`w-100 d-flex ${
              props.showSectionCheckbox
                ? 'justify-content-between'
                : 'justify-content-start'
            }`}
            style={{ width: '80%', padding: '15px 0px' }}
          >
            {!props.hideHeader && (
              <div
                style={{
                  font: 'normal normal bold 22px/15px Montserrat',
                  letterSpacing: 0.88,
                  color: '#231F20'
                  // borderBottom: '1px solid #e3e3e3'
                }}
                className={
                  'text-uppercase d-flex align-items-center portfolio-modal-title'
                }
              >
                {props.title}
              </div>
            )}
            {props.showSectionCheckbox && (
              <div style={{ marginRight: 90 }}>
                <LabeledSwitchInput
                  label={'Show section'}
                  labelDirection={'left'}
                  value={props.isShownSection}
                  onChange={(value) => {
                    props.onToggleSection?.(!value)
                  }}
                  name={props.switchName}
                  id={props.switchId}
                  isToggling={props.isTogglingSection}
                />
              </div>
            )}
          </div>
        </div>

        <div className={'mt-4'}>{props.children}</div>
      </div>
    </Modal>
  )
}

export default PortfolioModalWrapper
