import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import './ViewInvoiceModal.css'

const ViewInvoiceModal = ({ show = true, onHide, onSuccess, invoiceData = null, mode: initialMode = 'view' }) => {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(initialMode) // 'view' or 'edit'
  
  // Default dummy data
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

  // Load invoice data when modal opens
  useEffect(() => {
    setMode(initialMode)
    if (show) {
      if (invoiceData) {
        setFormData(invoiceData)
      } else {
        setFormData(defaultDummyData)
      }
    }
  }, [show, invoiceData, initialMode])

  const handleEditItem = (index) => {
    console.log('Edit item:', index)
    toast.info('Edit item functionality coming soon!')
  }

  const handleDeleteItem = (index) => {
    if (formData.items.length === 1) {
      toast.warning('At least one item is required')
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
    
    // Calculate total if quantity and price are provided
    if (field === 'quantity' || field === 'price') {
      const qty = parseFloat(field === 'quantity' ? value : newItemData.quantity) || 0
      const price = parseFloat(field === 'price' ? value : newItemData.price) || 0
      updatedItem.total = qty * price
    }
    
    setNewItemData(updatedItem)
  }

  const handleConfirmNewItem = () => {
    if (!newItemData.description || !newItemData.quantity || !newItemData.price) {
      toast.warning('Please fill in all item fields')
      return
    }

    const updatedItems = [...formData.items, newItemData]
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }))
    calculateTotals(updatedItems)
    
    // Reset new item data
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
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
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

  const handleSave = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast.success('Invoice saved successfully!')
      setMode('view')
      if (onSuccess) onSuccess()
    }, 1000)
  }

  const handleSendInvoice = () => {
    toast.success('Invoice sent successfully!')
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0)
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={true}
      keyboard={true}
      className="edit-invoice-modal"
      centered
      size="lg"
    >
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
            {mode === 'edit' ? 'Edit Invoice' : 'View Invoice'}
          </h4>

          <div className="header-icons-nav">
            <div onClick={handleClose} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {mode === 'view' ? (
              <>
              <div onClick={() => setMode('edit')} style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M17.9539 7.06445L20.1575 4.86091C20.9385 4.07986 22.2049 4.07986 22.9859 4.86091L25.4608 7.33579C26.2418 8.11683 26.2418 9.38316 25.4608 10.1642L23.2572 12.3678M17.9539 7.06445L5.80585 19.2125C5.47378 19.5446 5.26915 19.983 5.22783 20.4508L4.88296 24.3546C4.82819 24.9746 5.34707 25.4935 5.96708 25.4387L9.87093 25.0939C10.3387 25.0525 10.7771 24.8479 11.1092 24.5158L23.2572 12.3678M17.9539 7.06445L23.2572 12.3678" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div onClick={handleSendInvoice} style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M11.25 11.25L16.875 15L22.5 11.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.75 16.875H6.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.25 13.125H6.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.25 9.375V8.25C6.25 7.14543 7.14543 6.25 8.25 6.25H25.5C26.6046 6.25 27.5 7.14543 27.5 8.25V21.75C27.5 22.8546 26.6046 23.75 25.5 23.75H8.25C7.14543 23.75 6.25 22.8546 6.25 21.75V20.625" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              </>
              
            ) : (
              <div onClick={handleSave} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M3.75 24.25V5.75C3.75 4.64543 4.64543 3.75 5.75 3.75H20.4216C20.952 3.75 21.4607 3.96071 21.8358 4.33579L25.6642 8.16421C26.0393 8.53929 26.25 9.04799 26.25 9.57843V24.25C26.25 25.3546 25.3546 26.25 24.25 26.25H5.75C4.64543 26.25 3.75 25.3546 3.75 24.25Z" stroke="black" strokeWidth="1.5"/>
                  <path d="M10.6 11.25H19.4C19.7314 11.25 20 10.9814 20 10.65V4.35C20 4.01863 19.7314 3.75 19.4 3.75H10.6C10.2686 3.75 10 4.01863 10 4.35V10.65C10 10.9814 10.2686 11.25 10.6 11.25Z" stroke="black" strokeWidth="1.5"/>
                  <path d="M7.5 16.85V26.25H22.5V16.85C22.5 16.5186 22.2314 16.25 21.9 16.25H8.1C7.76863 16.25 7.5 16.5186 7.5 16.85Z" stroke="black" strokeWidth="1.5"/>
                </svg>
              </div>
            )}

          </div>
        </div>

        {/* Invoice Body */}
        <div className="invoice-modal-body">
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
                  <p>3100 Corvig-Windermere Road,</p>
                  <p>Suite 201 - #132</p>
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
                  <span className="item-total">${item.total?.toLocaleString()}</span>
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

            {/* Add New Item Button - Only show in edit mode */}
            {mode === 'edit' && (
              <button className="add-new-item-btn">
                Add New Item
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3.33337V12.6667M3.33333 8H12.6667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
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
                  <span className="totals-label">Tax</span>
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
  )
}

export default ViewInvoiceModal