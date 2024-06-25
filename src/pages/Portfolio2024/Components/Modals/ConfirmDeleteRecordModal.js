import React, { useState } from 'react'
import PortfolioModalWrapper from './PortfolioModalWrapper'
import LtsButton from '../../../../components/LTSButtons/LTSButton'

function ConfirmDeleteRecordModal(props) {
  return (
    <PortfolioModalWrapper
      show={props.show}
      onHide={props.onHide}
      hideHeader={true}
    >
      <div
        className={
          'p-4 d-flex align-items-center justify-content-center flex-column h-100 gap-4'
        }
      >
        <div className={'publish-portfolio-title'}>
          {props.modalContent?.title}
        </div>
        <div className={'publish-portfolio-description'}>
          {props.modalContent?.description}
        </div>

        <div className={'d-flex flex-column gap-2 w-100'}>
          <LtsButton
            onClick={() => {
              props.modalContent?.action?.()
            }}
            name={'YES, DELETE'}
            borderRadius={36}
            backgroundColor={'#EE3C96'}
            width={'50%'}
          />
          <LtsButton
            onClick={props.onHide}
            name={'CANCEL & GO BACK'}
            backgroundColor={'#fff'}
            color={'#707070'}
          />
        </div>
      </div>
    </PortfolioModalWrapper>
  )
}

export default ConfirmDeleteRecordModal
