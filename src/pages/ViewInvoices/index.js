import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import DataTable from '../../components/DataTable'
import AcademyBtn from '../../components/AcademyBtn'
import InvoiceFilters from '../../components/InvoiceFilters'
import axiosInstance from '../../utils/AxiosInstance'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import plusIcon from '../../assets/images/academy-icons/svg/plus.svg'
import ViewInvoiceModal from '../../components/UserManagment/ViewInvoiceModal'
import GenerateInvoiceModal from '../../components/UserManagment/GenerateInvoiceModal'
import GenerateMultipleInvoicesPopup from '../../components/UserManagment/GenerateMultipleInvoicesPopup'
import DeleteInvoicePopup from '../../components/UserManagment/DeleteInvoicePopup'
import './index.css'

const ViewInvoices = ({ isArchiveMode = false }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation()
  
  // Local state to track archive mode (independent of route)
  const [archiveMode, setArchiveMode] = useState(isArchiveMode)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState({
    organizationName: '',
    dateFrom: null,
    dateTo: null
  })
  const [columnFilters, setColumnFilters] = useState({})
  
  const [invoicesData, setInvoicesData] = useState([])
  const [invoicesLoading, setInvoicesLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showGenerateMultiplePopup, setShowGenerateMultiplePopup] = useState(false)
  const [showDeleteInvoicePopup, setShowDeleteInvoicePopup] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [invoiceMode, setInvoiceMode] = useState('view')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)

  const searchContainerRef = useRef(null)

  const dummyInvoices = [
    {
      id: 1,
      organizationName: 'Tech Solutions Inc',
      organizationId: '#01245',
      organizationAddress: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27',
      invoiceNumber: '01245',
      issueDate: '2025-09-27',
      dueDate: '2025-10-27',
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
    },
    {
      id: 2,
      organizationName: 'Educational Services LLC',
      organizationId: '#01246',
      organizationAddress: '456 Learning Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27',
      invoiceNumber: '01246',
      issueDate: '2025-09-27',
      dueDate: '2025-10-27',
      items: [
        {
          description: 'Platform Subscription',
          quantity: '500',
          price: '20',
          total: 10000
        },
        {
          description: 'Training Modules',
          quantity: '100',
          price: '50',
          total: 5000
        }
      ],
      subtotal: 15000,
      tax: 1050,
      total: 16050
    },
    {
      id: 3,
      organizationName: 'Future Academy',
      organizationId: '#01247',
      organizationAddress: '789 Innovation Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      status: 'Unpaid',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27',
      invoiceNumber: '01247',
      issueDate: '2025-09-27',
      dueDate: '2025-10-27',
      items: [
        {
          description: 'Student Licenses',
          quantity: '2000',
          price: '12',
          total: 24000
        }
      ],
      subtotal: 24000,
      tax: 1680,
      total: 25680
    },
    {
      id: 4,
      organizationName: 'Learning Hub Corp',
      organizationId: '#01248',
      organizationAddress: '321 Education Dr',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
      status: 'Complete',
      invoiceDate: '2025-09-27',
      paymentDate: '2025-10-27',
      invoiceNumber: '01248',
      issueDate: '2025-09-27',
      dueDate: '2025-10-27',
      items: [
        {
          description: 'Annual Subscription',
          quantity: '1',
          price: '50000',
          total: 50000
        }
      ],
      subtotal: 50000,
      tax: 3500,
      total: 53500
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchInvoices = async (page = 1, search = '') => {
    setInvoicesLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      // In archive mode, filter for archived/completed invoices
      let filteredData = archiveMode 
        ? dummyInvoices.filter(invoice => invoice.status === 'Complete')
        : dummyInvoices

      if (search) {
        filteredData = filteredData.filter(invoice =>
          invoice.organizationName.toLowerCase().includes(search.toLowerCase()) ||
          invoice.organizationId.toLowerCase().includes(search.toLowerCase()) ||
          invoice.status.toLowerCase().includes(search.toLowerCase())
        )
      }

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

  useEffect(() => {
    fetchInvoices(currentPage, debouncedSearchQuery)
  }, [currentPage, debouncedSearchQuery, archiveMode])

  const invoicesColumns = useMemo(() => [
    {
      key: 'organizationName',
      title: 'ORGANIZATION NAME',
      sortable: true,
      filterable: false,
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
  ], [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for invoice:`, item)
    
    switch (actionType) {
      case 'view':
        setSelectedInvoice(item)
        setInvoiceMode('view')
        setShowEditInvoiceModal(true)
        break
      case 'send':
        handleSendInvoice(item)
        break
      case 'generate-invoice':
        console.log('Generate invoice for:', item)
        toast.info('Generate Invoice feature coming soon!')
        break
      case 'archive-invoice':
        console.log('Archive invoice:', item)
        toast.success(`Invoice ${item.organizationId} archived successfully!`)
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Invoice sent successfully!')
    } catch (error) {
      console.error('Error sending invoice:', error)
      toast.error('Failed to send invoice')
    }
  }

  const handleGenerateInvoice = () => {
    setShowGenerateModal(true)
  }

  const handleGenerateInvoiceSubmit = (organization) => {
    const newInvoice = {
      id: Date.now(),
      organizationName: organization.name,
      organizationId: `#${Math.floor(10000 + Math.random() * 90000)}`,
      organizationAddress: '',
      city: '',
      state: '',
      zip: '',
      status: 'Draft',
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentDate: '',
      invoiceNumber: `INV${Math.floor(10000 + Math.random() * 90000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    }

    setSelectedInvoice(newInvoice)
    setInvoiceMode('edit')
    setShowEditInvoiceModal(true)
  }

  const handleGenerateMultiple = () => {
    if (selectedInvoices.length === 0) {
      toast.warning('Please select at least one organization')
      return
    }
    setShowGenerateMultiplePopup(true)
  }

  const handleConfirmGenerateMultiple = async () => {
    setGenerateLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`${selectedInvoices.length} invoice(s) generated successfully!`)
      setShowGenerateMultiplePopup(false)
      setSelectedInvoices([])
      fetchInvoices(currentPage, debouncedSearchQuery)
    } catch (error) {
      console.error('Error generating invoices:', error)
      toast.error('Failed to generate invoices')
    } finally {
      setGenerateLoading(false)
    }
  }

  const handleDeleteInvoice = async () => {
    setDeleteLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (selectedInvoice) {
        toast.success(`Invoice ${selectedInvoice.organizationId} deleted successfully!`)
      } else if (selectedInvoices.length > 0) {
        toast.success(`${selectedInvoices.length} invoice(s) deleted successfully!`)
        setSelectedInvoices([])
      }
      
      setShowDeleteInvoicePopup(false)
      setSelectedInvoice(null)
      fetchInvoices(currentPage, debouncedSearchQuery)
    } catch (error) {
      console.error('Error deleting invoice:', error)
      toast.error('Failed to delete invoice(s)')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleViewArchive = () => {
    // Toggle archive mode
    setArchiveMode(!archiveMode)
    setCurrentPage(1) // Reset to first page
  }

  const handleBackButton = () => {
    if (archiveMode) {
      // If in archive mode, return to view invoices
      setArchiveMode(false)
    } else {
      // If in normal mode, return to user management
      history.push('/user-managment')
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleSelectionChange = (selectedItems) => {
    setSelectedInvoices(selectedItems)
  }

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters)
    setShowFilters(false)
    setCurrentPage(1)
    console.log('Applied filters:', filters)
  }

  const handleColumnFilterChange = (filters) => {
    setColumnFilters(filters)
    console.log('Column filters changed:', filters)
  }

  const bulkActions = [
    {
      name: 'Generate Invoices',
      action: handleGenerateMultiple
    },
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
        setShowDeleteInvoicePopup(true)
      }
    }
  ]

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

  return (
    <div className="view-invoices-container">
      <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
        <div className="d-flex justify-content-between flex-col-tab align-start-tab" style={{padding: '40px 40px 10px 30px'}}>
          <div className="d-flex flex-column gap-2">
            <h3 className="text-black mb-0 page-main-title">
              {archiveMode ? 'INVOICE ARCHIVE' : 'VIEW INVOICES'}
            </h3>
            <p className="page-subtitle">
              {archiveMode ? 'View archived invoices from all organizations' : 'View invoices from all organizations'}
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
        <div className="search-actions-bar">
          <div className="back-button-container">
            <button 
              className="back-button"
              onClick={handleBackButton}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {archiveMode ? 'Return to View Invoices' : 'Return to User Management'}
            </button>
          </div>

          <div 
            className="search-container" 
            ref={searchContainerRef}
            style={{ position: 'relative' }}
          >
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for Invoice"
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
              <button 
                className="filter-toggle-btn search-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFilters(!showFilters)
                }}
                title="Open Filters"
                type="button"
              >
                <svg 
                  className="filter-icon" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <path 
                    d="M21.25 11.9999H8.895M4.534 11.9999H2.75M4.534 11.9999C4.534 11.4217 4.76368 10.8672 5.17251 10.4584C5.58134 10.0496 6.13583 9.81989 6.714 9.81989C7.29217 9.81989 7.84666 10.0496 8.25549 10.4584C8.66432 10.8672 8.894 11.4217 8.894 11.9999C8.894 12.5781 8.66432 13.1326 8.25549 13.5414C7.84666 13.9502 7.29217 14.1799 6.714 14.1799C6.13583 14.1799 5.58134 13.9502 5.17251 13.5414C4.76368 13.1326 4.534 12.5781 4.534 11.9999ZM21.25 18.6069H15.502M15.502 18.6069C15.502 19.1852 15.2718 19.7403 14.8628 20.1492C14.4539 20.5582 13.8993 20.7879 13.321 20.7879C12.7428 20.7879 12.1883 20.5572 11.7795 20.1484C11.3707 19.7396 11.141 19.1851 11.141 18.6069M15.502 18.6069C15.502 18.0286 15.2718 17.4745 14.8628 17.0655C14.4539 16.6566 13.8993 16.4269 13.321 16.4269C12.7428 16.4269 12.1883 16.6566 11.7795 17.0654C11.3707 17.4742 11.141 18.0287 11.141 18.6069M11.141 18.6069H2.75M21.25 5.39289H18.145M13.784 5.39289H2.75M13.784 5.39289C13.784 4.81472 14.0137 4.26023 14.4225 3.8514C14.8313 3.44257 15.3858 3.21289 15.964 3.21289C16.2503 3.21289 16.5338 3.26928 16.7983 3.37883C17.0627 3.48839 17.3031 3.64897 17.5055 3.8514C17.7079 4.05383 17.8685 4.29415 17.9781 4.55864C18.0876 4.82313 18.144 5.10661 18.144 5.39289C18.144 5.67917 18.0876 5.96265 17.9781 6.22714C17.8685 6.49163 17.7079 6.73195 17.5055 6.93438C17.3031 7.13681 17.0627 7.29739 16.7983 7.40695C16.5338 7.5165 16.2503 7.57289 15.964 7.57289C15.3858 7.57289 14.8313 7.34321 14.4225 6.93438C14.0137 6.52555 13.784 5.97106 13.784 5.39289Z" 
                    stroke="black" 
                    strokeWidth="2" 
                    strokeMiterlimit="10" 
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <InvoiceFilters
              show={showFilters}
              onHide={() => setShowFilters(false)}
              onApplyFilters={handleApplyFilters}
              anchorRef={searchContainerRef}
            />
          </div>

          {!archiveMode && (
            <div className="actions-container">
              <AcademyBtn
                title="GENERATE INVOICE"
                icon={plusIcon}
                onClick={handleGenerateInvoice}
              />

              <AcademyBtn
                title="VIEW ARCHIVE"
                icon={plusIcon}
                onClick={handleViewArchive}
              />

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
          )}
        </div>

        <div>
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
            onFilterChange={handleColumnFilterChange}
          />

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
            fetchInvoices(currentPage, debouncedSearchQuery)
          }}
          invoiceData={selectedInvoice}
          mode={invoiceMode}
        />

        <GenerateInvoiceModal
          show={showGenerateModal}
          onHide={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateInvoiceSubmit}
        />

        <GenerateMultipleInvoicesPopup
          show={showGenerateMultiplePopup}
          onHide={() => setShowGenerateMultiplePopup(false)}
          onConfirm={handleConfirmGenerateMultiple}
          loading={generateLoading}
        />

        <DeleteInvoicePopup
          show={showDeleteInvoicePopup}
          onHide={() => {
            setShowDeleteInvoicePopup(false)
            setSelectedInvoice(null)
          }}
          onConfirm={handleDeleteInvoice}
          loading={deleteLoading}
          count={selectedInvoice ? 1 : selectedInvoices.length}
        />
      </div>
    </div>
  )
}

export default ViewInvoices