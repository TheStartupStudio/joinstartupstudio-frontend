import React, { useState } from 'react'
import PortfolioModalWrapper from './PortfolioModalWrapper'
import LtsButton from '../../../../components/LTSButtons/LTSButton'

function ConfirmVisibilityModal(props) {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked)
  }

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
          {props.modalContent?.title ??
            'YOU’RE ABOUT TO PUBLISH YOUR PORTFOLIO.'}
        </div>
        <div className={'publish-portfolio-description'}>
          {props.modalContent?.description ??
            'Once you publish your portfolio, others will be able to view it.'}
        </div>

        {props.modalContent?.containCheckbox ? (
          <div className="form-check px-5 mx-5">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              onChange={handleCheckboxChange}
            />
            <label
              className="form-check-label confirm-visibility-checkbox-label"
              htmlFor="flexCheckDefault"
            >
              {props.modalContent?.checkboxContent}
            </label>
          </div>
        ) : (
          <></>
        )}
        <div className={'d-flex flex-column gap-2 w-100'}>
          <LtsButton
            onClick={() => {
              if (props.modalContent?.containCheckbox) {
                if (isChecked) {
                  props.modalContent?.action?.()
                }
              } else {
                props.modalContent?.action?.()
              }
            }}
            name={
              props.modalContent?.actionTitle ?? 'YES, PUBLISH MY PORTFOLIO'
            }
            borderRadius={36}
            backgroundColor={'#EE3C96'}
            width={'50%'}
            disabled={isChecked}
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

export default ConfirmVisibilityModal
