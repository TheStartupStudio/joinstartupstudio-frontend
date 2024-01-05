import React from 'react'
import ModalWrapper from '../../../components/Modals/Spotlight/ModalWrapper'
import LTSButton from '../../../components/LTSButtons/LTSButton'

const FinalStepModal = (props) => {
  return (
    <ModalWrapper
      show={props.show}
      onHide={props.onHide}
      showHeader={false}
      class={'my-spark__content-modal'}
    >
      <div className="mt-4 mb-5 blocked-user-modal px-md-3 text-center">
        <div
          className={'d-flex justify-content-center align-items-center'}
          style={{
            color: '#F2359D',
            fontWeight: 600,
            width: '100%',
            fontSize: 20
          }}
        >
          <div style={{ width: '100%' }}>
            Before you can take this step, you must complete the final step to
            make the content your own.
          </div>
        </div>
        <div
          className={
            'mt-4 d-flex flex-column justify-content-center align-items-center'
          }
        >
          <LTSButton
            name={`Final step`}
            width={'50%'}
            onClick={() => props.confirmFinalStep()}
          />
        </div>
      </div>
    </ModalWrapper>
  )
}
export default FinalStepModal
