import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import DataTable from '../../components/DataTable'
import AcademyBtn from '../../components/AcademyBtn'
import axiosInstance from '../../utils/AxiosInstance'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import plusIcon from '../../assets/images/academy-icons/svg/plus.svg'
// import archiveIcon from '../../assets/images/academy-icons/svg/archive.svg'
import './index.css'

const ViewInvoices = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  const [selectedInvoices, setSelectedInvoices] = useState([])
  
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
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 2,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 3,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Unpaid',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 4,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 5,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 6,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 7,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 8,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 9,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
    },
    {
      id: 10,
      organizationName: 'Organization Name',
      organizationId: '#01245',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27'
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
    setInvoicesLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Filter data based on search
      let filteredData = dummyInvoices
      if (search) {
        filteredData = dummyInvoices.filter(invoice =>
          invoice.organizationName.toLowerCase().includes(search.toLowerCase()) ||
          invoice.organizationId.toLowerCase().includes(search.toLowerCase()) ||
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

  // Fetch data when component mounts or when search/page changes
  useEffect(() => {
    fetchInvoices(currentPage, debouncedSearchQuery)
  }, [currentPage, debouncedSearchQuery])

  const invoicesColumns = useMemo(() => [
    {
      key: 'organizationName',
      title: 'ORGANIZATION NAME',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div className="invoice-organization-info">
          <div className="organization-name">{item.organizationName}</div>
          <div className="organization-id">{item.organizationId}</div>
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
  ], [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for invoice:`, item)
    
    switch (actionType) {
      case 'view':
        // Open invoice details
        console.log('View invoice:', item)
        break
      case 'send':
        handleSendInvoice(item)
        break
      default:
        break
    }
  }

  const handleSendInvoice = async (invoice) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Invoice sent successfully!')
    } catch (error) {
      console.error('Error sending invoice:', error)
      toast.error('Failed to send invoice')
    }
  }

  const handleGenerateInvoice = () => {
    // Navigate to generate invoice page or open modal
    console.log('Generate invoice clicked')
    toast.info('Generate Invoice feature coming soon!')
  }

  const handleViewArchive = () => {
    // Navigate to archive page
    console.log('View archive clicked')
    toast.info('View Archive feature coming soon!')
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleSelectionChange = (selectedItems) => {
    setSelectedInvoices(selectedItems)
  }

  const bulkActions = [
    {
      name: 'Export Selected',
      action: () => {
        if (selectedInvoices.length === 0) {
          toast.warning('Please select at least one invoice')
          return
        }
        console.log('Export selected:', selectedInvoices)
        toast.info('Export feature coming soon!')
      }
    },
    {
      name: 'Send Selected',
      action: () => {
        if (selectedInvoices.length === 0) {
          toast.warning('Please select at least one invoice')
          return
        }
        console.log('Send selected:', selectedInvoices)
        toast.success(`${selectedInvoices.length} invoice(s) sent successfully!`)
      }
    },
    {
      name: 'Delete Selected',
      action: () => {
        if (selectedInvoices.length === 0) {
          toast.warning('Please select at least one invoice')
          return
        }
        console.log('Delete selected:', selectedInvoices)
        toast.info('Delete feature coming soon!')
      }
    }
  ]

  return (
    <div className="view-invoices-container">
      <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
        <div className="d-flex justify-content-between flex-col-tab align-start-tab" style={{padding: '40px 40px 10px 30px'}}>
          <div className="d-flex flex-column gap-2">
            <h3 className="text-black mb-0 page-main-title">
              VIEW INVOICES
            </h3>
            <p className="page-subtitle">
              View invoices from all organizations
            </p>
          </div>
        </div>
        <img
          src={MenuIcon}
          alt='menu'
          className='menu-icon-cie self-start-tab cursor-pointer'
          onClick={() => dispatch(toggleCollapse())}
        />
      </div>

      <div className="invoices-content-wrapper">

        {/* Search and Actions Bar */}
        <div className="search-actions-bar">
                    {/* Back to User Management Button */}
        <div className="back-button-container">
          <button 
            className="back-button"
            onClick={() => history.push('/user-managment')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Return to User Management
          </button>
        </div>
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for Invoice"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 17L21 21" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="actions-container">
            <AcademyBtn
              title="GENERATE INVOICE"
              icon={plusIcon}
              onClick={handleGenerateInvoice}
            />
            
            <button 
              className="view-archive-btn"
              onClick={handleViewArchive}
            >
              VIEW ARCHIVE
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="dropdown-wrapper" style={{ position: 'relative' }}>
              <div 
                className="bulk-actions"
                onClick={() => setShowBulkDropdown(!showBulkDropdown)}
              >
                <span>BULK ACTIONS</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {showBulkDropdown && (
                <div className="dropdown-menu">
                  {bulkActions.map((action, index) => (
                    <div 
                      key={index}
                      className="dropdown-item"
                      onClick={() => {
                        action.action()
                        setShowBulkDropdown(false)
                      }}
                    >
                      {action.name}
                    </div>
                  ))}
                </div>
              )}
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
            showCheckbox={true}
            activeTab="Invoices"
            loading={invoicesLoading}
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
    </div>
  )
}

export default ViewInvoices