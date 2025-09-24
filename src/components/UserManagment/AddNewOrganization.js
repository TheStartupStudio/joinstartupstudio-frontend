import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faUser, faGlobe, faDollarSign, faPencilAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import './AddNewOrganization.css'
import newCity from '../../assets/images/academy-icons/svg/city.svg'
import spark from '../../assets/images/academy-icons/svg/spark.svg'
import AcademyBtn from '../AcademyBtn'

// Dummy data for testing edit mode
const DUMMY_ORGANIZATION_DATA = {
  id: 1,
  organizationName: 'Nord Anglia Schools',
  organizationAddress: '2108 S Conroy-Windermere Rd, Orlando, FL 34706',
  administratorName: 'Angela Nguyen',
  administratorEmail: 'anguyen@nordanglia.com',
  domainURL: 'nordanglia.aie.com',
  pricingTiers: [
    {
      amount: '$15',
      frequency: 'monthly'
    },
    {
      amount: '$150',
      frequency: 'yearly'
    }
  ]
}

const AddNewOrganization = ({ show, onHide, onSuccess, mode = 'add', organizationData = null }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationAddress: '',
    administratorName: '',
    administratorEmail: '',
    domainURL: '',
    pricingTiers: [
      {
        amount: '',
        frequency: 'monthly'
      }
    ]
  })

  const frequencyOptions = [
    { value: 'monthly', label: 'Per month' },
    { value: 'yearly', label: 'Per year' },
    { value: 'one-time', label: 'One-time' }
  ]

  // Initialize form data when in edit or view mode
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      // Always use dummy data for edit and view modes, ignore organizationData props
      setFormData({
        id: DUMMY_ORGANIZATION_DATA.id,
        organizationName: DUMMY_ORGANIZATION_DATA.organizationName,
        organizationAddress: DUMMY_ORGANIZATION_DATA.organizationAddress,
        administratorName: DUMMY_ORGANIZATION_DATA.administratorName,
        administratorEmail: DUMMY_ORGANIZATION_DATA.administratorEmail,
        domainURL: DUMMY_ORGANIZATION_DATA.domainURL,
        pricingTiers: DUMMY_ORGANIZATION_DATA.pricingTiers
      })
    } else {
      // Reset form for add mode
      setFormData({
        organizationName: '',
        organizationAddress: '',
        administratorName: '',
        administratorEmail: '',
        domainURL: '',
        pricingTiers: [
          {
            amount: '',
            frequency: 'monthly'
          }
        ]
      })
    }
  }, [mode, show])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePricingChange = (index, field, value) => {
    const updatedTiers = [...formData.pricingTiers]
    updatedTiers[index][field] = value
    setFormData(prev => ({
      ...prev,
      pricingTiers: updatedTiers
    }))
  }

  const addNewPricingTier = () => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: [
        ...prev.pricingTiers,
        {
          amount: '',
          frequency: 'monthly'
        }
      ]
    }))
  }

  const removePricingTier = (index) => {
    if (formData.pricingTiers.length > 1) {
      const updatedTiers = formData.pricingTiers.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        pricingTiers: updatedTiers
      }))
    }
  }

  const validateForm = () => {
    const { organizationName, administratorName, administratorEmail, domainURL } = formData
    
    if (!organizationName.trim()) {
      toast.error('Organization name is required')
      return false
    }
    
    if (!administratorName.trim()) {
      toast.error('Administrator name is required')
      return false
    }
    
    if (!administratorEmail.trim()) {
      toast.error('Administrator email is required')
      return false
    }
    
    if (!domainURL.trim()) {
      toast.error('Domain URL is required')
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(administratorEmail)) {
      toast.error('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (mode === 'edit') {
        // Simulate update existing organization
        console.log('Updating organization:', formData)
        toast.success('Organization updated successfully!')
      } else {
        // Simulate create new organization
        console.log('Creating new organization:', formData)
        toast.success('Organization added successfully!')
      }
      
      onSuccess()
      onHide()
      
      // Reset form only if adding new
      if (mode === 'add') {
        setFormData({
          organizationName: '',
          organizationAddress: '',
          administratorName: '',
          administratorEmail: '',
          domainURL: '',
          pricingTiers: [
            {
              amount: '',
              frequency: 'monthly'
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error saving organization:', error)
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} organization`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    onHide()
  }

  const handleInputFocus = (inputId) => {
    const inputElement = document.getElementById(inputId)
    if (inputElement) {
      inputElement.focus()
    }
  }

  const isEditMode = mode === 'edit'
  const isViewMode = mode === 'view'
  const isReadOnly = isViewMode

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      className="add-organization-modal"
      centered
      size="lg"
    >
      <div className="modal-content-wrapper">
        {/* Header */}
        <div className="modal-header-custom">
          <div className="header-icon">
           <img src={newCity} />
          </div>
          <h3 className="modal-title">
            {isViewMode ? 'View Organization' : isEditMode ? 'Edit Organization' : 'Add New Organization'}
          </h3>
        </div>

        {/* Organization Details Section */}
        <div className="form-section">
          <div className="section-header">
            <img src={spark} alt="Spark Icon" />
            <span>Organization Details</span>
          </div>
          
          <div className="input-group" onClick={() => !isReadOnly && handleInputFocus('organizationName')}>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => !isReadOnly && handleInputChange('organizationName', e.target.value)}
              className="form-input"
              placeholder=" "
              id="organizationName"
              disabled={isReadOnly}
            />
            <label className="input-label" htmlFor="organizationName">Organization Name</label>
            {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
          </div>

          <div className="input-group" onClick={() => !isReadOnly && handleInputFocus('organizationAddress')}>
            <input
              type="text"
              value={formData.organizationAddress}
              onChange={(e) => !isReadOnly && handleInputChange('organizationAddress', e.target.value)}
              className="form-input"
              placeholder=" "
              id="organizationAddress"
              disabled={isReadOnly}
            />
            <label className="input-label" htmlFor="organizationAddress">Address</label>
            {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
          </div>
        </div>

        {/* Administrator Details Section */}
        <div className="form-section">
          <div className="section-header">
            <img src={spark} alt="Spark Icon" />
            <span>Administrator Details</span>
          </div>
          
          <div className="input-group" onClick={() => !isReadOnly && handleInputFocus('administratorName')}>
            <input
              type="text"
              value={formData.administratorName}
              onChange={(e) => !isReadOnly && handleInputChange('administratorName', e.target.value)}
              className="form-input"
              placeholder=" "
              id="administratorName"
              disabled={isReadOnly}
            />
            <label className="input-label" htmlFor="administratorName">Administrator Name</label>
            {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
          </div>

          <div className="input-group" onClick={() => !isReadOnly && handleInputFocus('administratorEmail')}>
            <input
              type="email"
              value={formData.administratorEmail}
              onChange={(e) => !isReadOnly && handleInputChange('administratorEmail', e.target.value)}
              className="form-input"
              placeholder=" "
              id="administratorEmail"
              disabled={isReadOnly}
            />
            <label className="input-label" htmlFor="administratorEmail">Administrator Email</label>
            {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
          </div>
        </div>

        {/* Domain Details Section */}
        <div className="form-section">
          <div className="section-header">
            <img src={spark} alt="Spark Icon" />
            <span>Domain Details</span>
          </div>
          
          <div className="input-group" onClick={() => !isReadOnly && handleInputFocus('domainURL')}>
            <input
              type="text"
              value={formData.domainURL}
              onChange={(e) => !isReadOnly && handleInputChange('domainURL', e.target.value)}
              className="form-input"
              placeholder=" "
              id="domainURL"
              disabled={isReadOnly}
            />
            <label className="input-label" htmlFor="domainURL">Domain URL</label>
            {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
          </div>
        </div>

        {/* Pricing Details Section */}
        <div className="form-section">
          <div className="section-header">
            <img src={spark} alt="Spark Icon" />
            <span>Pricing Details</span>
          </div>
          
          {formData.pricingTiers.map((tier, index) => (
            <div key={index} className="pricing-tier">
              <div className="pricing-inputs">
                <div className="input-group pricing-amount" onClick={() => !isReadOnly && handleInputFocus(`pricingAmount-${index}`)}>
                  <input
                    type="text"
                    value={tier.amount}
                    onChange={(e) => !isReadOnly && handlePricingChange(index, 'amount', e.target.value)}
                    className="form-input"
                    placeholder=" "
                    id={`pricingAmount-${index}`}
                    disabled={isReadOnly}
                  />
                  <label className="input-label" htmlFor={`pricingAmount-${index}`}>Price</label>
                  {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                </div>

                <div className="frequency-dropdown">
                  <select
                    value={tier.frequency}
                    onChange={(e) => !isReadOnly && handlePricingChange(index, 'frequency', e.target.value)}
                    className="frequency-select"
                    disabled={isReadOnly}
                  >
                    {frequencyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {!isReadOnly && formData.pricingTiers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePricingTier(index)}
                  className="remove-tier-btn"
                  title="Remove pricing tier"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          ))}

          {!isReadOnly && (
            <button
              type="button"
              onClick={addNewPricingTier}
              className="add-pricing-tier-btn"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add new pricing tier
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          {isViewMode ? (
            <div className="full-width-btn">
              <AcademyBtn 
                title="View Organization Learners"
                onClick={handleClose}
              />
            </div>
          ) : (
            <>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClose}
                disabled={loading}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  isEditMode ? 'SAVE CHANGES' : 'ADD ORGANIZATION'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default AddNewOrganization