import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import './GenerateInvoiceModal.css'

const GenerateInvoiceModal = ({ show, onHide, onGenerate }) => {
  const [loading, setLoading] = useState(false)
  const [organizationsLoading, setOrganizationsLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (show) {
      fetchOrganizations()
    }
  }, [show])

  const fetchOrganizations = async () => {
    setOrganizationsLoading(true)
    try {
      const response = await axiosInstance.get('/super-admin/organizations', {
        params: {
          page: 1,
          limit: 1000 // Get all organizations for the dropdown
        }
      })

      if (response.data.success) {
        setOrganizations(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      toast.error('Failed to load organizations')
    } finally {
      setOrganizationsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedOrganization) {
      toast.error('Please select an organization')
      return
    }

    setLoading(true)
    try {
      // Call the backend API to generate invoice
      const response = await axiosInstance.post(`/invoices/generate/${selectedOrganization}`)
      
      if (response.data.success) {
        toast.success('Invoice generated successfully!')
        onGenerate(response.data.data)
        onHide()
        setSelectedOrganization('')
      }
    } catch (error) {
      console.error('Error generating invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to generate invoice')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={true}
      keyboard={true}
      className="generate-invoice-modal"
      centered
    >
      <div className="generate-modal-content">
        <div className="d-flex flex-column gap-3">
          <div className="generate-modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 9.16699H12.0833H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 5.83301H12.0833H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66667 12.5V3.1C6.66667 2.76863 6.93529 2.5 7.26667 2.5H16.9C17.2314 2.5 17.5 2.76863 17.5 3.1V14.1667C17.5 16.0076 16.0076 17.5 14.1667 17.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.49935 12.5H6.66602H10.2327C10.5641 12.5 10.8359 12.7682 10.8662 13.0982C10.9879 14.4253 11.5521 17.5 14.166 17.5H6.66602H5.49935C3.84249 17.5 2.49935 16.1569 2.49935 14.5C2.49935 13.3954 3.39478 12.5 4.49935 12.5Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="generate-modal-title">Generate Invoice</h3>
        </div>

        <div className="modal-body-custom">
          <div className="form-section">

              <select
                className="form-control organization-select"
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                disabled={loading}
              >
                <option value="">Select Organization </option>
                {filteredOrganizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name} - {org.domain}
                  </option>
                ))}
              </select>

            {filteredOrganizations.length === 0 && !organizationsLoading && searchQuery && (
              <p className="text-muted mt-2">No organizations found matching "{searchQuery}"</p>
            )}
          </div>
        </div>

        <div className="modal-actions">
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
            className="generate-btn"
            onClick={handleSubmit}
            disabled={loading || !selectedOrganization}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              'GENERATE INVOICE'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default GenerateInvoiceModal