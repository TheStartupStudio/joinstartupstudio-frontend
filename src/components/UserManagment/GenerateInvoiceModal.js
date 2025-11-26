import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import './GenerateInvoiceModal.css'

const GenerateInvoiceModal = ({ show, onHide, onGenerate }) => {
  const [selectedOrganization, setSelectedOrganization] = useState('')

  // Dummy organizations data
  const organizations = [
    { id: 1, name: 'Tech Solutions Inc' },
    { id: 2, name: 'Educational Services LLC' },
    { id: 3, name: 'Future Academy' },
    { id: 4, name: 'Learning Hub Corp' },
    { id: 5, name: 'Innovation Institute' }
  ]

  const handleGenerate = () => {
    if (!selectedOrganization) {
      return
    }
    
    const selectedOrg = organizations.find(org => org.id === parseInt(selectedOrganization))
    onGenerate(selectedOrg)
    onHide()
  }

  const handleCancel = () => {
    setSelectedOrganization('')
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      backdrop={true}
      keyboard={true}
      className="generate-invoice-modal"
      centered
      size="lg"
    >
      <div className="generate-modal-content">

        <div className="d-flex flex-column gap-2">
            <div className="generate-modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83398 7.50032L10.0007 10.417L14.1673 7.50032" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.66602 13.8337V6.16699C1.66602 5.06242 2.56145 4.16699 3.66602 4.16699H16.3327C17.4373 4.16699 18.3327 5.06242 18.3327 6.16699V13.8337C18.3327 14.9382 17.4373 15.8337 16.3327 15.8337H3.66602C2.56145 15.8337 1.66602 14.9382 1.66602 13.8337Z" stroke="black" stroke-width="1.5"/>
            </svg>
            </div>

            <h4 className="generate-modal-title">Generate Invoice</h4>
        </div>

        <div className="generate-modal-body">
          <div className="form-group">
            <select
              className="organization-select"
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
            >
              <option value="">Select Organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button 
              className="cancel-btn"
              onClick={handleCancel}
            >
              CANCEL
            </button>
            <button 
              className="generate-btn"
              onClick={handleGenerate}
              disabled={!selectedOrganization}
            >
              GENERATE INVOICE
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default GenerateInvoiceModal