import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import {useCallback} from 'react'
import DataTable from '../../DataTable'
import AcademyBtn from '../../AcademyBtn'
import UserManagementPopup from '../AlertPopup'
import AddNewLearner from '../AddNewLearner'
import ViewLearnerModal from '../ViewLearnerModal'
import BulkAddLearnersModal from '../BulkAddLearnersModal'
import groupAdd from '../../../assets/images/academy-icons/svg/user-group-add.svg'
import userPlus from '../../../assets/images/academy-icons/svg/Icon_User_Add_Alt.svg'
import userDeactivate from '../../../assets/images/academy-icons/svg/Icon_User_de.svg'
import warningTriangle from '../../../assets/images/academy-icons/svg/warning-triangle.svg'
import userPassword from '../../../assets/images/academy-icons/svg/Icon_User_Pass.svg'
import download from '../../../assets/images/academy-icons/svg/download.svg'
import newCity from '../../../assets/images/academy-icons/credit-card-slash.png'
import leftArrow from '../../../assets/images/academy-icons/left-arrow.png'
import { invoiceApi } from '../../../utils/invoiceApi'
import InvoiceFilters from '../../InvoiceFilters'
import ViewInvoiceModal from '../ViewInvoiceModal'
import PreviewInvoiceEmailModal from '../PreviewInvoiceEmailModal'
import './index.css'

