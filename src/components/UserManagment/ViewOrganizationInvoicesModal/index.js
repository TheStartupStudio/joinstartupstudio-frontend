import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import DataTable from '../../DataTable'
import newCity from '../../../assets/images/academy-icons/svg/city.svg'
import leftArrow from '../../../assets/images/academy-icons/left-arrow.png'
import axiosInstance from '../../../utils/AxiosInstance'
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

  // Dummy data for demonstration
  const dummyInvoices = [
    {
      id: 1,
      invoiceMonth: 'January 2024',
      status: 'Complete',
      invoiceDate: '2024-01-15',
      paymentDate: '2024-01-20',
      invoiceUrl: 'https://example.com/invoice/1'
    },
    {
      id: 2,
      invoiceMonth: 'February 2024',
      status: 'Created',
      invoiceDate: '2024-02-15',
      paymentDate: null,
      invoiceUrl: 'https://example.com/invoice/2'
    },
    {
      id: 3,
      invoiceMonth: 'March 2024',
      status: 'Unpaid',
      invoiceDate: '2024-03-15',
      paymentDate: null,
      invoiceUrl: 'https://example.com/invoice/3'
    },
    {
      id: 4,
      invoiceMonth: 'April 2024',
      status: 'Complete',
      invoiceDate: '2024-04-15',
      paymentDate: '2024-04-18',
      invoiceUrl: 'https://example.com/invoice/4'
    },
    {
      id: 5,
      invoiceMonth: 'May 2024',
      status: 'Created',
      invoiceDate: '2024-05-15',
      paymentDate: null,
      invoiceUrl: 'https://example.com/invoice/5'
    },
    {
      id: 6,
      invoiceMonth: 'June 2024',
      status: 'Unpaid',
      invoiceDate: '2024-06-15',
      paymentDate: null,
      invoiceUrl: 'https://example.com/invoice/6'
    },
    {
      id: 7,
      invoiceMonth: 'July 2024',
      status: 'Complete',
      invoiceDate: '2024-07-15',
      paymentDate: '2024-07-22',
      invoiceUrl: 'https://example.com/invoice/7'
    },
    {
      id: 8,
      invoiceMonth: 'August 2024',
      status: 'Created',
      invoiceDate: '2024-08-15',
      paymentDate: null,
      invoiceUrl: 'https://example.com/invoice/8'
    },
    {
      id: 9,
      invoiceMonth: 'September 2024',
      status: 'Unpaid',
      invoiceDate: '2024-09-15',
      paymentDate: null,
      invoiceUrl: 'https://example.com/invoice/9'
    },
    {
      id: 10,
      invoiceMonth: 'October 2024',
      status: 'Complete',
      invoiceDate: '2024-10-15',
      paymentDate: '2024-10-19',
      invoiceUrl: 'https://example.com/invoice/10'
    },
    {
      id: 11,
      invoiceMonth: 'November 2024',
      status: 'Created',
      invoiceDate: '2024-11-15',
      paymentDate: null,
      invoiceUrl: 'https://example.com/invoice/11'
    },
    {
      id: 12,
      invoiceMonth: 'December 2024',
      status: 'Unpaid',
      invoiceDate: '2024-12-15',
      paymentDate: null,
      invoiceUrl: 'https://example.com/invoice/12'
    }
  ]

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Filter data based on search
      let filteredData = dummyInvoices
      if (search) {
        filteredData = dummyInvoices.filter(invoice =>
          invoice.invoiceMonth.toLowerCase().includes(search.toLowerCase()) ||
          invoice.status.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Paginate data
      const startIndex = (page - 1) * 10
      const endIndex = startIndex + 10
      const paginatedData = filteredData.slice(startIndex, endIndex)

      setInvoicesData(paginatedData)
      setPagination({
        total: filteredData.length,
        page,
        limit: 10,
        totalPages: Math.ceil(filteredData.length / 10)
      })
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

  const invoicesColumns = useMemo(() => [
    {
      key: 'invoiceMonth',
      title: 'INVOICE MONTH',
      sortable: true,
      render: (value) => (
        <div className="invoice-info">
          <div className="invoice-details">
            <div className="invoice-month">{value}</div>
            <div className="invoice-id">{value}</div>
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
          {value}
        </span>
      )
    },
    {
      key: 'invoiceDate',
      title: 'INVOICE DATE',
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
      key: 'paymentDate',
      title: 'PAYMENT DATE',
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
        // Open invoice in new tab
        if (item.invoiceUrl) {
          window.open(item.invoiceUrl, '_blank')
        }
        break
      case 'send-invoice':
        handleSendInvoice(item)
        break
      default:
        break
    }
  }

  const handleSendInvoice = async (invoice) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Invoice sent successfully!')
    } catch (error) {
      console.error('Error sending invoice:', error)
      toast.error('Failed to send invoice')
    }
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
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
  )
}

export default ViewOrganizationInvoicesModal