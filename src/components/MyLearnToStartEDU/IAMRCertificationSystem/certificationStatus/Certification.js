import React from 'react'
import LTSLogo from '../../../../assets/images/LTS-logo-horizontal.png'
import SusLogo from '../../../../assets/images/sus-logo-full-color.png'
import CertificationBadge1 from '../../../../assets/images/market-ready-1-badge.png'
import CertificationBadge2 from '../../../../assets/images/market-ready-2-badge.png'

const Certification = (props) => {
  return (
    <div
      className="certificate-container"
      style={{ backgroundColor: 'rgb(224 231 243)' }}
    >
      <div className="certification-header">
        <img className="" src={LTSLogo} alt="" />
        <span className="px-2 ">
          <h4>
            Certificate of <br />
          </h4>
          <h1 style={{ color: '#222' }}>COMPLETION</h1>
        </span>
      </div>

      <div className="user-info_container">
        <h4>{props.user.toUpperCase()}</h4>
        <p>
          has met all requirements for <br />
        </p>
        <h6>Learn to Start Market-Ready Certification Level {props.id}</h6>
      </div>

      <span className="certification-date">
        <p>Date issued : </p>
        <p>{new Date(props.completionDate).toLocaleDateString()}</p>
      </span>

      <div className="certification-footer">
        <div className="footer-logo__div">
          <img src={SusLogo} alt="" />
        </div>
        <div className="footer-info__div">
          <h4>Anastasia Hall</h4>
          <h6>
            Anastasia Hall <br />
          </h6>
          <small>Director of Education</small>
        </div>
        <div className="footer-badge__div">
          <img
            src={`${
              props.id === '1' ? CertificationBadge1 : CertificationBadge2
            } `}
            alt=""
          />
        </div>
      </div>
    </div>
  )
}

export default Certification