const ViewFailedPayments = ({ show, onHide }) => {
  const { user } = useSelector((state) => state.user?.user || {})
  const userRole = user?.role_id || localStorage.getItem('role')

  const isInstructor = user?.role_id === 2
  const isSuperAdmin = user?.role_id === 3 || userRole === 'super-admin'

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [filters, setFilters] = useState({
    organizationName: '',
    dateFrom: null,
    dateTo: null
  })

  // Modal states
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [invoiceMode, setInvoiceMode] = useState('view')
  const [showPreviewEmailModal, setShowPreviewEmailModal] = useState(false)
  const [invoiceToSend, setInvoiceToSend] = useState(null)

  // Data and pagination
  const [failedPaymentsData, setFailedPaymentsData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  const searchContainerRef = useRef(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const getOrganizationId = () => {
    if (isSuperAdmin) {
      return null
    } else {
      return user?.universityId || user?.University?.id
    }
  }

  // Fetch failed payments data (filtered invoices)
  const fetchFailedPayments = async (page = 1, search = '', appliedFilters = filters) => {
    setLoading(true)
    try {
      console.log('Fetching failed payments with params:', { page, search, filters: appliedFilters, userRole: user?.role_id })

      // Build query parameters including filters
      const queryParams = {
        page,
        limit: 10,
        search,
        status: 'payment_failed' // Filter for failed payments
      }

      // Add filter parameters
      if (appliedFilters.organizationName && appliedFilters.organizationName.trim()) {
        queryParams.organizationName = appliedFilters.organizationName.trim()
        console.log('Adding organizationName filter:', queryParams.organizationName)
      }

      if (appliedFilters.dateFrom) {
        // Convert Date object to YYYY-MM-DD format
        const dateFromStr = appliedFilters.dateFrom instanceof Date
          ? appliedFilters.dateFrom.toISOString().split('T')[0]
          : appliedFilters.dateFrom
        queryParams.dateFrom = dateFromStr
        console.log('Adding dateFrom filter:', queryParams.dateFrom)
      }

      if (appliedFilters.dateTo) {
        // Convert Date object to YYYY-MM-DD format
        const dateToStr = appliedFilters.dateTo instanceof Date
          ? appliedFilters.dateTo.toISOString().split('T')[0]
          : appliedFilters.dateTo
        queryParams.dateTo = dateToStr
        console.log('Adding dateTo filter:', queryParams.dateTo)
      }

      console.log('Final query params:', queryParams)

      let response

      if (isInstructor) {
        response = await invoiceApi.getClientInvoices(queryParams)
      } else if (isSuperAdmin) {
        response = await invoiceApi.getAllInvoices(queryParams)
      } else {
        // For other roles (if any)
        response = await invoiceApi.getClientInvoices(queryParams)
      }

      console.log('Failed payments response:', response)

      const invoicesData = response.data || []

      setFailedPaymentsData(invoicesData)
      setPagination(response.pagination || {
        total: invoicesData.length,
        page,
        limit: 10,
        totalPages: Math.ceil(invoicesData.length / 10)
      })
    } catch (error) {
      console.error('Error fetching failed payments:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load failed payments data'
      toast.error(errorMessage)
      setFailedPaymentsData([])
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when modal opens or when search/page changes
  useEffect(() => {
    if (show && user) {
      console.log('User changed, fetching failed payments:', user)
      fetchFailedPayments(currentPage, debouncedSearchQuery, filters)
    }
  }, [show, currentPage, debouncedSearchQuery, user, filters])

  // Reset state when modal closes
  useEffect(() => {
    if (!show) {
      setSearchQuery('')
      setCurrentPage(1)
      setFailedPaymentsData([])
      setFilters({
        organizationName: '',
        dateFrom: null,
        dateTo: null
      })
      setSelectedInvoices([])
    }
  }, [show])

  const handleClickOutside = (event) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
      setShowFilters(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const failedPaymentsColumns = useMemo(() => {
    if (isInstructor) {
      return [
        {
          key: 'invoiceNumber',
          title: 'INVOICE NUMBER',
          sortable: true,
          filterable: false,
          render: (value) => (
            <div className="organization-id">{value}</div>
          )
        },
        {
          key: 'status',
          title: 'STATUS',
          sortable: true,
          filterable: true,
          render: (value) => (
            <span className={`status-badge status-${value.toLowerCase()}`}>
              <span className="status-dot"></span>
              {value}
            </span>
          )
        },
        {
          key: 'issueDate',
          title: 'INVOICE DATE',
          sortable: true,
          filterable: true,
          render: (value) => (
            <span className="invoice-date">
              {value ? new Date(value).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              }) : 'N/A'}
            </span>
          )
        },
        {
          key: 'paymentDate',
          title: 'PAYMENT DATE',
          sortable: true,
          filterable: true,
          render: (value) => (
            <span className="payment-date">
              {value ? new Date(value).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              }) : 'N/A'}
            </span>
          )
        }
      ]
    }

    return [
      {
        key: 'organizationName',
        title: 'ORGANIZATION NAME',
        sortable: true,
        filterable: false,
        render: (value, item) => (
          <div className="invoice-organization-info">
            <div className="organization-name">{item.organizationName}</div>
            <div className="organization-id">{item.invoiceNumber}</div>
          </div>
        )
      },
      {
        key: 'status',
        title: 'STATUS',
        sortable: true,
        filterable: true,
        render: (value) => (
          <span className={`status-badge status-${value.toLowerCase()}`}>
            <span className="status-dot"></span>
            {value}
          </span>
        )
      },
      {
        key: 'invoiceDate',
        title: 'INVOICE DATE',
        sortable: true,
        filterable: true,
        render: (value) => (
          <span className="invoice-date">
            {value ? new Date(value).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            }) : 'N/A'}
          </span>
        )
      },
      {
        key: 'paymentDate',
        title: 'PAYMENT DATE',
        sortable: true,
        filterable: true,
        render: (value) => (
          <span className="payment-date">
            {value ? new Date(value).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            }) : 'N/A'}
          </span>
        )
      }
    ]
  }, [isInstructor])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleFiltersChange = useCallback((newFilters) => {
    console.log('Filters changed:', newFilters)
    setFilters(prevFilters => {
      // Only update if filters actually changed
      if (
        prevFilters.organizationName !== newFilters.organizationName ||
        prevFilters.dateFrom !== newFilters.dateFrom ||
        prevFilters.dateTo !== newFilters.dateTo
      ) {
        return newFilters
      }
      return prevFilters
    })
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const handleSelectionChange = (selectedItems) => {
    setSelectedInvoices(selectedItems)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for invoice:`, item)

    switch (actionType) {
      case 'view':
        setSelectedInvoice(item)
        setInvoiceMode('view')
        setShowEditInvoiceModal(true)
        break
      case 'export-invoice-pdf':
        handleExportInvoicePDF(item)
        break
      case 'download-invoice':
        handleDownloadInvoice(item)
        break
      case 'send-invoice':
      case 'send':
        handleSendInvoice(item)
        break
      default:
        break
    }
  }

  const handleExportInvoicePDF = async (invoice) => {
    if (!invoice?.id) {
      toast.error('Invalid invoice')
      return
    }

    try {
      setLoading(true)
      toast.success('Generating PDF...')

      // Open the modal to trigger PDF generation
      setSelectedInvoice(invoice)
      setInvoiceMode('view')
      setShowEditInvoiceModal(true)

      // Wait for modal to render, then trigger download
      setTimeout(() => {
        const downloadBtn = document.querySelector('.header-icons-nav svg[title="Download Invoice as PDF"]')?.parentElement
        if (downloadBtn) {
          downloadBtn.click()
          // Close modal after brief delay
          setTimeout(() => {
            setShowEditInvoiceModal(false)
          }, 5000)
        } else {
          toast.error('Unable to generate PDF. Please try again.')
        }
      }, 800)
    } catch (error) {
      console.error('❌ Error exporting invoice PDF:', error)
      toast.error('Failed to export invoice')
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1500)
    }
  }

  const handleDownloadInvoice = async (invoice) => {
    if (!invoice?.id) {
      toast.error('Invalid invoice')
      return
    }

    try {
      setLoading(true)
      toast.info('Downloading invoice...')

      try {
        await invoiceApi.downloadClientInvoice(invoice.id)

        toast.success(`Invoice ${invoice.invoiceNumber} downloaded successfully!`)
        return
      } catch (backendError) {
        console.log('Backend PDF not available, using client-side generation')
        setSelectedInvoice(invoice)
        setInvoiceMode('view')
        setShowEditInvoiceModal(true)

        setTimeout(() => {
          const downloadBtn = document.querySelector('.header-icons-nav svg[title="Download Invoice as PDF"]')?.parentElement
          if (downloadBtn) {
            downloadBtn.click()
          }
        }, 500)
      }
    } catch (error) {
      console.error('❌ Error downloading invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to download invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvoice = async (invoice) => {
    if (!invoice?.id) {
      toast.error('Invalid invoice')
      return
    }

    // Open preview modal instead of sending directly
    setInvoiceToSend(invoice)
    setShowPreviewEmailModal(true)
  }

  const handleConfirmSendEmail = async (emailData) => {
    if (!invoiceToSend?.id) {
      toast.error('Invalid invoice')
      return
    }

    try {
      setLoading(true)

      await invoiceApi.sendInvoiceEmail(invoiceToSend.id, {
        subject: emailData.subject,
        message: emailData.message
      })

      toast.success(`Invoice ${invoiceToSend.invoiceNumber} sent successfully!`)
      setShowPreviewEmailModal(false)
      setInvoiceToSend(null)
    } catch (error) {
      console.error('❌ Error sending invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to send invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmBulkSendEmail = async (emailData) => {
    if (selectedInvoices.length === 0) {
      toast.error('No invoices selected')
      return
    }

    try {
      setLoading(true)

      const sendPromises = selectedInvoices.map(invoice =>
        invoiceApi.sendInvoiceEmail(invoice.id, {
          subject: emailData.subject.replace(selectedInvoices[0].invoiceNumber, invoice.invoiceNumber),
          message: emailData.message.replace(selectedInvoices[0].organizationName, invoice.organizationName)
        })
      )

      const results = await Promise.allSettled(sendPromises)

      const succeeded = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      if (succeeded > 0) {
        toast.success(`${succeeded} invoice(s) sent successfully!`)
      }

      if (failed > 0) {
        toast.warning(`${failed} invoice(s) failed to send`)
      }

      setSelectedInvoices([])
      setShowPreviewEmailModal(false)
      setInvoiceToSend(null)

    } catch (error) {
      console.error('❌ Error sending invoices:', error)
      toast.error('Failed to send some invoices')
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
      className="view-failed-payment-modal"
      centered
      size="xl"
    >
      <div className="modal-content-wrapper">
        {/* Header */}
        <div className="modal-header-learners position-relative">
          <div className="d-flex flex-column gap-3">
            <img 
              src={newCity} 
              style={{
                padding: '8px', 
                borderRadius:"50%", 
                backgroundColor: "#E2E6EC", 
                width: 'fit-content',
                width: '36px',
                height: '36px'
              }} 
              alt="icon"
            />
            <p style={{
              color: '#231F20',
              fontSize: '15px',
              fontWeight: 500,
            }}>
              View Failed Payments
            </p>
          </div>

          <div style={{
            display: 'flex',
            height: 64,
            padding: 17,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 28,
            borderRadius: '0px 24px 0px 24px',
            background: 'var(--COLORS-White, #FFF)',
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.25)',
            position: 'absolute',
            top: -26,
            right: -26,
            cursor: 'pointer'
          }}
            onClick={onHide}
          >
            <img src={leftArrow} alt="back" />
          </div>
        </div>

        <div style={{
          borderRadius: 24,
          background: 'var(--Glassy-White, rgba(255, 255, 255, 0.10))',
          boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(60px)',
        }}>
          {/* Search Bar */}
          <div className="search-actions-bar-failed-payments">
            <div className="search-container-failed-payments" ref={searchContainerRef}>
              <div className="search-input-wrapper-failed-payments">
                <input
                  type="text"
                  placeholder="Search for Invoice"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input-failed-payments"
                />
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {showFilters && (
                <InvoiceFilters
                  show={showFilters}
                  onHide={() => setShowFilters(false)}
                  anchorRef={searchContainerRef}
                  onApplyFilters={handleFiltersChange}
                  initialFilters={filters}
                />
              )}
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <DataTable
              columns={failedPaymentsColumns}
              data={failedPaymentsData}
              searchQuery={searchQuery}
              onRowAction={handleRowAction}
              showCheckbox={true}
              activeTab="FailedPayments"
              loading={loading}
              onSelectionChange={handleSelectionChange}
              selectedItems={selectedInvoices}
            />
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 6L5 12L11 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6L13 12L19 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M15.75 6L9.75 12L15.75 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="pagination-info">{currentPage} / {pagination.totalPages}</span>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 6L19 12L13 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 6L11 12L5 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <ViewInvoiceModal
          show={showEditInvoiceModal}
          onHide={() => {
            setShowEditInvoiceModal(false)
            setSelectedInvoice(null)
            setInvoiceMode('view')
          }}
          onSuccess={() => {
            fetchFailedPayments(currentPage, debouncedSearchQuery, filters)
          }}
          invoiceData={selectedInvoice}
          mode={invoiceMode}
        />

        <PreviewInvoiceEmailModal
          show={showPreviewEmailModal}
          onHide={() => {
            setShowPreviewEmailModal(false)
            setInvoiceToSend(null)
          }}
          invoiceData={invoiceToSend}
          onConfirmSend={selectedInvoices.length > 1 ? handleConfirmBulkSendEmail : handleConfirmSendEmail}
        />
      </div>
    </Modal>
  )
}

export default ViewFailedPayments