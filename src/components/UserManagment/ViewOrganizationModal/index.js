import React from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import AcademyBtn from '../../AcademyBtn'

const ViewOrganizationModal = ({ show, onHide, organizationData }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      className="view-organization-modal"
    >
      <Modal.Header className="view-org-modal-header">
        <button 
          className="back-button"
          onClick={onHide}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5.83301 7.50833L5.84134 7.49907" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.16699 7.50833L9.17533 7.49907" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.83301 10.8416L5.84134 10.8323" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.16699 10.8416L9.17533 10.8323" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.83301 14.1751L5.84134 14.1658" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.16699 14.1751L9.17533 14.1658" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.5 17.5H3.1C2.76863 17.5 2.5 17.2314 2.5 16.9V4.76667C2.5 4.4353 2.76863 4.16667 3.1 4.16667H7.5V3.1C7.5 2.76863 7.76863 2.5 8.1 2.5H11.9C12.2314 2.5 12.5 2.76863 12.5 3.1V7.5M12.5 17.5H16.9C17.2314 17.5 17.5 17.2314 17.5 16.9V8.1C17.5 7.76863 17.2314 7.5 16.9 7.5H12.5M12.5 17.5V14.1667M12.5 7.5V10.8333M12.5 10.8333H14.1667M12.5 10.8333V14.1667M12.5 14.1667H14.1667" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <h5 className="modal-title">View Organization</h5>
      </Modal.Header>

      <Modal.Body className="view-org-modal-body">
        {/* Organization Details Section */}
        <div className="org-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3587_14186)">
                    <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_3587_14186">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
            <span>Organization Details</span>
          </div>
          <div className="org-details">
            <div className="org-name">{organizationData?.name || 'Nord Anglia Schools'}</div>
            <div className="org-address">
              {organizationData?.address || '2108 S Conroy-Windermere Rd, Orlando, FL 34708'}
            </div>
          </div>
        </div>

        {/* Organizational Mark & Logo Section */}
        <div className="org-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3587_14757)">
                    <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_3587_14757">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
                </svg>
            <span>Organizational Mark & Logo</span>
            <button className="edit-btn">
              <span>Edit Mark or Logo</span>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
          <div className="org-logos">
            <img 
              src={organizationData?.logo1 || 'https://via.placeholder.com/120'} 
              alt="Organization Logo 1" 
              className="org-logo"
            />
            <img 
              src={organizationData?.logo2 || 'https://via.placeholder.com/200x50'} 
              alt="Organization Logo 2" 
              className="org-logo-horizontal"
            />
          </div>
        </div>

        {/* Administrator Details Section */}
        <div className="org-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3587_14757)">
                    <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_3587_14757">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
                </svg>
            <span>Administrator Details</span>
            <button className="edit-btn">
              <span>Edit Administrator Details</span>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
          <div className="admin-details">
            <div className="admin-name">{organizationData?.adminName || 'Angela Nguyen'}</div>
            <div className="admin-email">{organizationData?.adminEmail || 'anguyen@ordanglia.com'}</div>
          </div>
        </div>

        {/* Domain Details Section */}
        <div className="org-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3587_14757)">
                    <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_3587_14757">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
                </svg>
            <span>Domain Details</span>
          </div>
          <div className="domain-details">
            {organizationData?.domain || 'nordanglia.aie.com'}
          </div>
        </div>

        {/* Pricing Details Section */}
        <div className="org-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3587_14757)">
                    <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_3587_14757">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
                </svg>
            <span>Pricing Details</span>
            <button className="edit-btn">
              <span>Edit Pricing Details</span>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
          <div className="pricing-details">
            {organizationData?.pricing?.map((price, index) => (
              <div key={index} className="pricing-item">
                <div className="price-item-conatiner">
                  <div className="pricing-label">Price:</div>
                  <div className="pricing-value">${price.amount}</div>
                </div>
                <div className="pricing-frequency">{price.frequency}</div>
              </div>
            )) || (
              <>
                <div className="pricing-item">
                  <div className="pricing-label">Price:</div>
                  <div className="pricing-value">$15</div>
                  <div className="pricing-frequency">Per month</div>
                </div>
                <div className="pricing-item">
                  <div className="pricing-label">Price:</div>
                  <div className="pricing-value">$150</div>
                  <div className="pricing-frequency">Per year</div>
                </div>
              </>
            )}
          </div>
        </div>

         <AcademyBtn
                      title="VIEW ORGANIZATION LEARNERS"
                      
                    />
      </Modal.Body>
    </Modal>
  )
}

export default ViewOrganizationModal