import React from 'react'
import ModalWrapper from '../../components/Modals/Spotlight/ModalWrapper'
import LTSButton from '../../components/LTSButtons/LTSButton'

const DeleteArchiveModal = (props) => {
  return (
    <ModalWrapper
      show={props.show}
      onHide={props.onHide}
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
            Are you sure you want to delete this {props.title}?
          </div>
        </div>
        <div
          className={
            'mt-2 d-flex flex-column justify-content-center align-items-center'
          }
        >
          <LTSButton
            name={`Yes, Delete This ${props.title}`}
            width={'50%'}
            onClick={() => props.onDelete()}
          />
          <div className={'w-50 mt-2'}>
            <LTSButton
              name={`No, Keep this ${props.title}`}
              onClick={() => props.onHide()}
              backgroundColor={'inherit'}
              color={'#BBBDBF'}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>
  )
}
export default DeleteArchiveModal
