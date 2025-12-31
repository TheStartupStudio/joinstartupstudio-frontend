import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import './ViewInvoiceModal.css'
import PreviewInvoiceEmailModal from './PreviewInvoiceEmailModal'
import { invoiceApi } from '../../utils/invoiceApi'
import PayInvoiceModal from './PayInvoiceModal'

const ViewInvoiceModal = ({ show = true, onHide, onSuccess, invoiceData = null, mode: initialMode = 'view' }) => {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(initialMode)
  const [showPreviewEmailModal, setShowPreviewEmailModal] = useState(false)
  const [showPayInvoiceModal, setShowPayInvoiceModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  
  // ✅ Add ref for the invoice content
  const invoiceContentRef = useRef(null)
  
  const { user } = useSelector((state) => state.user.user)
  const isOrgClient = user?.role_id === 2
  const isInstructor = user?.role_id === 2
  
  const defaultDummyData = {
    organizationName: 'Organization Name',
    organizationAddress: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    invoiceNumber: '01245',
    issueDate: '2025/09/27',
    dueDate: '2025/10/27',
    items: [
      {
        description: 'AIE Learner Access',
        quantity: '1000',
        price: '15',
        total: 15000
      }
    ],
    subtotal: 15000,
    tax: 1050,
    total: 16050
  }

  const [formData, setFormData] = useState(defaultDummyData)
  const [newItemData, setNewItemData] = useState({
    description: '',
    quantity: '',
    price: '',
    total: 0
  })
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [editingItemData, setEditingItemData] = useState({
    description: '',
    quantity: '',
    price: '',
    total: 0
  })

  useEffect(() => {
    setMode(initialMode)
    if (show && invoiceData) {
      if (invoiceData.id) {
        fetchInvoiceDetails(invoiceData.id)
      } else {
        setFormData({
          ...invoiceData,
          issueDate: invoiceData.issueDate || invoiceData.invoiceDate,
          dueDate: invoiceData.dueDate
        })
      }
    } else if (show) {
      setFormData(defaultDummyData)
    }
  }, [show, invoiceData, initialMode])

  const fetchInvoiceDetails = async (invoiceId) => {
    setLoading(true)
    try {
      let response
      
      if (isOrgClient) {
        response = await invoiceApi.getClientInvoiceById(invoiceId)
      } else {
        response = await invoiceApi.getInvoiceById(invoiceId)
      }
      
      const invoice = response.data
      
      setFormData({
        id: invoice.id,
        organizationName: invoice.organizationName,
        organizationId: invoice.organizationId,
        organizationAddress: invoice.organizationAddress,
        city: invoice.city,
        state: invoice.state,
        zip: invoice.zip,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        items: invoice.items || [],
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total
      })
    } catch (error) {
      console.error('Error fetching invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to load invoice details')
      setFormData(invoiceData || defaultDummyData)
    } finally {
      setLoading(false)
    }
  }

  const handleEditItem = (index) => {
    const item = formData.items[index]
    setEditingItemIndex(index)
    setEditingItemData({
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: parseFloat(item.total)
    })
  }

  const handleEditingItemChange = (field, value) => {
    const updatedItem = { ...editingItemData, [field]: value }
    
    if (field === 'quantity' || field === 'price') {
      const qty = parseFloat(field === 'quantity' ? value : editingItemData.quantity) || 0
      const price = parseFloat(field === 'price' ? value : editingItemData.price) || 0
      updatedItem.total = qty * price
    }
    
    setEditingItemData(updatedItem)
  }

  const handleConfirmEditItem = () => {
    if (!editingItemData.description || !editingItemData.quantity || !editingItemData.price) {
      toast.warning('Please fill in all item fields')
      return
    }

    const updatedItems = [...formData.items]
    updatedItems[editingItemIndex] = {
      ...editingItemData,
      quantity: editingItemData.quantity.toString(),
      price: parseFloat(editingItemData.price).toFixed(2)
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }))
    calculateTotals(updatedItems)
    
    setEditingItemIndex(null)
    setEditingItemData({
      description: '',
      quantity: '',
      price: '',
      total: 0
    })
    
    toast.success('Item updated successfully!')
  }

  const handleCancelEditItem = () => {
    setEditingItemIndex(null)
    setEditingItemData({
      description: '',
      quantity: '',
      price: '',
      total: 0
    })
  }

  const handleDeleteItem = (index) => {
    if (formData.items.length === 1) {
      toast.error('At least one item is required!')
      return
    }

    const updatedItems = formData.items.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }))
    calculateTotals(updatedItems)
    toast.success('Item deleted successfully!')
  }

  const handleNewItemChange = (field, value) => {
    const updatedItem = { ...newItemData, [field]: value }
    
    if (field === 'quantity' || field === 'price') {
      const qty = parseFloat(field === 'quantity' ? value : newItemData.quantity) || 0
      const price = parseFloat(field === 'price' ? value : newItemData.price) || 0
      updatedItem.total = qty * price
    }
    
    setNewItemData(updatedItem)
  }

  const handleConfirmNewItem = () => {
    if (!newItemData.description || !newItemData.quantity || !newItemData.price) {
      toast.error('Please fill in all item fields')
      return
    }

    const updatedItems = [...formData.items, {
      ...newItemData,
      quantity: newItemData.quantity.toString(),
      price: parseFloat(newItemData.price).toFixed(2)
    }]
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }))
    calculateTotals(updatedItems)
    
    setNewItemData({
      description: '',
      quantity: '',
      price: '',
      total: 0
    })
    
    toast.success('Item added successfully!')
  }

  const handleCancelNewItem = () => {
    setNewItemData({
      description: '',
      quantity: '',
      price: '',
      total: 0
    })
  }

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
    const tax = subtotal * 0.07 
    const total = subtotal + tax

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }))
  }

  const handleClose = () => {
    if (loading) return
    setMode('view')
    if (onHide) onHide()
  }

  const handleSave = async () => {
    if (!formData.id) {
      toast.error('Cannot save invoice without ID')
      return
    }

    // If user is editing an item but forgot to confirm, auto-save it if fields are complete
    if (editingItemIndex !== null) {
      if (editingItemData.description && editingItemData.quantity && editingItemData.price) {
        const updatedItems = [...formData.items]
        updatedItems[editingItemIndex] = {
          ...editingItemData,
          quantity: editingItemData.quantity.toString(),
          price: parseFloat(editingItemData.price).toFixed(2)
        }
        
        setFormData(prev => ({
          ...prev,
          items: updatedItems
        }))
        calculateTotals(updatedItems)
      }
      
      // Clear editing state
      setEditingItemIndex(null)
      setEditingItemData({
        description: '',
        quantity: '',
        price: '',
        total: 0
      })
    }

    setLoading(true)
    try {
      const response = await invoiceApi.updateInvoice(formData.id, {
        items: formData.items.map(item => ({
          description: item.description,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          total: parseFloat(item.total)
        })),
        subtotal: formData.subtotal,
        tax: formData.tax,
        total: formData.total,
        status: formData.status
      })
      
      toast.success(response.message || 'Invoice updated successfully!')
      setMode('view')
      
      await fetchInvoiceDetails(formData.id)
      
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error saving invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to update invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvoice = () => {
    if (!formData.id) {
      toast.error('Cannot send invoice without ID')
      return
    }
    setShowPreviewEmailModal(true)
  }

  const handleConfirmSend = async (emailData) => {
    if (!formData.id) {
      toast.error('Cannot send invoice without ID')
      return
    }

    setLoading(true)
    try {
      const response = await invoiceApi.sendInvoiceEmail(formData.id, emailData)
      toast.success(response.message || 'Invoice email sent successfully!')
      setShowPreviewEmailModal(false)
    } catch (error) {
      console.error('Error sending invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to send invoice email')
    } finally {
      setLoading(false)
    }
  }

  const handlePayInvoice = () => {
    setShowPayInvoiceModal(true)
  }

  const handlePaymentSubmit = async (paymentData) => {
  try {
    console.log('Payment successful:', paymentData)
    
    if (formData.id) {
      await fetchInvoiceDetails(formData.id)
    }
    
    if (onSuccess) {
      onSuccess()
    }
    
    toast.success('Invoice paid successfully!')
  } catch (error) {
    console.error('Error handling payment:', error)
    throw error
  }
}

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0)
  }

  // ✅ Download invoice as PDF from backend
  const handleDownloadInvoice = async () => {
    if (!formData.id) {
      toast.error('Invoice ID not available')
      return
    }

    setIsDownloading(true)
    toast.success('Downloading invoice...')

    try {
      if (isOrgClient) {
        await invoiceApi.downloadClientInvoice(formData.id)
      } else {
        const response = await invoiceApi.downloadInvoice(formData.id)
        
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Invoice_${formData.invoiceNumber}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
      
      toast.success('Invoice downloaded successfully!')
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error('Failed to download invoice')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop={true}
        keyboard={true}
        className="edit-invoice-modal"
        centered
        size="lg"
      >
        {/* ✅ Wrap the content in a ref for PDF generation */}
        <div className="invoice-modal-content">
          {/* Header */}
          <div className="invoice-modal-header">
            <div className="modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 9.16699H12.0833H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 5.83301H12.0833H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.66667 12.5V3.1C6.66667 2.76863 6.93529 2.5 7.26667 2.5H16.9C17.2314 2.5 17.5 2.76863 17.5 3.1V14.1667C17.5 16.0076 16.0076 17.5 14.1667 17.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.49935 12.5H6.66602H10.2327C10.5641 12.5 10.8359 12.7682 10.8662 13.0982C10.9879 14.4253 11.5521 17.5 14.166 17.5H6.66602H5.49935C3.84249 17.5 2.49935 16.1569 2.49935 14.5C2.49935 13.3954 3.39478 12.5 4.49935 12.5Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h4 className="invoice-modal-title">
              {loading ? 'Loading...' : isDownloading ? 'Generating PDF...' : mode === 'edit' ? 'Edit Invoice' : 'View Invoice'}
            </h4>

            <div className="header-icons-nav">
              <div onClick={handleClose} style={{ cursor: 'pointer' }} title="Go Back">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {mode === 'view' && !loading ? (
                <>
                {/* ✅ Download Button */}
                <div 
                  onClick={handleDownloadInvoice} 
                  style={{ cursor: isDownloading ? 'not-allowed' : 'pointer' }}
                  title="Download Invoice as PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M26.25 18.75V23.125C26.25 23.6223 26.0525 24.099 25.7008 24.4508C25.349 24.8025 24.8723 25 24.375 25H5.625C5.12772 25 4.65081 24.8025 4.29917 24.4508C3.94754 24.099 3.75 23.6223 3.75 23.125V18.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.75 12.5L15 18.75L21.25 12.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 18.75V3.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {!isInstructor && (

<>
                <div onClick={() => setMode('edit')} style={{ cursor: 'pointer' }} title="Edit Invoice">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M17.9539 7.06445L20.1575 4.86091C20.9385 4.07986 22.2049 4.07986 22.9859 4.86091L25.4608 7.33579C26.2418 8.11683 26.2418 9.38316 25.4608 10.1642L23.2572 12.3678M17.9539 7.06445L5.80585 19.2125C5.47378 19.5446 5.26915 19.983 5.22783 20.4508L4.88296 24.3546C4.82819 24.9746 5.34707 25.4935 5.96708 25.4387L9.87093 25.0939C10.3387 25.0525 10.7771 24.8479 11.1092 24.5158L23.2572 12.3678M17.9539 7.06445L23.2572 12.3678" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div onClick={handleSendInvoice} style={{ cursor: loading ? 'not-allowed' : 'pointer' }} title="Send Invoice via Email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M11.25 11.25L16.875 15L22.5 11.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.75 16.875H6.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.25 13.125H6.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.25 9.375V8.25C6.25 7.14543 7.14543 6.25 8.25 6.25H25.5C26.6046 6.25 27.5 7.14543 27.5 8.25V21.75C27.5 22.8546 26.6046 23.75 25.5 23.75H8.25C7.14543 23.75 6.25 22.8546 6.25 21.75V20.625" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                </>

                )}
                </>
                
              ) : mode === 'edit' && !loading ? (
                <div onClick={handleSave} style={{ cursor: loading ? 'not-allowed' : 'pointer' }} title="Save Changes">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M3.75 24.25V5.75C3.75 4.64543 4.64543 3.75 5.75 3.75H20.4216C20.952 3.75 21.4607 3.96071 21.8358 4.33579L25.6642 8.16421C26.0393 8.53929 26.25 9.04799 26.25 9.57843V24.25C26.25 25.3546 25.3546 26.25 24.25 26.25H5.75C4.64543 26.25 3.75 25.3546 3.75 24.25Z" stroke="black" strokeWidth="1.5"/>
                    <path d="M10.6 11.25H19.4C19.7314 11.25 20 10.9814 20 10.65V4.35C20 4.01863 19.7314 3.75 19.4 3.75H10.6C10.2686 3.75 10 4.01863 10 4.35V10.65C10 10.9814 10.2686 11.25 10.6 11.25Z" stroke="black" strokeWidth="1.5"/>
                    <path d="M7.5 16.85V26.25H22.5V16.85C22.5 16.5186 22.2314 16.25 21.9 16.25H8.1C7.76863 16.25 7.5 16.5186 7.5 16.85Z" stroke="black" strokeWidth="1.5"/>
                  </svg>
                </div>
              ) : null}

            </div>
          </div>

          {/* Instructor Payment Info - Only show for instructors */}
          {isInstructor && (
            <div className="instructor-payment-info">
              <span className="payment-info-text">
                {formData.status === 'scheduled' ? (
                  <>Invoice will be automatically paid on {formData.dueDate || 'N/A'}</>
                ) : formData.status === 'paid' ? (
                  <>Invoice was successfully paid on {formData.paidDate || formData.dueDate || 'N/A'}</>
                ) : formData.status === 'pending' ? (
                  <>Payment pending - Due date: {formData.dueDate || 'N/A'}</>
                ) : formData.status === 'failed' ? (
                  <>Payment failed - Please update your payment method</>
                ) : formData.status === 'overdue' ? (
                  <>Invoice overdue - Payment was due on {formData.dueDate || 'N/A'}</>
                ) : formData.status === 'cancelled' ? (
                  <>Invoice cancelled</>
                ) : (
                  <>Invoice due on {formData.dueDate || 'N/A'}</>
                )}
              </span>
              <div className="edit-payment-btn" onClick={handlePayInvoice}>
                <span>Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.333 2.00004C11.5081 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4191 1.44775 12.6663 1.44775C12.9135 1.44775 13.1581 1.49653 13.3869 1.59129C13.6157 1.68605 13.8245 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.38393 14.4084 2.61272C14.5032 2.84151 14.552 3.08615 14.552 3.33337C14.552 3.58059 14.5032 3.82524 14.4084 4.05403C14.3137 4.28282 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="#51C7DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )}

          {/* Invoice Body */}
            <div className="invoice-modal-body" ref={invoiceContentRef}>
              {/* Organization Name Header */}
              <div className="organization-header">
                <h2>{formData.organizationName}</h2>
              </div>

              {/* Issued To & Invoice Details */}
              <div className="invoice-top-section">
                <div className="issued-to-section">
                  <label className="section-label">ISSUED TO:</label>
                  <label className="name-section-label">{formData.organizationName}</label>
                  <label className="address-section-label">{formData.organizationAddress}</label>
                  <label className="city-section-label">{`${formData.city}${formData.state ? ', ' + formData.state : ''}${formData.zip ? ', ' + formData.zip : ''}`}</label>
                
                  {/* Pay To Section */}
                  <div className="pay-to-section">
                    <label className="section-label">PAY TO:</label>
                    <div className="pay-to-details">
                      <p className="name-section-label">Learn to Start, LLC</p>
                      <p>9100 Conroy Windermere Road,</p>
                      <p>Suite 200 - #132</p>
                      <p>Windermere, FL 34786</p>
                    </div>
                  </div>
                </div>

                <div className="invoice-details-section">
                  <div className="detail-row">
                    <p className="name-section-label">INVOICE #:</p>
                    <p className="city-section-label">{formData.invoiceNumber}</p>
                  </div>
                  <div className="detail-row">
                    <p className="name-section-label">DATE:</p>
                    <p className="city-section-label">{formData.issueDate}</p>
                  </div>
                  <div className="detail-row">
                    <p className="name-section-label">DUE DATE:</p>
                    <p className="city-section-label">{formData.dueDate}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="invoice-items-section">
                <div className="invoice-items-header">
                  <div className="header-cell description-col">DESCRIPTION</div>
                  <div className="header-cell qty-col"># OF ITEMS</div>
                  <div className="header-cell price-col">PRICE</div>
                  <div className="header-cell total-col">TOTAL</div>
                </div>

                {formData?.items?.map((item, index) => (
                  <div key={index} className="invoice-item-row">
                    {editingItemIndex === index ? (
                      // Editing mode for this item
                      <>
                        <div className="item-cell description-col">
                          <input 
                            type="text" 
                            className="add-description-input"
                            value={editingItemData.description}
                            onChange={(e) => handleEditingItemChange('description', e.target.value)}
                          />
                        </div>
                        <div className="item-cell qty-col">
                          <input 
                            type="number" 
                            className="add-qty-input"
                            value={editingItemData.quantity}
                            onChange={(e) => handleEditingItemChange('quantity', e.target.value)}
                          />
                        </div>
                        <div className="item-cell price-col">
                          <input 
                            type="number" 
                            className="add-price-input"
                            value={editingItemData.price}
                            onChange={(e) => handleEditingItemChange('price', e.target.value)}
                          />
                        </div>
                        <div className="item-cell total-col">
                          <span className="item-total">${editingItemData.total?.toLocaleString()}</span>
                          <button className="confirm-btn" onClick={handleConfirmEditItem}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#51C7DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button className="cancel-btn" onClick={handleCancelEditItem}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M12 4L4 12M4 4L12 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      // View mode for this item
                      <>
                        <div className="item-cell description-col">
                          <span className="item-description">{item.description}</span>
                        </div>
                        <div className="item-cell qty-col">
                          <span className="item-quantity">{item.quantity}</span>
                        </div>
                        <div className="item-cell price-col">
                          <span className="item-price">${item.price}</span>
                        </div>
                        <div className="item-cell total-col">
                          <span className="item-total">${parseFloat(item.total).toLocaleString()}</span>
                          {mode === 'edit' && (
                            <>
                              <button className="edit-btn" onClick={() => handleEditItem(index)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M11.333 2.00004C11.5081 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4191 1.44775 12.6663 1.44775C12.9135 1.44775 13.1581 1.49653 13.3869 1.59129C13.6157 1.68605 13.8245 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.38393 14.4084 2.61272C14.5032 2.84151 14.552 3.08615 14.552 3.33337C14.552 3.58059 14.5032 3.82524 14.4084 4.05403C14.3137 4.28282 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              <button className="delete-btn" onClick={() => handleDeleteItem(index)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M2 4H3.33333H14" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Add New Item Row - Only show in edit mode */}
                {mode === 'edit' && (
                  <div className="invoice-item-row add-item-row" style={{ padding: '0px 42px 20px 30px' }}>
                    <div className="item-cell description-col">
                      <input 
                        type="text" 
                        placeholder="Add description..." 
                        className="add-description-input"
                        value={newItemData.description}
                        onChange={(e) => handleNewItemChange('description', e.target.value)}
                      />
                    </div>
                    <div className="item-cell qty-col">
                      <input 
                        type="number" 
                        placeholder="#" 
                        className="add-qty-input"
                        value={newItemData.quantity}
                        onChange={(e) => handleNewItemChange('quantity', e.target.value)}
                      />
                    </div>
                    <div className="item-cell price-col">
                      <input 
                        type="number" 
                        placeholder="Price" 
                        className="add-price-input"
                        value={newItemData.price}
                        onChange={(e) => handleNewItemChange('price', e.target.value)}
                      />
                    </div>
                    <div className="item-cell total-col">
                      <span className="item-total">${newItemData.total?.toLocaleString()}</span>
                      <button className="confirm-btn" onClick={handleConfirmNewItem}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#51C7DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="cancel-btn" onClick={handleCancelNewItem}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12 4L4 12M4 4L12 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Totals Section */}
                <div className="invoice-totals-section">
                  <div className="totals-row" style={{alignItems: 'unset'}}>
                    <span className="totals-label" style={{width: 'unset', fontSize: '16px', fontWeight: '600'}}>SUBTOTAL</span>
                  </div>

                  <div className="totals-values">
                    <div className="totals-row">
                      <span className="totals-label"></span>
                      <span className="totals-value">{formatCurrency(formData.subtotal)}</span>
                    </div>
                    <div className="totals-row">
                      <span className="totals-label">Tax (7%)</span>
                      <span className="totals-value">{formatCurrency(formData.tax)}</span>
                    </div>
                    <div className="totals-row total-row">
                      <span className="totals-label">TOTAL</span>
                      <span className="totals-value">{formatCurrency(formData.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        </div>
      </Modal>

      {/* Preview Email Modal */}
      <PreviewInvoiceEmailModal
        show={showPreviewEmailModal}
        onHide={() => setShowPreviewEmailModal(false)}
        invoiceData={formData}
        onConfirmSend={handleConfirmSend}
      />

      {/* Pay Invoice Modal - Only for instructors */}
      <PayInvoiceModal
        show={showPayInvoiceModal}
        onHide={() => setShowPayInvoiceModal(false)}
        invoiceData={formData}
        onPay={handlePaymentSubmit}
      />
    </>
  )
}

export default ViewInvoiceModal