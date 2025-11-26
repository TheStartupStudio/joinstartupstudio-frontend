import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import '../AlertPopup/index.css'

const GenerateMultipleInvoicesPopup = ({ show, onHide, onConfirm, selectedOrganizations = [] }) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (selectedOrganizations.length === 0) {
      toast.error('No organizations selected')
      return
    }

    setLoading(true)
    try {
      // Generate invoices for each selected organization
      const generatePromises = selectedOrganizations.map(org =>
        axiosInstance.post(`/invoices/generate/${org.id}`)
      )

      const results = await Promise.allSettled(generatePromises)
      
      const succeeded = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      if (succeeded > 0) {
        toast.success(`${succeeded} invoice(s) generated successfully!`)
      }
      
      if (failed > 0) {
        toast.warning(`${failed} invoice(s) failed to generate`)
      }

      onConfirm()
      onHide()
    } catch (error) {
      console.error('Error generating invoices:', error)
      toast.error('Failed to generate invoices')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={true}
      keyboard={true}
      className="generate-multiple-popup"
      centered
    >
      <div className="popup-content">
        <div className="popup-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#FFF4E5"/>
            <path d="M24 16V26M24 30H24.01" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h3 className="popup-title">Generate Multiple Invoices?</h3>
        
        <p className="popup-message">
          You are about to generate invoices for {selectedOrganizations.length} organization(s). 
          This will create new invoices based on each organization's current pricing and active user count.
        </p>

        <div className="popup-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onHide}
            disabled={loading}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              'YES, GENERATE INVOICES'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default GenerateMultipleInvoicesPopup