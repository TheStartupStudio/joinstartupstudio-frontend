import React from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import copy from '../../../assets/images/copy.svg'
import { toast } from 'react-toastify'
import { FormattedMessage } from 'react-intl'
import ModalWrapper from '../Spotlight/ModalWrapper'

const ShareMyPortfolio = (props) => {
  return (
    <ModalWrapper
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      className="mt-4"
    >
      <div className="edit-modal w-100 ">
        <span
          className="text-uppercase ps-0 pt-2 d-inline-block w-auto"
          style={{
            textAlign: ' left',
            font: ' normal normal 600 20px/24px Montserrat',
            letterSpacing: ' 0px',
            color: '#333D3D',
            textTransform: ' uppercase',
            opacity: 1
          }}
        >
          <IntlMessages id="my_account.share_my_portfolio" />
        </span>
      </div>
      <div
        className="input-group mb-3 "
        style={{ borderRight: '0px !important' }}
      >
        <FormattedMessage id="modal.Public_Portfolio_link_will_automatically_appear_here">
          {(placeholder) => (
            <input
              type="text"
              className="form-control my-2 py-2 px-2  portfolio-modal-border-remove"
              style={{ outline: '0 !important', backgroundColor: '#ffff' }}
              value={
                window.location.origin + '/user-portfolio/' + props.userLink
              }
              disabled
              placeholder={placeholder}
            />
          )}
        </FormattedMessage>
        <span
          className="input-group-text bg-transparent text-dark my-2 px-4 "
          style={{ borderLeft: '0px !important' }}
          onClick={() => {
            toast.success(<IntlMessages id="general.copy" />)
            navigator.clipboard.writeText(
              window.location.origin + '/user-portfolio/' + props.userLink
            )
          }}
        >
          <span className="me-1 copy-portfolio-span">
            <IntlMessages id="general.copy_1" />{' '}
            <img src={copy} width="22px" className="ms-1" />
          </span>
        </span>
      </div>
    </ModalWrapper>
  )
}
export default ShareMyPortfolio
