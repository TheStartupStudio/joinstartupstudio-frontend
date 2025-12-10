import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPencilAlt, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'
import AcademyBtn from '../../AcademyBtn'
import PricingChangeModal from '../PricingChangeModal'
import ManagePaymentModal from '../ManagePaymentModal'
import PayInvoiceModal from '../PayInvoiceModal'


const ViewOrganizationModal = ({ show, onHide, universityId }) => {
  const history = useHistory()
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const [showPricingChangeModal, setShowPricingChangeModal] = useState(false)
  const [showManagePaymentModal, setShowManagePaymentModal] = useState(false)
  const [originalPricing, setOriginalPricing] = useState([])
  const [originalOrgPricing, setOriginalOrgPricing] = useState([])
  const [uploadingLogo1, setUploadingLogo1] = useState(false)
  const [uploadingLogo2, setUploadingLogo2] = useState(false)
  const logo1InputRef = useRef(null)
  const logo2InputRef = useRef(null)
  
  // ✅ Add this state to store the original fetched data
  const [originalData, setOriginalData] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    adminName: '',
    adminEmail: '',
    domain: '',
    pricing: [],
    orgPrice: [],
    logo1: null,
    logo2: null
  })
  const [paymentData, setPaymentData] = useState(null)

  // Fetch organization data when modal opens
  useEffect(() => {
    if (show && universityId) {
      fetchOrganizationData()
    }
  }, [show, universityId])

  const fetchOrganizationData = async () => {
    setFetchingData(true)
    try {
      const { data } = await axiosInstance.get(`/admin-info/organization/${universityId}`)
      
      if (data.success) {
        const orgData = {
          name: data.data.name || '',
          address: data.data.address || '',
          adminName: data.data.adminName || '',
          adminEmail: data.data.adminEmail || '',
          domain: data.data.domain || '',
          pricing: data.data.pricing || [],
          orgPrice: data.data.orgPrice || [],
          logo1: data.data.logo1 || null,
          logo2: data.data.logo2 || null
        }
        
        setFormData(orgData)
        // ✅ Store the original data for cancel functionality
        setOriginalData(JSON.parse(JSON.stringify(orgData)))
        setOriginalPricing(JSON.parse(JSON.stringify(orgData.pricing)))
        setOriginalOrgPricing(JSON.parse(JSON.stringify(orgData.orgPrice)))
      }
    } catch (error) {
      console.error('Error fetching organization data:', error)
      toast.error('Failed to load organization data')
    } finally {
      setFetchingData(false)
    }
  }

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleBackClick = () => {
    if (isEditMode) {
      setIsEditMode(false)
      // ✅ Reset to original data
      if (originalData) {
        setFormData(JSON.parse(JSON.stringify(originalData)))
      }
    } else {
      onHide()
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePricingChange = (index, field, value) => {
    const updatedPricing = [...formData.pricing]
    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      pricing: updatedPricing
    }))
  }

  const handleOrgPricingChange = (index, field, value) => {
    const updatedOrgPricing = [...formData.orgPrice]
    updatedOrgPricing[index] = {
      ...updatedOrgPricing[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      orgPrice: updatedOrgPricing
    }))
  }

  const addNewPricingTier = () => {
    setFormData(prev => ({
      ...prev,
      pricing: [...prev.pricing, { amount: '', frequency: 'Per month' }]
    }))
  }

  const addNewOrgPricingTier = () => {
    setFormData(prev => ({
      ...prev,
      orgPrice: [...prev.orgPrice, { amount: '', frequency: 'Per year' }]
    }))
  }

  const removePricingTier = (index) => {
    if (formData.pricing.length > 1) {
      const updatedPricing = formData.pricing.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        pricing: updatedPricing
      }))
    }
  }

  const removeOrgPricingTier = (index) => {
    if (formData.orgPrice.length > 1) {
      const updatedOrgPricing = formData.orgPrice.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        orgPrice: updatedOrgPricing
      }))
    }
  }

  const hasPricingChanged = () => {
    if (formData.pricing.length !== originalPricing.length) {
      return true
    }

    const pricingChanged = formData.pricing.some((tier, index) => {
      const original = originalPricing[index]
      return tier.amount !== original.amount || tier.frequency !== original.frequency
    })

    if (pricingChanged) return true

    if (formData.orgPrice.length !== originalOrgPricing.length) {
      return true
    }

    const orgPricingChanged = formData.orgPrice.some((tier, index) => {
      const original = originalOrgPricing[index]
      return tier.amount !== original.amount || tier.frequency !== original.frequency
    })

    return orgPricingChanged
  }

  const handleSaveChanges = async () => {
    if (hasPricingChanged()) {
      setShowPricingChangeModal(true)
      return
    }

    await performSave(false)
  }

  const performSave = async (applyToCurrentUsers) => {
    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        domain: formData.domain,
        logo1: formData.logo1,
        logo2: formData.logo2,
        pricing: formData.pricing,
        orgPrice: formData.orgPrice,
        applyToCurrentUsers
      }

      const { data } = await axiosInstance.patch(`/admin-info/organization/${universityId}`, payload)
      
      if (data.success) {
        toast.success('Organization updated successfully!')
        setIsEditMode(false)
        setOriginalPricing(JSON.parse(JSON.stringify(formData.pricing)))
        setOriginalOrgPricing(JSON.parse(JSON.stringify(formData.orgPrice)))
        setShowPricingChangeModal(false)
        
        // ✅ Update original data after successful save
        setOriginalData(JSON.parse(JSON.stringify(formData)))
        
        // Refresh data
        await fetchOrganizationData()
      }
    } catch (error) {
      console.error('Error saving organization:', error)
      toast.error(error.response?.data?.message || 'Failed to update organization')
    } finally {
      setLoading(false)
    }
  }

  const handlePricingChangeConfirm = (applyToCurrentUsers) => {
    performSave(applyToCurrentUsers)
  }

  const handlePricingChangeCancel = () => {
    setShowPricingChangeModal(false)
    setFormData(prev => ({
      ...prev,
      pricing: JSON.parse(JSON.stringify(originalPricing)),
      orgPrice: JSON.parse(JSON.stringify(originalOrgPricing))
    }))
  }

  const handleCancel = () => {
    setIsEditMode(false)
    // ✅ Reset to original data
    if (originalData) {
      setFormData(JSON.parse(JSON.stringify(originalData)))
    }
  }

  const handleViewLearners = () => {
    history.push('/user-managment')
  }

  const handleEditPricingClick = () => {
    setPaymentData({
      nameOnCard: 'My Organization',
      cardNumber: '1234567890',
      expirationDate: '10/27',
      cvc: '123',
      zipCode: '36741',
      billingAddress: '1234 My Home Street',
      city: 'Orlando',
      state: 'FL',
      billingZipCode: '34761',
      paymentMethod: 'credit-card'
    })
    setShowManagePaymentModal(true)
  }

  const handleSavePaymentInfo = async (paymentInfo) => {
    console.log('Saving payment info:', paymentInfo)
    // Here you would typically save to your backend
    toast.success('Payment information updated successfully!')
  }

  const handleLogoUpload = async (file, logoType) => {
    if (!file) return

    // Validate file type
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      toast.error('Please select a PNG, JPG, or JPEG file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }

    const setUploading = logoType === 'logo1' ? setUploadingLogo1 : setUploadingLogo2

    try {
      setUploading(true)
      const formDataToUpload = new FormData()
      formDataToUpload.append('img', file)

      const response = await axiosInstance.post('/upload/img-transform', formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.fileLocation) {
        setFormData(prev => ({
          ...prev,
          [logoType]: response.data.fileLocation
        }))
        toast.success(`${logoType === 'logo1' ? 'Logo' : 'Banner'} uploaded successfully!`)
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast.error('Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

  const handleLogoClick = (logoType) => {
    if (isEditMode) {
      if (logoType === 'logo1') {
        logo1InputRef.current?.click()
      } else {
        logo2InputRef.current?.click()
      }
    }
  }

  const handleLogoChange = (e, logoType) => {
    const file = e.target.files?.[0]
    if (file) {
      handleLogoUpload(file, logoType)
    }
  }

  const handleRemoveLogo = (logoType) => {
    setFormData(prev => ({
      ...prev,
      [logoType]: null
    }))
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        size="md"
        className={`view-organization-modal ${isEditMode ? 'edit-mode' : ''}`}
      >
        <Modal.Header className="view-org-modal-header">
          <div className="header-btn-container">
            <button 
              className="back-button"
              onClick={handleBackClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {!isEditMode && (
              <button 
                className="edit-button-view-org"
                onClick={handleEditClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M17.9539 7.06445L20.1575 4.86091C20.9385 4.07986 22.2049 4.07986 22.9859 4.86091L25.4608 7.33579C26.2418 8.11683 26.2418 9.38316 25.4608 10.1642L23.2572 12.3678M17.9539 7.06445L5.80585 19.2125C5.47378 19.5446 5.26915 19.983 5.22783 20.4508L4.88296 24.3546C4.82819 24.9746 5.34707 25.4935 5.96708 25.4387L9.87093 25.0939C10.3387 25.0525 10.7771 24.8479 11.1092 24.5158L23.2572 12.3678M17.9539 7.06445L23.2572 12.3678" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          <div className="modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5.83301 7.50833L5.84134 7.49907" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.16699 7.50833L9.17533 7.49907" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.83301 10.8416L5.84134 10.8323" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.16699 10.8416L9.17533 10.8323" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.83301 14.1751L5.84134 14.1658" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.16699 14.1751L9.17533 14.1658" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.5 17.5H3.1C2.76863 17.5 2.5 17.2314 2.5 16.9V4.76667C2.5 4.4353 2.76863 4.16667 3.1 4.16667H7.5V3.1C7.5 2.76863 7.76863 2.5 8.1 2.5H11.9C12.2314 2.5 12.5 2.76863 12.5 3.1V7.5M12.5 17.5H16.9C17.2314 17.5 17.5 17.2314 17.5 16.9V8.1C17.5 7.76863 17.2314 7.5 16.9 7.5H12.5M12.5 17.5V14.1667M12.5 7.5V10.8333M12.5 10.8333H14.1667M12.5 10.8333V14.1667M12.5 14.1667H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h5 className="modal-title">{isEditMode ? 'Edit Organization' : 'View Organization'}</h5>
        </Modal.Header>

        <Modal.Body className="view-org-modal-body">
          {fetchingData ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2">Loading organization data...</p>
            </div>
          ) : (
            <>
              <div className="org-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3587_14186)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
                  <span>Organization Details</span>
                </div>
                <div className="org-details">
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        className="org-name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Organization Name"
                      />
                      <input
                        className="org-address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Organization Address"
                        rows={2}
                      />
                    </>
                  ) : (
                    <>
                      <div className="org-name">{formData.name}</div>
                      <div className="org-address">{formData.address}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Logo Section - UPDATED */}
              <div className="org-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3587_14757)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
                  <span>Organizational Mark & Logo</span>
                </div>
                <div className="org-logos">
                  {/* Logo 1 */}
                  <div className="logo-container">
                    <div 
                      className={`logo-wrapper ${isEditMode ? 'editable' : ''} ${uploadingLogo1 ? 'uploading' : ''}`}
                      onClick={() => handleLogoClick('logo1')}
                    >
                      {uploadingLogo1 ? (
                        <div className="logo-uploading">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="sr-only">Uploading...</span>
                          </div>
                          <p className="mt-2">Uploading...</p>
                        </div>
                      ) : formData.logo1 ? (
                        <>
                          <img 
                            src={formData.logo1} 
                            alt="Organization Logo 1" 
                            className="org-logo"
                          />
                          {isEditMode && (
                            <div className="logo-overlay">
                              <FontAwesomeIcon icon={faPencilAlt} size="2x" />
                              <p>Click to change</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="logo-placeholder">
                          <FontAwesomeIcon icon={faPlus} size="2x" />
                          <p>{isEditMode ? 'Click to upload logo' : 'No logo'}</p>
                        </div>
                      )}
                    </div>
                    {isEditMode && formData.logo1 && (
                      <button 
                        className="remove-logo-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveLogo('logo1')
                        }}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                    <input
                      ref={logo1InputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => handleLogoChange(e, 'logo1')}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {/* Logo 2 */}
                  <div className="logo-container">
                    <div 
                      className={`logo-wrapper horizontal ${isEditMode ? 'editable' : ''} ${uploadingLogo2 ? 'uploading' : ''}`}
                      onClick={() => handleLogoClick('logo2')}
                    >
                      {uploadingLogo2 ? (
                        <div className="logo-uploading">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="sr-only">Uploading...</span>
                          </div>
                          <p className="mt-2">Uploading...</p>
                        </div>
                      ) : formData.logo2 ? (
                        <>
                          <img 
                            src={formData.logo2} 
                            alt="Organization Logo 2" 
                            className="org-logo-horizontal"
                          />
                          {isEditMode && (
                            <div className="logo-overlay">
                              <FontAwesomeIcon icon={faPencilAlt} size="2x" />
                              <p>Click to change</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="logo-placeholder">
                          <FontAwesomeIcon icon={faPlus} size="2x" />
                          <p>{isEditMode ? 'Click to upload banner' : 'No banner'}</p>
                        </div>
                      )}
                    </div>
                    {isEditMode && formData.logo2 && (
                      <button 
                        className="remove-logo-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveLogo('logo2')
                        }}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                    <input
                      ref={logo2InputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => handleLogoChange(e, 'logo2')}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>

              <div className="org-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3587_14757)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
                  <span>Administrator Details</span>
                    <button className="edit-btn">
                      <span>Edit Administrator Details</span>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                </div>
                <div className="admin-details">
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        className="admin-name"
                        value={formData.adminName}
                        onChange={(e) => handleInputChange('adminName', e.target.value)}
                        placeholder="Administrator Name"
                      />
                      <input
                        type="email"
                        className="admin-email"
                        value={formData.adminEmail}
                        onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                        placeholder="Administrator Email"
                      />
                    </>
                  ) : (
                    <>
                      <div className="admin-name">{formData.adminName}</div>
                      <div className="admin-email">{formData.adminEmail}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="org-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3587_14757)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
                  <span>Domain Details</span>
                </div>
                <div className="domain-details">
                  <label className="pricing-label-small">Domain URL:</label>
                  {isEditMode ? (
                    <>
                      <input
                        type="text"
                        className="org-input domain-input"
                        value={formData.domain}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                        placeholder="domain.aie.com"
                      />
                    </>
                  ) : (
                    formData.domain
                  )}
                </div>
              </div>

              {/* NEW: Organizational Pricing Section */}
              <div className="org-section pricing-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3587_14757)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
                  <span>Organizational Pricing</span>
                    <button className="edit-btn">
                      <span>Edit Organizational Pricing</span>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                </div>
                <div className={`pricing-details ${isEditMode ? 'edit-mode' : ''}`}>
                  {isEditMode ? (
                    <>
                      {formData.orgPrice.map((price, index) => (
                        <div key={index} className="pricing-item-edit">
                          <div className="pricing-inputs">
                            <div className="price-input-group">
                              <label className="pricing-label-small">Price:</label>
                              <div className="price-input-wrapper">
                                <span className="dollar-sign">$</span>
                                <input
                                  type="text"
                                  className="price-input"
                                  value={price.amount}
                                  onChange={(e) => handleOrgPricingChange(index, 'amount', e.target.value)}
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div className="frequency-input-group">
                              <select
                                className="frequency-select"
                                value={price.frequency}
                                onChange={(e) => handleOrgPricingChange(index, 'frequency', e.target.value)}
                              >
                                <option value="Per month">Per month</option>
                                <option value="Per year">Per year</option>
                                <option value="Per quarter">Per quarter</option>
                                <option value="One-time">One-time</option>
                              </select>
                            </div>
                          </div>
                          {formData.orgPrice.length > 1 && (
                            <button 
                              className="remove-pricing-btn"
                              onClick={() => removeOrgPricingTier(index)}
                              type="button"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.6663 7.5L15.0038 16.9553C14.8638 17.7522 14.1715 18.3333 13.3624 18.3333H6.63696C5.82783 18.3333 5.13559 17.7522 4.99547 16.9553L3.33301 7.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17.5 4.99984H12.8125M2.5 4.99984H7.1875M7.1875 4.99984V3.33317C7.1875 2.4127 7.93369 1.6665 8.85417 1.6665H11.1458C12.0663 1.6665 12.8125 2.4127 12.8125 3.33317V4.99984M7.1875 4.99984H12.8125" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button 
                        className="add-pricing-tier-btn"
                        onClick={addNewOrgPricingTier}
                        type="button"
                      >
                        <span>Add new pricing tier</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </>
                  ) : (
                    formData.orgPrice.map((price, index) => (
                      <div key={index} className="pricing-item">
                        <div className="price-item-conatiner">
                          <div className="pricing-label">Price:</div>
                          <div className="pricing-value">${price.amount}</div>
                        </div>
                        <div className="pricing-frequency">{price.frequency}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="org-section pricing-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3587_14757)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
                  <span>Pricing Details</span>
                  {!isEditMode && (
                    <button className="edit-btn" onClick={handleEditPricingClick}>
                      <span>Edit Pricing Details</span>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  )}
                </div>
                <div className={`pricing-details ${isEditMode ? 'edit-mode' : ''}`}>
                  {isEditMode ? (
                    <>
                      {formData.pricing.map((price, index) => (
                        <div key={index} className="pricing-item-edit">
                          <div className="pricing-inputs">
                            <div className="price-input-group">
                              <label className="pricing-label-small">Price:</label>
                              <div className="price-input-wrapper">
                                <span className="dollar-sign">$</span>
                                <input
                                  type="number"
                                  className="price-input"
                                  value={price.amount}
                                  onChange={(e) => handlePricingChange(index, 'amount', e.target.value)}
                                  placeholder="0"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            </div>
                            <div className="frequency-input-group">
                              <select
                                className="frequency-select"
                                value={price.frequency}
                                onChange={(e) => handlePricingChange(index, 'frequency', e.target.value)}
                              >
                                <option value="Per month">Per month</option>
                                <option value="Per year">Per year</option>
                                <option value="Per quarter">Per quarter</option>
                                <option value="One-time">One-time</option>
                              </select>
                            </div>
                          </div>
                          {formData.pricing.length > 1 && (
                            <button 
                              className="remove-pricing-btn"
                              onClick={() => removePricingTier(index)}
                              type="button"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.6663 7.5L15.0038 16.9553C14.8638 17.7522 14.1715 18.3333 13.3624 18.3333H6.63696C5.82783 18.3333 5.13559 17.7522 4.99547 16.9553L3.33301 7.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17.5 4.99984H12.8125M2.5 4.99984H7.1875M7.1875 4.99984V3.33317C7.1875 2.4127 7.93369 1.6665 8.85417 1.6665H11.1458C12.0663 1.6665 12.8125 2.4127 12.8125 3.33317V4.99984M7.1875 4.99984H12.8125" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button 
                        className="add-pricing-tier-btn"
                        onClick={addNewPricingTier}
                        type="button"
                      >
                        <span>Add new pricing tier</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </>
                  ) : (
                    formData.pricing.map((price, index) => (
                      <div key={index} className="pricing-item">
                        <div className="price-item-conatiner">
                          <div className="pricing-label">Price:</div>
                          <div className="pricing-value">${price.amount}</div>
                        </div>
                        <div className="pricing-frequency">{price.frequency}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {isEditMode ? (
                <div className="modal-actions">
                  <button 
                    className="btn-cancel-org"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    CANCEL
                  </button>
                  <button 
                    className="btn-save-org"
                    onClick={handleSaveChanges}
                    disabled={loading}
                  >
                    {loading ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                </div>
              ) : (
                <AcademyBtn 
                title="VIEW ORGANIZATION LEARNERS" 
                onClick={handleViewLearners}
              />
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modals */}
      <PricingChangeModal
        show={showPricingChangeModal}
        onHide={() => setShowPricingChangeModal(false)}
        onConfirm={handlePricingChangeConfirm}
        onCancel={handlePricingChangeCancel}
      />

      <ManagePaymentModal
        show={showManagePaymentModal}
        onHide={() => setShowManagePaymentModal(false)}
        paymentData={paymentData}
        onSave={handleSavePaymentInfo}
      />
    </>
  )
}

export default ViewOrganizationModal