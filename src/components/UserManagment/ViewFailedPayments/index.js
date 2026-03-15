import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import DataTable from '../../DataTable'
import ViewLearnerModal from '../ViewLearnerModal'
import newCity from '../../../assets/images/academy-icons/credit-card-slash.png'
import leftArrow from '../../../assets/images/academy-icons/left-arrow.png'
import { invoiceApi } from '../../../utils/invoiceApi'
import InvoiceFilters from '../../InvoiceFilters'
import ViewInvoiceModal from '../ViewInvoiceModal'
import PreviewInvoiceEmailModal from '../PreviewInvoiceEmailModal'
import ContactLTSModal from '../ContactLTSModal'
import axiosInstance from '../../../utils/AxiosInstance'
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
  const [showViewLearnerModal, setShowViewLearnerModal] = useState(false)
  const [selectedLearner, setSelectedLearner] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactInvoiceContext, setContactInvoiceContext] = useState(null)

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

      const rawData = response.data || []
      const invoicesData = rawData.map(inv => {
        const dateAdded = inv.issueDate || inv.invoiceDate || inv.createdAt
        let dateFailed = inv.paymentDate
        if (!dateFailed && dateAdded) {
          const d = new Date(dateAdded)
          d.setDate(d.getDate() + 31)
          dateFailed = d.toISOString().split('T')[0]
        }
        return {
          ...inv,
          dateAdded,
          dateFailed
        }
      })

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

  const failedPaymentsColumns = useMemo(() => [
    {
      key: 'invoiceNumber',
      title: 'INVOICE NUMBER',
      sortable: true,
      filterable: false,
      render: (value) => <span>{value}</span>
    },
    {
      key: 'status',
      title: 'STATUS',
      sortable: true,
      filterable: false,
      render: (value) => (
        <span className={`status-badge status-${(value || '').toLowerCase().replace(/\s/g, '-')}`}>
          <span className="status-dot"></span>
          {value || 'Failed'}
        </span>
      )
    },
    {
      key: 'dateAdded',
      title: 'DATE ADDED',
      sortable: true,
      filterable: false,
      render: (value, item) => {
        const date = value || item.issueDate || item.invoiceDate
        return (
          <span className="invoice-date">
            {date ? new Date(date).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            }) : 'N/A'}
          </span>
        )
      }
    },
    {
      key: 'dateFailed',
      title: 'DATE FAILED',
      sortable: true,
      filterable: false,
      render: (value, item) => {
        const date = value || item.paymentDate
        return (
          <span className="payment-date">
            {date ? new Date(date).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            }) : 'N/A'}
          </span>
        )
      }
    }
  ], [])

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

  const handleViewLearner = async (item) => {
    const organizationId = item.organizationId
    if (!organizationId) {
      toast.error('No organization linked to this invoice')
      return
    }
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/super-admin/universities/${organizationId}/learners`, {
        params: { page: 1, limit: 1 }
      })
      if (response.data?.success && response.data?.data?.length > 0) {
        const learner = response.data.data[0]
        const mapped = {
          id: learner.id,
          name: learner.name,
          organization_name: learner.organization_name,
          email: learner.email,
          level: learner.level,
          reflections: learner.reflections,
          total_paid: learner.total_paid,
          last_active: learner.last_active,
          trial_start: learner.trial_start,
          activation_date: learner.member_since,
          activeStatus: learner.activeStatus
        }
        setSelectedLearner(mapped)
        setShowViewLearnerModal(true)
      } else {
        toast.info('No learners found for this organization')
      }
    } catch (err) {
      console.error('Error fetching learners:', err)
      toast.error('Failed to load learner')
    } finally {
      setLoading(false)
    }
  }

  const handleArchiveInvoice = async (item) => {
    if (!item?.id) return
    try {
      setLoading(true)
      await invoiceApi.archiveInvoice(item.id)
      toast.success('Invoice archived')
      fetchFailedPayments(currentPage, debouncedSearchQuery, filters)
    } catch (err) {
      console.error('Error archiving invoice:', err)
      toast.error(err.response?.data?.message || 'Failed to archive invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInvoice = async (item) => {
    if (!item?.id) return
    if (!window.confirm(`Delete invoice ${item.invoiceNumber || item.id}?`)) return
    try {
      setLoading(true)
      await invoiceApi.deleteInvoice(item.id)
      toast.success('Invoice deleted')
      fetchFailedPayments(currentPage, debouncedSearchQuery, filters)
    } catch (err) {
      console.error('Error deleting invoice:', err)
      toast.error(err.response?.data?.message || 'Failed to delete invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleRowAction = (actionType, item) => {
    switch (actionType) {
      case 'view':
        handleViewLearner(item)
        break
      case 'contact':
        setContactInvoiceContext(item)
        setShowContactModal(true)
        break
      case 'archive-invoice':
        handleArchiveInvoice(item)
        break
      case 'delete-invoice':
        handleDeleteInvoice(item)
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
                <div className="d-flex gap-2">

            
                  <input
                    type="text"
                    placeholder="Search for Invoice"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input-failed-payments search-input-icon-right"
                  />
                  <svg className="search-icon search-icon-right" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
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

        <ViewLearnerModal
          show={showViewLearnerModal}
          onHide={() => {
            setShowViewLearnerModal(false)
            setSelectedLearner(null)
          }}
          learner={selectedLearner}
        />

        <ContactLTSModal
          show={showContactModal}
          onHide={() => {
            setShowContactModal(false)
            setContactInvoiceContext(null)
          }}
          organizationName={contactInvoiceContext?.organizationName}
          organizationId={contactInvoiceContext?.organizationId}
        />
      </div>
    </Modal>
  )
}

export default ViewFailedPayments