import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import { useDispatch } from 'react-redux'
import { userLogin } from '../../redux'
import './UserAgreementModal.css'

const UserAgreementModal = ({ show, onSuccess, onHide }) => {
  const [loading, setLoading] = useState(false)
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false)
  const [agreedToPledge, setAgreedToPledge] = useState(false)
  const dispatch = useDispatch()

  const handleAccept = async () => {
    if (!agreedToGuidelines || !agreedToPledge) {
      toast.error('Please agree to both terms before continuing')
      return
    }

    setLoading(true)
    try {
      await axiosInstance.post('/forum/user/accept-agreement')
      
      // Refresh user data to update hasAgreedToTerms
      await dispatch(userLogin())
      
      toast.success('Agreement accepted successfully!')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error accepting agreement:', error)
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to accept agreement. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const canContinue = agreedToGuidelines && agreedToPledge

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={true}
      keyboard={true}
      centered
      className="user-agreement-modal"
      size="lg"
    >
      <Modal.Header className="border-0 pb-0 d-flex flex-column gap-2">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center' , width: '36px', height: '36px', backgroundColor: '#E2E6EC', borderRadius: '50%'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83301 15V14.1667C5.83301 11.8655 7.69849 10 9.99967 10C12.3009 10 14.1663 11.8655 14.1663 14.1667V15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M0.833008 15.0013V14.168C0.833008 12.7873 1.9523 11.668 3.33301 11.668" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.167 15.0013V14.168C19.167 12.7873 18.0477 11.668 16.667 11.668" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 10C11.3807 10 12.5 8.88071 12.5 7.5C12.5 6.11929 11.3807 5 10 5C8.61929 5 7.5 6.11929 7.5 7.5C7.5 8.88071 8.61929 10 10 10Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.33366 11.6654C4.25413 11.6654 5.00033 10.9192 5.00033 9.9987C5.00033 9.07822 4.25413 8.33203 3.33366 8.33203C2.41318 8.33203 1.66699 9.07822 1.66699 9.9987C1.66699 10.9192 2.41318 11.6654 3.33366 11.6654Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.6667 11.6654C17.5871 11.6654 18.3333 10.9192 18.3333 9.9987C18.3333 9.07822 17.5871 8.33203 16.6667 8.33203C15.7462 8.33203 15 9.07822 15 9.9987C15 10.9192 15.7462 11.6654 16.6667 11.6654Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <Modal.Title style={{ fontSize: '15px', fontWeight: '500', color: '#231F20' }}>
          User Agreement
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-3 pb-4">
        <p style={{ fontSize: '15px', textAlign:'center', fontWeight: '400' , color: '#000', lineHeight: '1.6', margin: '40px 20px' }}>
          Prior to accessing the Community Forum for the first time, please read the <a>Community Guidelines</a> and <a>Safety Pledge</a>. Then, check the boxes below to indicate that you agree to the Safety Pledge and will abide by the Community Guidelines.
        </p>

        <div className="agreement-checkboxes" style={{ marginBottom: '30px' }}>
          <Form.Check 
            type="checkbox"
            id="guidelines-checkbox"
            checked={agreedToGuidelines}
            onChange={(e) => setAgreedToGuidelines(e.target.checked)}
            label="I have read the Community Guidelines and agree to abide by them."
            style={{ marginBottom: '20px' }}
            className="custom-checkbox"
          />
          
          <Form.Check 
            type="checkbox"
            id="pledge-checkbox"
            checked={agreedToPledge}
            onChange={(e) => setAgreedToPledge(e.target.checked)}
            label="I have read the Safety Pledge and agree to it."
            className="custom-checkbox"
          />
        </div>

        <div className="d-flex justify-content-center">
          <Button
            onClick={handleAccept}
            disabled={!canContinue || loading}
            style={{
                width: '250px',
                height: '54px',
              padding: '12px 40px',
              fontSize: '17px',
              fontWeight: '600',
              borderRadius: '8px',
              backgroundColor: canContinue ? '#52C7DE' : '#AEAEAE',
              border: 'none',
              color: 'white',
              cursor: canContinue ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: canContinue ? '0 4px 10px rgba(82, 199, 222, 0.3)' : 'none'
            }}
          >
            {loading ? (
              <>
                {/* <span className="spinner-border spinner-border-sm me-2" /> */}
                Processing...
              </>
            ) : (
              'CONTINUE'
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default UserAgreementModal
