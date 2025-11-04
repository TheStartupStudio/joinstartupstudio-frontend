import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import './index.css'

const PricingModal = ({ show, onHide, pricing, onSave }) => {
  const [pricingData, setPricingData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pricing && pricing.length > 0) {
      setPricingData(pricing)
    }
  }, [pricing])

  const handlePricingChange = (index, field, value) => {
    const updatedPricing = [...pricingData]
    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: value
    }
    setPricingData(updatedPricing)
  }

  const addNewPricingTier = () => {
    setPricingData([...pricingData, { amount: '', frequency: 'Per month' }])
  }

  const removePricingTier = (index) => {
    if (pricingData.length > 1) {
      const updatedPricing = pricingData.filter((_, i) => i !== index)
      setPricingData(updatedPricing)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave(pricingData)
      setLoading(false)
      onHide()
    } catch (error) {
      console.error('Error saving pricing:', error)
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setPricingData(pricing)
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      centered
      size="md"
      className="pricing-edit-modal"
    >
      <Modal.Body className="pricing-modal-body">

        <div className="d-flex gap-2 flex-column">
            <div className="modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13.4621 5.96152C12.6717 5.17115 11.2798 4.6214 10.0006 4.58697M6.53906 13.4615C7.28269 14.453 8.66532 15.0185 10.0006 15.0665M10.0006 4.58697C8.47853 4.54602 7.11598 5.23458 7.11598 7.11537C7.11598 10.5769 13.4621 8.84613 13.4621 12.3076C13.4621 14.2819 11.7731 15.1302 10.0006 15.0665M10.0006 4.58697V2.5M10.0006 15.0665V17.4999" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>

            <h5 className="pricing-modal-title">Edit Pricing</h5>
        </div>

        <div className="pricing-section-modal">
          <div className="section-header-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_3587_14757)">
                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
              </g>
            </svg>
            <span>Pricing Details</span>
          </div>

          <div className="pricing-details-modal">
            {pricingData.map((price, index) => (
              <div key={index} className="pricing-item-edit-modal">
                <div className="pricing-inputs-modal">
                  <div className="price-input-group-modal">
                    <input
                      type="number"
                      className="price-input-modal"
                      value={price.amount}
                      onChange={(e) => handlePricingChange(index, 'amount', e.target.value)}
                      placeholder="Add dollar amount (ie. $15)"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="frequency-input-group-modal">
                    <select
                      className="frequency-select-modal"
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
                {pricingData.length > 1 && (
                  <button 
                    className="remove-pricing-btn-modal"
                    onClick={() => removePricingTier(index)}
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6663 7.5L15.0038 16.9553C14.8638 17.7522 14.1715 18.3333 13.3624 18.3333H6.63696C5.82783 18.3333 5.13559 17.7522 4.99547 16.9553L3.33301 7.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 4.99984H12.8125M2.5 4.99984H7.1875M7.1875 4.99984V3.33317C7.1875 2.4127 7.93369 1.6665 8.85417 1.6665H11.1458C12.0663 1.6665 12.8125 2.4127 12.8125 3.33317V4.99984M7.1875 4.99984H12.8125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            
            <button 
              className="add-pricing-tier-btn-modal"
              onClick={addNewPricingTier}
              type="button"
            >
              <span>Add new pricing tier</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="pricing-modal-actions">
          <button 
            className="btn-cancel-pricing"
            onClick={handleCancel}
            disabled={loading}
          >
            CANCEL
          </button>
          <button 
            className="btn-save-pricing"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PricingModal