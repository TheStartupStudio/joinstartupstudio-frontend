import React from 'react'
import IntlMessages from '../../utils/IntlMessages'
import amazonWebservicesGraphic from '../../assets/images/amazon-webservices-graphic.png'
import partnershipSecurityGraphic from '../../assets/images/partnership-security-graphic.png'
import safeSecureGraphic from '../../assets/images/safe-secure-graphic.png'
import complianceStandardsGraphic from '../../assets/images/compliance-standards-graphic.png'

function SecurePage() {
  return (
    <div className='container-fluid mb-5'>
      <div className='secure-page-padding'>
        <div className='row mx-0'>
          <div className='col-12 col-md-9 order-2 order-md-0'>
            <h4 className='secure-sub-heading'>
              <IntlMessages id='lts_secure.partnership_for' />
            </h4>
            <h1 className='secure-heading'>
              <IntlMessages id='lts_secure.security' />
            </h1>
            <div className='secure-text'>
              <p>
                <IntlMessages id='lts_secure.security_paragraph' />
              </p>
            </div>
          </div>
          <div className='col-12 col-lg-3 col-md-3 mb-5 mb-md-0'>
            <img
              style={{ width: '85%' }}
              className='ms-4 ms-md-0'
              src={partnershipSecurityGraphic}
              alt='partnership security graphic'
            />
            <img
              className='mt-2 ms-4 ms-md-0'
              style={{ width: '85%' }}
              src={amazonWebservicesGraphic}
              alt='amazon webservices graphic'
            />
          </div>
        </div>
        <h4 className='secure-sub-heading mt-5'>
          <IntlMessages id='lts_secure.keeping_your_login' />
        </h4>
        <h1 className='secure-heading'>
          <IntlMessages id='lts_secure.safe_secure' />
        </h1>
        <div className='row mx-0 mt-3'>
          <div className='col-12 col-lg-3 col-md-3 text-center px-0 my-auto'>
            <img
              style={{ width: '47%' }}
              src={safeSecureGraphic}
              alt='safe secure graphic'
            />
          </div>
          <div className='col-12 col-lg-9 col-md-9 px-0 secure-text'>
            <p>
              <IntlMessages id='lts_secure.safe_secure_paragraph_1' />
            </p>
            <p>
              <IntlMessages id='lts_secure.safe_secure_paragraph_2' />
            </p>
            <p>
              <IntlMessages id='lts_secure.safe_secure_paragraph_3' />
            </p>
          </div>
        </div>
        <h4 className='secure-sub-heading mt-5'>
          <IntlMessages id='lts_secure.globally_recognized' />
        </h4>
        <h1 className='secure-heading'>
          <IntlMessages id='lts_secure.compliance_standards' />
        </h1>
        <div className='row mx-0 mt-3'>
          <div className='col-12 col-lg-9 col-md-9 px-0 secure-text'>
            <p>
              <IntlMessages id='lts_secure.compliance_standards_paragraph_1' />
            </p>
            <p>
              <IntlMessages id='lts_secure.compliance_standards_paragraph_2' />
            </p>
            <p>
              <IntlMessages id='lts_secure.compliance_standards_paragraph_3' />
            </p>
          </div>
          <div className='col-12 col-lg-3 col-md-3 text-center px-0 my-auto'>
            <img
              style={{ width: '50%' }}
              src={complianceStandardsGraphic}
              alt='compliance standards graphic'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurePage
