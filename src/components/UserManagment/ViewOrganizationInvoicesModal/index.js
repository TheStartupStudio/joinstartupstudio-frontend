import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import DataTable from '../../DataTable'
import newCity from '../../../assets/images/academy-icons/svg/city.svg'
import leftArrow from '../../../assets/images/academy-icons/left-arrow.png'
import axiosInstance from '../../../utils/AxiosInstance'
import ViewInvoiceModal from '../ViewInvoiceModal'
import DeleteInvoicePopup from '../DeleteInvoicePopup'
import '../ViewOrganizationLearnersModal.css'

const ViewOrganizationInvoicesModal = ({ show, onHide, organizationName, organizationId }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Data and pagination
  const [invoicesData, setInvoicesData] = useState([])
  const [invoicesLoading, setInvoicesLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  // Modals
  const [showViewInvoiceModal, setShowViewInvoiceModal] = useState(false)
  const [showDeleteInvoicePopup, setShowDeleteInvoicePopup] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [invoiceMode, setInvoiceMode] = useState('view')

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch invoices data
  const fetchInvoices = async (page = 1, search = '') => {
    if (!organizationId) return

    setInvoicesLoading(true)
    try {
      const params = {
        page,
        limit: 10,
        search,
        organizationId: organizationId
      }

      const response = await axiosInstance.get('/invoices', { params })

      if (response.data.success) {
        setInvoicesData(response.data.data)
        setPagination({
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          totalPages: response.data.pagination.totalPages
        })
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error('Failed to load invoices data')
    } finally {
      setInvoicesLoading(false)
    }
  }

  // Fetch data when modal opens or when search/page changes
  useEffect(() => {
    if (show && organizationId) {
      fetchInvoices(currentPage, debouncedSearchQuery)
    }
  }, [show, organizationId, currentPage, debouncedSearchQuery])

  // Reset state when modal closes
  useEffect(() => {
    if (!show) {
      setSearchQuery('')
      setCurrentPage(1)
      setInvoicesData([])
    }
  }, [show])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return '#28A745'
      case 'pending':
        return '#FFC107'
      case 'overdue':
        return '#DC3545'
      case 'cancelled':
        return '#6C757D'
      default:
        return '#6C757D'
    }
  }

  const invoicesColumns = useMemo(() => [
    {
      key: 'invoiceNumber',
      title: 'INVOICE NUMBER',
      sortable: true,
      render: (value, item) => (
        <div className="invoice-info">
          <div className="invoice-details">
            <div className="invoice-number" style={{ fontWeight: '600' }}>
              {value || 'N/A'}
            </div>
            <div className="invoice-date" style={{ fontSize: '12px', color: '#666' }}>
              {item.issueDate ? new Date(item.issueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'STATUS',
      sortable: true,
      render: (value) => (
        <span className={`status-badge status-${value.toLowerCase()}`}>
                      <span className="status-dot"></span>
                      {value}
                    </span>
      )
    },
    {
      key: 'issueDate',
      title: 'ISSUE DATE',
      sortable: true,
      render: (value) => (
        <span className="invoice-date">
          {value ? new Date(value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A'}
        </span>
      )
    },
    {
      key: 'dueDate',
      title: 'DUE DATE',
      sortable: true,
      render: (value) => (
        <span className="payment-date">
          {value ? new Date(value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A'}
        </span>
      )
    }
  ], [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for invoice:`, item)
    
    switch (actionType) {
      case 'view-invoice':
        setSelectedInvoice(item)
        setInvoiceMode('view')
        setShowViewInvoiceModal(true)
        break
      case 'edit-invoice':
        setSelectedInvoice(item)
        setInvoiceMode('edit')
        setShowViewInvoiceModal(true)
        break
      case 'send-invoice':
        handleSendInvoice(item)
        break
      case 'archive-invoice':
        handleArchiveInvoice(item)
        break
      case 'delete-invoice':
        setSelectedInvoice(item)
        setShowDeleteInvoicePopup(true)
        break
      default:
        break
    }
  }

  const handleSendInvoice = async (invoice) => {
    try {
      const response = await axiosInstance.post(`/super-admin/invoices/${invoice.id}/send`)
      
      if (response.data.success) {
        toast.success('Invoice sent successfully!')
        fetchInvoices(currentPage, debouncedSearchQuery)
      }
    } catch (error) {
      console.error('Error sending invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to send invoice')
    }
  }

  const handleArchiveInvoice = async (invoice) => {
    try {
      const endpoint = invoice.isArchived 
        ? `/super-admin/invoices/${invoice.id}/unarchive`
        : `/super-admin/invoices/${invoice.id}/archive`

      const response = await axiosInstance.patch(endpoint)

      if (response.data.success) {
        toast.success(
          invoice.isArchived 
            ? 'Invoice unarchived successfully'
            : 'Invoice archived successfully'
        )
        fetchInvoices(currentPage, debouncedSearchQuery)
      }
    } catch (error) {
      console.error('Error archiving invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to archive invoice')
    }
  }

  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return

    try {
      const response = await axiosInstance.delete(`/invoices/${selectedInvoice.id}`)

      if (response.data.success) {
        toast.success('Invoice deleted successfully!')
        setShowDeleteInvoicePopup(false)
        setSelectedInvoice(null)
        fetchInvoices(currentPage, debouncedSearchQuery)
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to delete invoice')
    }
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop={true}
        keyboard={true}
        className="view-organization-learners-modal"
        centered
        size="xl"
      >
        <div className="modal-content-wrapper">
          {/* Header */}
          <div className="modal-header-learners position-relative">
            <div className="d-flex flex-column gap-3">
              <img src={newCity} style={{padding: '8px', borderRadius:"50%", backgroundColor: "#E2E6EC", width: 'fit-content'}} />
              <p
                style={{
                  color: '#231F20',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >View Organization Invoices</p>
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

            <div className="header-content">
              <h2 className="organization-name">{organizationName || 'ORGANIZATION NAME'}</h2>
            </div>

            {/* Search Bar */}
            <div className="search-actions-bar">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search for Invoice"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                  />
                  <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <DataTable 
                columns={invoicesColumns}
                data={invoicesData}
                searchQuery={searchQuery}
                onRowAction={handleRowAction}
                showCheckbox={false}
                activeTab="Invoices"
                loading={invoicesLoading}
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
        </div>
      </Modal>

      {/* View/Edit Invoice Modal */}
      <ViewInvoiceModal
        show={showViewInvoiceModal}
        onHide={() => {
          setShowViewInvoiceModal(false)
          setSelectedInvoice(null)
        }}
        invoiceData={selectedInvoice}
        mode={invoiceMode}
        onSuccess={() => {
          setShowViewInvoiceModal(false)
          setSelectedInvoice(null)
          fetchInvoices(currentPage, debouncedSearchQuery)
        }}
      />

      {/* Delete Invoice Popup */}
      <DeleteInvoicePopup
        show={showDeleteInvoicePopup}
        onHide={() => {
          setShowDeleteInvoicePopup(false)
          setSelectedInvoice(null)
        }}
        onConfirm={handleDeleteInvoice}
        invoiceName={selectedInvoice?.invoiceNumber}
      />
    </>
  )
}

export default ViewOrganizationInvoicesModal