import React from 'react'
import ModalWrapper from './Spotlight/ModalWrapper'

function PeerSharingModal(props) {
  return (
    <ModalWrapper show={props.show} onHide={props.onHide}>
      <div
        className={'text-center p-4'}
        style={{
          font: 'normal normal 400 16px/20px Montserrat',
          letterSpacing: 0,
          color: '#231f20'
        }}
      >
        In My Classroom you are connected to your peers. Every student chooses
        whether or not their peers can view their portfolios. By clicking I
        Accept below, you are accepting the responsibility of treating your
        peers with respect. You will not screenshot or capture any of their
        portfolio information or share this information in any form. You accept
        being a respectful peer who can offer in class feedback and be inspired
        to make changes to your own portfolios.
      </div>
      <div className="d-flex align-items-center justify-content-center mt-3">
        <input
          type="checkbox"
          name="agree"
          className="form-check-input spotlight-checkbox mt-0"
          checked={props.peerSharingAccepted}
          onChange={(e) => {
            props.handleChange(e.target.checked)
          }}
        />
        <span
          className="term ps-3"
          style={{
            font: 'normal normal 400 16px/20px Montserrat',
            letterSpacing: 0,
            color: '#231f20'
          }}
        >
          I accept
        </span>
      </div>
    </ModalWrapper>
  )
}

export default PeerSharingModal
