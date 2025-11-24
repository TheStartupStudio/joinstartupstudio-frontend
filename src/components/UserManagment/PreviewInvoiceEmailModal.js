import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './PreviewInvoiceEmailModal.css'

const PreviewInvoiceEmailModal = ({ 
  show, 
  onHide, 
  invoiceData,
  onConfirmSend 
}) => {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('view')
  const [emailData, setEmailData] = useState({
    subject: `Learn to Start Invoice #${invoiceData?.invoiceNumber || '01234'}`,
    clientName: invoiceData?.organizationName || '[Client Name]',
    message: `Dear ${invoiceData?.organizationName || '[Client Name]'},

Please see attached invoice. You may set up a payment method and pay invoices from within your administrative platform.

Thank you for partnering with us on this important mission,

Learn to Start`
  })

  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [
        'bold',
        'italic',
        'underline',
        { list: 'ordered' },
        { list: 'bullet' },
        { align: [] },
        'blockquote',
        'link'
      ]
    ]
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'blockquote',
    'align'
  ]

  const handleChange = (field, value) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSend = async () => {
    setLoading(true)
    
    // Simulate sending email
    setTimeout(() => {
      setLoading(false)
      toast.success('Invoice email sent successfully!')
      onHide()
      if (onConfirmSend) {
        onConfirmSend(emailData)
      }
    }, 1500)
  }

  const handleClose = () => {
    if (loading) return
    onHide()
  }

  const handleSave = () => {
    setMode('view')
    toast.success('Changes saved!')
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={true}
      keyboard={true}
      className="preview-invoice-email-modal"
      centered
      size="lg"
    >
      <div className="preview-email-modal-content">
        {/* Header - Same as ViewInvoiceModal */}
        <div className="preview-email-modal-header">
          <div className="modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 9.16699H12.0833H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 5.83301H12.0833H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66667 12.5V3.1C6.66667 2.76863 6.93529 2.5 7.26667 2.5H16.9C17.2314 2.5 17.5 2.76863 17.5 3.1V14.1667C17.5 16.0076 16.0076 17.5 14.1667 17.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.49935 12.5H6.66602H10.2327C10.5641 12.5 10.8359 12.7682 10.8662 13.0982C10.9879 14.4253 11.5521 17.5 14.166 17.5H6.66602H5.49935C3.84249 17.5 2.49935 16.1569 2.49935 14.5C2.49935 13.3954 3.39478 12.5 4.49935 12.5Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h4 className="preview-email-modal-title">Preview Invoice Email</h4>

          <div className="header-icons-nav">
            <div onClick={handleClose} style={{ cursor: 'pointer' }} title="Go back">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {mode === 'view' ? (
              <>
                <div onClick={() => setMode('edit')} style={{ cursor: 'pointer' }} title="Edit email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M17.9539 7.06445L20.1575 4.86091C20.9385 4.07986 22.2049 4.07986 22.9859 4.86091L25.4608 7.33579C26.2418 8.11683 26.2418 9.38316 25.4608 10.1642L23.2572 12.3678M17.9539 7.06445L5.80585 19.2125C5.47378 19.5446 5.26915 19.983 5.22783 20.4508L4.88296 24.3546C4.82819 24.9746 5.34707 25.4935 5.96708 25.4387L9.87093 25.0939C10.3387 25.0525 10.7771 24.8479 11.1092 24.5158L23.2572 12.3678M17.9539 7.06445L23.2572 12.3678" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div onClick={handleSend} style={{ cursor: loading ? 'not-allowed' : 'pointer' }} title="Send email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M26.25 3.75L13.125 16.875" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M26.25 3.75L17.5 26.25L13.125 16.875L3.75 12.5L26.25 3.75Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </>
            ) : (
              <div onClick={handleSave} style={{ cursor: 'pointer' }} title="Save changes">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M3.75 24.25V5.75C3.75 4.64543 4.64543 3.75 5.75 3.75H20.4216C20.952 3.75 21.4607 3.96071 21.8358 4.33579L25.6642 8.16421C26.0393 8.53929 26.25 9.04799 26.25 9.57843V24.25C26.25 25.3546 25.3546 26.25 24.25 26.25H5.75C4.64543 26.25 3.75 25.3546 3.75 24.25Z" stroke="black" strokeWidth="1.5"/>
                  <path d="M10.6 11.25H19.4C19.7314 11.25 20 10.9814 20 10.65V4.35C20 4.01863 19.7314 3.75 19.4 3.75H10.6C10.2686 3.75 10 4.01863 10 4.35V10.65C10 10.9814 10.2686 11.25 10.6 11.25Z" stroke="black" strokeWidth="1.5"/>
                  <path d="M7.5 16.85V26.25H22.5V16.85C22.5 16.5186 22.2314 16.25 21.9 16.25H8.1C7.76863 16.25 7.5 16.5186 7.5 16.85Z" stroke="black" strokeWidth="1.5"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Email Preview Body */}
        <div className="preview-email-modal-body">
          {/* Email Subject */}
          <div className="email-field-group">
            {mode === 'view' ? (
              <div className="email-subject-view">
                {emailData.subject}
              </div>
            ) : (
                <>
                <label className="email-field-label">Subject:</label>
              <input
                type="text"
                className="email-subject-input"
                value={emailData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                disabled={loading}
              />

              </>
            )}
          </div>

          {/* Email Content */}
          <div className="email-content-box">
            {mode === 'view' ? (
              <div className="email-message-view">
                <ReactQuill
                  theme="snow"
                  value={emailData.message}
                  readOnly={true}
                  modules={{ toolbar: false }}
                  className="preview-email-quill-view"
                />
              </div>
            ) : (
              <ReactQuill
                theme="snow"
                value={emailData.message}
                onChange={(value) => handleChange('message', value)}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Add your email message here..."
                className="preview-email-quill-edit"
              />
            )}

            <div className="d-flex gap-2 align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.8646 9.71885L10.2063 17.3772C9.26809 18.3154 7.99562 18.8425 6.6688 18.8425C5.34198 18.8425 4.0695 18.3154 3.1313 17.3772C2.19309 16.439 1.66602 15.1665 1.66602 13.8397C1.66602 12.5129 2.19309 11.2404 3.1313 10.3022L10.7896 2.64385C11.4151 2.01838 12.2634 1.66699 13.148 1.66699C14.0325 1.66699 14.8808 2.01838 15.5063 2.64385C16.1318 3.26931 16.4831 4.11763 16.4831 5.00218C16.4831 5.88673 16.1318 6.73504 15.5063 7.36051L7.83963 15.0188C7.52689 15.3316 7.10274 15.5073 6.66046 15.5073C6.21819 15.5073 5.79403 15.3316 5.4813 15.0188C5.16856 14.7061 4.99287 14.282 4.99287 13.8397C4.99287 13.3974 5.16856 12.9732 5.4813 12.6605L12.5563 5.59385" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <label>
                    [Organization Name] Invoice 01234
                </label>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PreviewInvoiceEmailModal