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
import ViewOrganizationLearnersModal from './ViewOrganizationLearnersModal'
import PricingChangeModal from './PricingChangeModal'
import ViewOrganizationInvoicesModal from './ViewOrganizationInvoicesModal'

const AddNewOrganization = ({ show, onHide, onSuccess, mode = 'add', organizationData = null }) => {
  const [loading, setLoading] = useState(false)
  const [showLearnersModal, setShowLearnersModal] = useState(false)
  const [showInvoicesModal, setShowInvoicesModal] = useState(false)
  const [showPricingChangeModal, setShowPricingChangeModal] = useState(false)
  const [pendingSave, setPendingSave] = useState(false)
  const [invoiceHistory, setInvoiceHistory] = useState([])
  const [originalPricing, setOriginalPricing] = useState({
    organizationPricing: { amount: '', frequency: 'monthly' },
    learnerPricing: []
  })
  const [activeTab, setActiveTab] = useState('details')
  
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationAddress: '',
    city: '',
    state: '',
    zipCode: '',
    administratorName: '',
    administratorEmail: '',
    domainURL: '',
    courseAccess: {
      financialLiteracyJournal: false,
      forumAccess: false,
      leadershipJournal: false,
      masterClasses: false
    },
    organizationPricing: {
      amount: '',
      frequency: 'monthly'
    },
    learnerPricing: [
      {
        amount: '',
        frequency: 'monthly'
      }
    ]
  })

  const frequencyOptions = [
    { value: 'monthly', label: 'Per month' },
    { value: 'yearly', label: 'Per year' },
    { value: '6-month', label: 'Every 6 Months' },
    { value: 'one-time', label: 'One-time' }
  ]

  const courseAccessLabels = {
    financialLiteracyJournal: 'Financial Literacy Journal',
    forumAccess: 'Forum Access',
    leadershipJournal: 'Leadership Journal',
    masterClasses: 'Master Classes'
  }

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if ((mode === 'edit' || mode === 'view') && organizationData?.id) {
        try {
          setLoading(true)
          const response = await axiosInstance.get(`/super-admin/organizations/${organizationData.id}`)
          
          if (response.data.success) {
            const orgData = response.data.data
            
            // Set invoice history if available
            if (orgData.invoices?.history) {
              setInvoiceHistory(orgData.invoices.history)
            }
            
            setFormData({
              id: orgData.id,
              organizationName: orgData.organizationName || '',
              organizationAddress: orgData.organizationAddress || '',
              city: orgData.city || '',
              state: orgData.state || '',
              zipCode: orgData.zipCode || '',
              administratorName: orgData.administratorName || '',
              administratorEmail: orgData.administratorEmail || '',
              domainURL: orgData.domainURL || '',
              courseAccess: orgData.courseAccess || {
                financialLiteracyJournal: false,
                forumAccess: false,
                leadershipJournal: false,
                masterClasses: false
              },
              organizationPricing: orgData.organizationPricing || {
                amount: '',
                frequency: 'monthly'
              },
              learnerPricing: orgData.learnerPricing?.length > 0 
                ? orgData.learnerPricing 
                : [{ amount: '', frequency: 'monthly' }]
            })
            
            setOriginalPricing({
              organizationPricing: JSON.parse(JSON.stringify(orgData.organizationPricing || { amount: '', frequency: 'monthly' })),
              learnerPricing: JSON.parse(JSON.stringify(orgData.learnerPricing || []))
            })
          }
        } catch (error) {
          console.error('Error fetching organization:', error)
          toast.error('Failed to load organization data')
        } finally {
          setLoading(false)
        }
      } else {
        setFormData({
          organizationName: '',
          organizationAddress: '',
          city: '',
          state: '',
          zipCode: '',
          administratorName: '',
          administratorEmail: '',
          domainURL: '',
          courseAccess: {
            financialLiteracyJournal: false,
            forumAccess: false,
            leadershipJournal: false,
            masterClasses: false
          },
          organizationPricing: {
            amount: '',
            frequency: 'monthly'
          },
          learnerPricing: [
            {
              amount: '',
              frequency: 'monthly'
            }
          ]
        })
        setOriginalPricing({
          organizationPricing: { amount: '', frequency: 'monthly' },
          learnerPricing: []
        })
        setInvoiceHistory([])
      }
    }

    if (show) {
      fetchOrganizationData()
    }
  }, [mode, organizationData, show])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCourseAccessChange = (course) => {
    setFormData(prev => ({
      ...prev,
      courseAccess: {
        ...prev.courseAccess,
        [course]: !prev.courseAccess[course]
      }
    }))
  }

  const handleOrganizationPricingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      organizationPricing: {
        ...prev.organizationPricing,
        [field]: value
      }
    }))
  }

  const handleLearnerPricingChange = (index, field, value) => {
    const updatedTiers = [...formData.learnerPricing]
    updatedTiers[index][field] = value
    setFormData(prev => ({
      ...prev,
      learnerPricing: updatedTiers
    }))
  }

  const addNewLearnerPricingTier = () => {
    setFormData(prev => ({
      ...prev,
      learnerPricing: [
        ...prev.learnerPricing,
        {
          amount: '',
          frequency: 'monthly'
        }
      ]
    }))
  }

  const removeLearnerPricingTier = (index) => {
    if (formData.learnerPricing.length > 1) {
      const updatedTiers = formData.learnerPricing.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        learnerPricing: updatedTiers
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(administratorEmail)) {
      toast.error('Please enter a valid email address')
      return false
    }

    return true
  }

  const hasPricingChanged = () => {
    if (mode !== 'edit') return false
    
    const orgPricingChanged = 
      formData.organizationPricing.amount !== originalPricing.organizationPricing.amount ||
      formData.organizationPricing.frequency !== originalPricing.organizationPricing.frequency
    
    if (formData.learnerPricing.length !== originalPricing.learnerPricing.length) {
      return true
    }

    const learnerPricingChanged = formData.learnerPricing.some((tier, index) => {
      const original = originalPricing.learnerPricing[index]
      if (!original) return true
      return tier.amount !== original.amount || tier.frequency !== original.frequency
    })

    return orgPricingChanged || learnerPricingChanged
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    if (mode === 'edit' && hasPricingChanged()) {
      setPendingSave(true)
      setShowPricingChangeModal(true)
      return
    }

    await performSave(false)
  }

  const handlePricingChangeConfirm = async (applyToCurrentUsers) => {
    setShowPricingChangeModal(false)
    await performSave(applyToCurrentUsers)
  }

  const performSave = async (applyToCurrentUsers) => {
    setLoading(true)
    try {
      const payload = {
        organizationName: formData.organizationName,
        organizationAddress: formData.organizationAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        administratorName: formData.administratorName,
        administratorEmail: formData.administratorEmail,
        domainURL: formData.domainURL,
        courseAccess: formData.courseAccess,
        organizationPricing: formData.organizationPricing,
        learnerPricing: formData.learnerPricing,
        applyToCurrentUsers
      }

      let response
      if (mode === 'edit') {
        response = await axiosInstance.put(`/super-admin/organizations/${formData.id}`, payload)
        toast.success('Organization updated successfully!')
        
        try {
          await axiosInstance.post('/super-admin/organizations/sync-all-stripe-prices')
        } catch (syncError) {
          toast.warning('Organization updated, but failed to sync Stripe prices')
        }
      } else {
        response = await axiosInstance.post('/super-admin/organizations', payload)
        toast.success('Organization added successfully!')
        
        try {
          await axiosInstance.post('/super-admin/organizations/sync-all-stripe-prices')
        } catch (syncError) {
          toast.warning('Organization created, but failed to sync Stripe prices')
        }
      }
      
      onSuccess()
      onHide()
      setPendingSave(false)
    } catch (error) {
      console.error('Error saving organization:', error)
      toast.error(error.response?.data?.message || `Failed to ${mode === 'edit' ? 'update' : 'add'} organization`)
    } finally {
      setLoading(false)
      setPendingSave(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setShowPricingChangeModal(false)
    setPendingSave(false)
    onHide()
  }

  const handleInputFocus = (inputId) => {
    const inputElement = document.getElementById(inputId)
    if (inputElement) {
      inputElement.focus()
    }
  }

  const handleViewLearners = () => {
    onHide()
    setTimeout(() => {
      setShowLearnersModal(true)
    }, 100)
  }

  const handleLearnersModalClose = () => {
    setShowLearnersModal(false)
  }

  const handleViewInvoices = () => {
    setShowInvoicesModal(true)
  }

  const handleInvoicesModalClose = () => {
    setShowInvoicesModal(false)
  }

  const isEditMode = mode === 'edit'
  const isViewMode = mode === 'view'
  const isReadOnly = isViewMode

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop={true}
        keyboard={true}
        className="add-organization-modal"
        centered
        size="lg"
      >
        <div className="modal-content-wrapper">
          <div className="modal-header-custom">
            <div className="header-icon">
             <img src={newCity} alt="Organization" />
            </div>
            <h3 className="modal-title">
              {isViewMode ? 'View Organization' : isEditMode ? 'Edit Organization' : 'Add New Organization'}
            </h3>
          </div>

          <div className="tab-navigation">
            <button
              type="button"
              className={`tab-nav-button ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Organization Details
            </button>
            <button
              type="button"
              className={`tab-nav-button ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              Course & Pricing
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'details' && (
              <>
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
                    <label className="input-label" htmlFor="organizationName">Add Organization Name</label>
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
                    <label className="input-label" htmlFor="organizationAddress">Add Organization Address</label>
                    {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                  </div>

                  <div className="d-flex gap-2 justify-content-between">
                    <div className="input-group" onClick={() => !isReadOnly && handleInputFocus('city')}>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => !isReadOnly && handleInputChange('city', e.target.value)}
                        className="form-input"
                        placeholder=" "
                        id="city"
                        disabled={isReadOnly}
                      />
                      <label className="input-label" htmlFor="city">Add City</label>
                      {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                    </div>

                    <div className="input-group" onClick={() => !isReadOnly && handleInputFocus('state')}>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => !isReadOnly && handleInputChange('state', e.target.value)}
                        className="form-input"
                        placeholder=" "
                        id="state"
                        disabled={isReadOnly}
                      />
                      <label className="input-label" htmlFor="state">Add State</label>
                      {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                    </div>

                    <div className="input-group" onClick={() => !isReadOnly && handleInputFocus('zipCode')}>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => !isReadOnly && handleInputChange('zipCode', e.target.value)}
                        className="form-input"
                        placeholder=" "
                        id="zipCode"
                        disabled={isReadOnly}
                      />
                      <label className="input-label" htmlFor="zipCode">Add Zip Code</label>
                      {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                    </div>
                  </div>
                </div>

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
                    <label className="input-label" htmlFor="administratorName">Add Administrator Name</label>
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
                    <label className="input-label" htmlFor="administratorEmail">Add Administrator Email</label>
                    {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                  </div>
                </div>

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
                    <label className="input-label" htmlFor="domainURL">Add Domain URL</label>
                    {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'pricing' && (
              <>
                <div className="form-section">
                  <div className="section-header">
                    <img src={spark} alt="Spark Icon" />
                    <span>Course Details</span>
                  </div>
                  
                  <div className="course-access-toggles">
                    {Object.keys(formData.courseAccess).map(course => (
                      <div key={course} className="toggle-item">
                        <div className="toggle-label-container">
                          <span className="toggle-label">{courseAccessLabels[course]}</span>
                          {(isReadOnly) && (
                            <div className="course-access-indicator">
                              {formData.courseAccess[course] ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                  <circle cx="5.5" cy="5.5" r="5.5" fill="#99CC33"/>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                  <circle cx="5.5" cy="5.5" r="5.5" fill="#AEAEAE"/>
                                </svg>
                              )}
                            </div>
                          )}
                        </div>
                        {!isReadOnly && (
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={formData.courseAccess[course]}
                              onChange={() => handleCourseAccessChange(course)}
                            />
                            <span className="slider round"></span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <img src={spark} alt="Spark Icon" />
                    <span>Organization Pricing Details</span>
                  </div>
                  
                  <div className="pricing-inputs">
                    <div className="input-group pricing-amount" onClick={() => !isReadOnly && handleInputFocus('orgPricingAmount')}>
                      <input
                        type="text"
                        value={formData.organizationPricing.amount}
                        onChange={(e) => !isReadOnly && handleOrganizationPricingChange('amount', e.target.value)}
                        className="form-input"
                        placeholder=" "
                        id="orgPricingAmount"
                        disabled={isReadOnly}
                      />
                      <label className="input-label" htmlFor="orgPricingAmount">Add dollar amount (ie. $15)</label>
                      {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                    </div>

                    <div className="frequency-dropdown">
                      <select
                        value={formData.organizationPricing.frequency}
                        onChange={(e) => !isReadOnly && handleOrganizationPricingChange('frequency', e.target.value)}
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
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <img src={spark} alt="Spark Icon" />
                    <span>Learner Pricing Details</span>
                  </div>
                  
                  {formData.learnerPricing.map((tier, index) => (
                    <div key={index} className="pricing-tier">
                      <div className="pricing-inputs">
                        <div className="input-group pricing-amount" onClick={() => !isReadOnly && handleInputFocus(`learnerPricingAmount-${index}`)}>
                          <input
                            type="text"
                            value={tier.amount}
                            onChange={(e) => !isReadOnly && handleLearnerPricingChange(index, 'amount', e.target.value)}
                            className="form-input"
                            placeholder=" "
                            id={`learnerPricingAmount-${index}`}
                            disabled={isReadOnly}
                          />
                          <label className="input-label" htmlFor={`learnerPricingAmount-${index}`}>Add dollar amount (ie. $15)</label>
                          {!isReadOnly && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                        </div>

                        <div className="frequency-dropdown">
                          <select
                            value={tier.frequency}
                            onChange={(e) => !isReadOnly && handleLearnerPricingChange(index, 'frequency', e.target.value)}
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
                      
                      {!isReadOnly && formData.learnerPricing.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLearnerPricingTier(index)}
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
                      onClick={addNewLearnerPricingTier}
                      className="add-pricing-tier-btn"
                    >
                      <span>Add new pricing tier</span>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  )}
                </div>

                {/* Payments Section - Only show in view mode */}
                {isViewMode && (
                  <div className="form-section">
                    <div className="section-header d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <img src={spark} alt="Spark Icon" />
                        <span>Payments</span>
                      </div>

                      <div 
                        className="d-flex align-items-center gap-2 cursor-pointer"
                        onClick={handleViewInvoices}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>View Invoices</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5.00033 10H15.417M15.417 10L10.417 5M15.417 10L10.417 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="payment-table-container">
                      <table className="payment-table">
                        <thead>
                          <tr>
                            <th className="payment-date-header">
                              <div className="d-flex align-items-center gap-2">
                                PAYMENT DATE
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </th>
                            <th>AMOUNT</th>
                            <th>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceHistory.length > 0 ? (
                            invoiceHistory.slice(0, 4).map((invoice) => (
                              <tr key={invoice.id}>
                                <td>{invoice.paymentDate || invoice.issueDate || 'N/A'}</td>
                                <td>${parseFloat(invoice.amount).toFixed(2)}</td>
                                <td>
                                  <span className={`status-badge status-${invoice.status.toLowerCase()}`}>
                                    <span className="status-dot"></span>
                                    {invoice.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                No payment history available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="modal-actions">
            {isViewMode ? (
              <div className="full-width-btn" style={{width: '100%'}}>
                <AcademyBtn 
                  title="View Organization Learners"
                  onClick={handleViewLearners}
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

      <PricingChangeModal
        show={showPricingChangeModal}
        onHide={() => {
          setShowPricingChangeModal(false)
          setPendingSave(false)
        }}
        onConfirm={handlePricingChangeConfirm}
      />

      <ViewOrganizationLearnersModal
        show={showLearnersModal}
        onHide={handleLearnersModalClose}
        organizationName={formData.organizationName}
        organizationId={formData.id}
      />

      <ViewOrganizationInvoicesModal
        show={showInvoicesModal}
        onHide={handleInvoicesModalClose}
        organizationName={formData.organizationName}
        organizationId={formData.id}
      />
    </>
  )
}

export default AddNewOrganization