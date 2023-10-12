import React, { useEffect, useState } from 'react'
import ModalWrapper from './Spotlight/ModalWrapper'
import { useHistory } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'

function PeerSharingModal(props) {
  const history = useHistory()

  // useEffect(() => {
  //   if (peerSharingAccepted) {
  //     history.push('/my-classroom')
  //     props.onHide()
  //   }
  // }, [peerSharingAccepted])

  return (
    <ModalWrapper show={props.show} onHide={props.onHide}>
      <div>
        In My Classroom you are connected to your peers. Every student chooses
        whether or not their peers can view their portfolios. By clicking I
        Accept below, you are accepting the responsibility of treating your
        peers with respect. You will not screenshot or capture any of their
        portfolio information or share this information in any form. You accept
        being a respectful peer who can offer in class feedback and be inspired
        to make changes to your own portfolios.
      </div>
      <div className="d-flex align-items-center">
        <input
          type="checkbox"
          name="agree"
          className="form-check-input spotlight-checkbox"
          checked={props.peerSharingAccepted}
          onChange={(e) => {
            props.handleChange(e.target.checked)
          }}
        />
        <span className="term ps-3">I accept</span>
      </div>
    </ModalWrapper>
  )
}

export default PeerSharingModal
