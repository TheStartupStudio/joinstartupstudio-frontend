import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import DataTable from '../../components/DataTable'
import AcademyBtn from '../../components/AcademyBtn'
import InvoiceFilters from '../../components/InvoiceFilters'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import plusIcon from '../../assets/images/academy-icons/svg/plus.svg'
import ViewInvoiceModal from '../../components/UserManagment/ViewInvoiceModal'
import GenerateInvoiceModal from '../../components/UserManagment/GenerateInvoiceModal'
import GenerateMultipleInvoicesPopup from '../../components/UserManagment/GenerateMultipleInvoicesPopup'
import DeleteInvoicePopup from '../../components/UserManagment/DeleteInvoicePopup'
import { invoiceApi } from '../../utils/invoiceApi'
import ManagePaymentModal from '../../components/UserManagment/ManagePaymentModal'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './index.css'
import NotificationBell from '../../components/NotificationBell'
import axiosInstance from '../../utils/AxiosInstance'
import PreviewInvoiceEmailModal from '../../components/UserManagment/PreviewInvoiceEmailModal'


const ViewInvoices = ({ isArchiveMode = false }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation()
  
  const { user } = useSelector((state) => state.user?.user || {})
  const userRole = user?.role_id || localStorage.getItem('role')

  const isInstructor = user?.role_id === 2
  const isSuperAdmin = user?.role_id === 3 || userRole === 'super-admin'
  
  const [archiveMode, setArchiveMode] = useState(isArchiveMode)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  
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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showPreviewEmailModal, setShowPreviewEmailModal] = useState(false)
  const [invoiceToSend, setInvoiceToSend] = useState(null)

  const searchContainerRef = useRef(null)
  const bulkDropdownRef = useRef(null)

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

  const fetchInvoices = async (page = 1, search = '') => {
    setInvoicesLoading(true)
    try {
      console.log('Fetching invoices with params:', { page, search, archiveMode, userRole: user?.role_id })

      let response

      if (archiveMode) {
        // ✅ Fetch archived invoices from /invoices/archived
        response = await invoiceApi.getArchivedInvoices({
          page,
          limit: 10,
          search
        })
      } else {
        // ✅ Fetch regular invoices
        if (isInstructor) {
          response = await invoiceApi.getClientInvoices({ 
            page, 
            limit: 10, 
            search 
          })
        } else if (isSuperAdmin) {
          response = await invoiceApi.getAllInvoices({ 
            page, 
            limit: 10, 
            search 
          })
        } else {
          // For other roles (if any)
          response = await invoiceApi.getClientInvoices({ 
            page, 
            limit: 10, 
            search 
          })
        }
      }

      console.log('Invoices response:', response)

      const invoicesData = response.data || []
      
      setInvoicesData(invoicesData)
      setPagination(response.pagination || {
        total: invoicesData.length,
        page,
        limit: 10,
        totalPages: Math.ceil(invoicesData.length / 10)
      })
    } catch (error) {
      console.error('Error fetching invoices:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load invoices data'
      toast.error(errorMessage)
      setInvoicesData([])
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
      })
    } finally {
      setInvoicesLoading(false)
    }
  }

  // useEffect(() => {
  //   fetchInvoices(currentPage, debouncedSearchQuery)
  // }, [currentPage, debouncedSearchQuery, archiveMode])

  useEffect(() => {
    if (user) {
      console.log('User changed, fetching invoices:', user)
      fetchInvoices(currentPage, debouncedSearchQuery)
    }
  }, [currentPage, debouncedSearchQuery, archiveMode, user])

  const invoicesColumns = useMemo(() => {
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

  const handleExportInvoicePDF = async (invoice) => {
    if (!invoice?.id) {
      toast.error('Invalid invoice')
      return
    }

    try {
      setInvoicesLoading(true)
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
        setInvoicesLoading(false)
      }, 1500)
    }
  }

  const handleDownloadInvoice = async (invoice) => {
    if (!invoice?.id) {
      toast.error('Invalid invoice')
      return
    }

    try {
      setInvoicesLoading(true)
      toast.info('Downloading invoice...')
      
      try {
        const response = await invoiceApi.downloadInvoice(invoice.id)
        
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Invoice_${invoice.invoiceNumber}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
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
      setInvoicesLoading(false)
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
      setInvoicesLoading(true)
      
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
      setInvoicesLoading(false)
    }
  }

  const handleConfirmBulkSendEmail = async (emailData) => {
    if (selectedInvoices.length === 0) {
      toast.error('No invoices selected')
      return
    }

    try {
      setInvoicesLoading(true)
      
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
      setInvoicesLoading(false)
    }
  }

  const handleArchiveInvoice = async (invoice) => {
    if (!invoice?.id) {
      toast.error('Invalid invoice')
      return
    }

    try {
      setInvoicesLoading(true)
      
      const response = await invoiceApi.archiveInvoice(invoice.id, null)
      
      toast.success(response.message || `Invoice ${invoice.invoiceNumber} archived successfully!`)
      
      await fetchInvoices(currentPage, debouncedSearchQuery)
    } catch (error) {
      console.error('❌ Error archiving invoice:', error)
      const errorMessage = error.response?.data?.message || 'Failed to archive invoice'
      toast.error(errorMessage)
    } finally {
      setInvoicesLoading(false)
    }
  }

  const handleUnarchiveInvoice = async (invoice) => {
    if (!invoice?.id) {
      toast.error('Invalid invoice')
      return
    }

    try {
      setInvoicesLoading(true)
      
      const response = await invoiceApi.unarchiveInvoice(invoice.id)
      
      toast.success(response.message || `Invoice ${invoice.invoiceNumber} unarchived successfully!`)
      
      await fetchInvoices(currentPage, debouncedSearchQuery)
    } catch (error) {
      console.error('❌ Error unarchiving invoice:', error)
      const errorMessage = error.response?.data?.message || 'Failed to unarchive invoice'
      toast.error(errorMessage)
    } finally {
      setInvoicesLoading(false)
    }
  }

  const handleBulkArchiveInvoices = async () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice!')
      return
    }

    try {
      setInvoicesLoading(true)
      
      const invoiceIds = selectedInvoices.map(inv => inv.id)
      const response = await invoiceApi.bulkArchiveInvoices(invoiceIds)
      
      toast.success(response.message || `${response.archivedCount} invoice(s) archived successfully!`)
      setSelectedInvoices([])
      await fetchInvoices(currentPage, debouncedSearchQuery)
    } catch (error) {
      console.error('❌ Error archiving invoices:', error)
      const errorMessage = error.response?.data?.message || 'Failed to archive some invoices'
      toast.error(errorMessage)
    } finally {
      setInvoicesLoading(false)
    }
  }

  const handleDeleteInvoice = async () => {
    setDeleteLoading(true)
    try {
      if (selectedInvoice?.id) {
        await invoiceApi.deleteInvoice(selectedInvoice.id)
        toast.success(`Invoice ${selectedInvoice.invoiceNumber} deleted successfully!`)
      } else if (selectedInvoices.length > 0) {
        const deletePromises = selectedInvoices
          .filter(invoice => invoice.id)
          .map(invoice => invoiceApi.deleteInvoice(invoice.id))
        
        await Promise.all(deletePromises)
        toast.success(`${selectedInvoices.length} invoice(s) deleted successfully!`)
        setSelectedInvoices([])
      }
      
      setShowDeleteInvoicePopup(false)
      setSelectedInvoice(null)
      await fetchInvoices(currentPage, debouncedSearchQuery)
    } catch (error) {
      console.error('❌ Error deleting invoice:', error)
      toast.error(error.response?.data?.message || 'Failed to delete invoice(s)')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleBulkSendInvoices = async () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice!')
      return
    }

    // For bulk send, we'll send the first invoice's preview
    // You can modify this to show a different modal for bulk sends if needed
    setInvoiceToSend(selectedInvoices[0])
    setShowPreviewEmailModal(true)
  }

  // const handleConfirmBulkSendEmail = async (emailData) => {
  //   if (selectedInvoices.length === 0) {
  //     toast.error('No invoices selected')
  //     return
  //   }

  //   try {
  //     setInvoicesLoading(true)
      
  //     const sendPromises = selectedInvoices.map(invoice => 
  //       invoiceApi.sendInvoiceEmail(invoice.id, {
  //         subject: emailData.subject.replace(selectedInvoices[0].invoiceNumber, invoice.invoiceNumber),
  //         message: emailData.message.replace(selectedInvoices[0].organizationName, invoice.organizationName)
  //       })
  //     )
      
  //     await Promise.all(sendPromises)
  //     toast.success(`${selectedInvoices.length} invoice(s) sent successfully!`)
  //     setSelectedInvoices([])
  //     setShowPreviewEmailModal(false)
  //     setInvoiceToSend(null)
  //   } catch (error) {
  //     console.error('❌ Error sending invoices:', error)
  //     toast.error('Failed to send some invoices')
  //   } finally {
  //     setInvoicesLoading(false)
  //   }
  // }

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
      case 'generate-invoice':
        setShowGenerateModal(true)
        break
      case 'archive-invoice':
        if (archiveMode) {
          handleUnarchiveInvoice(item)
        } else {
          handleArchiveInvoice(item)
        }
        break
      case 'delete-invoice':
        setSelectedInvoice(item)
        setShowDeleteInvoicePopup(true)
        break
      default:
        break
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleGenerateInvoice = () => {
    setShowGenerateModal(true)
  }

  const handleGenerateInvoiceSubmit = async (generatedInvoice) => {
    setShowGenerateModal(false)
    await fetchInvoices(currentPage, debouncedSearchQuery)
    
    if (generatedInvoice && generatedInvoice.id) {
      setSelectedInvoice(generatedInvoice)
      setInvoiceMode('view')
      setShowEditInvoiceModal(true)
    }
  }

  const handleGenerateMultiple = () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice!')
      return
    }
    
    // Extract unique organization IDs from selected invoices
    const uniqueOrgIds = [...new Set(selectedInvoices.map(inv => inv.organizationId).filter(Boolean))]
    
    if (uniqueOrgIds.length === 0) {
      toast.error('Selected invoices do not have valid organization information')
      return
    }
    
    console.log('Unique organization IDs to generate invoices for:', uniqueOrgIds)
    setShowGenerateMultiplePopup(true)
  }

  const handleConfirmGenerateMultiple = async () => {
    try {
      setGenerateLoading(true)
      
      // Extract unique organization IDs from selected invoices
      const uniqueOrgIds = [...new Set(selectedInvoices.map(inv => inv.organizationId).filter(Boolean))]
      
      if (uniqueOrgIds.length === 0) {
        toast.error('No valid organizations found in selected invoices')
        setShowGenerateMultiplePopup(false)
        return
      }

      console.log('Generating invoices for organizations:', uniqueOrgIds)

      // Generate invoices for each unique organization
      const generatePromises = uniqueOrgIds.map(orgId =>
        axiosInstance.post(`/invoices/generate/${orgId}`)
      )

      const results = await Promise.allSettled(generatePromises)
      
      const succeeded = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      if (succeeded > 0) {
        toast.success(`${succeeded} invoice(s) generated successfully!`)
      }
      
      if (failed > 0) {
        const failedResults = results.filter(r => r.status === 'rejected')
        console.error('Failed generations:', failedResults)
        
        // Log specific errors
        failedResults.forEach((result, index) => {
          console.error(`Failed to generate invoice for org ${uniqueOrgIds[index]}:`, result.reason?.response?.data)
        })
        
        toast.warning(`${failed} invoice(s) failed to generate. Check console for details.`)
      }

      // Refresh the invoices list
      await fetchInvoices(currentPage, debouncedSearchQuery)
      setSelectedInvoices([])
      setShowGenerateMultiplePopup(false)
      setShowBulkDropdown(false)
    } catch (error) {
      console.error('Error generating invoices:', error)
      toast.error(error.response?.data?.message || 'Failed to generate invoices')
    } finally {
      setGenerateLoading(false)
    }
  }

  const handleViewArchive = () => {
    setArchiveMode(!archiveMode)
    setCurrentPage(1)
  }

  const handleBackButton = () => {
    if (archiveMode) {
      setArchiveMode(false)
    } else {
      if (isInstructor) {
        history.push('/admin-dashboard')
      } else {
        history.push('/user-managment')
      }
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

  const handleBulkExportInvoices = async () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice to export!')
      return
    }

    try {
      setInvoicesLoading(true)
      
      // Export each selected invoice as PDF
      const exportPromises = selectedInvoices.map(invoice =>
        handleExportInvoicePDF(invoice)
      )

      await Promise.allSettled(exportPromises)
      
      toast.success(`${selectedInvoices.length} invoice(s) exported successfully!`)
      setSelectedInvoices([])
      setShowBulkDropdown(false)
    } catch (error) {
      console.error('Error exporting invoices:', error)
      toast.error('Failed to export some invoices')
    } finally {
      setInvoicesLoading(false)
    }
  }

  const bulkActions = useMemo(() => {
    if (archiveMode) {
      return [
        {
          name: 'Unarchive Selected',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.1256 17.4997H3.87307C2.33504 17.4997 1.37259 15.8361 2.13926 14.5027L8.26554 3.84833C9.03455 2.51092 10.9641 2.51092 11.7332 3.84833L17.8594 14.5027C18.6261 15.8361 17.6637 17.4997 16.1256 17.4997Z" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 7.5V10.8333" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 14.1753L10.0083 14.1661" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          action: async () => {
            console.log('Unarchive Selected clicked', selectedInvoices)
            if (selectedInvoices.length === 0) {
              toast.error('Please select at least one invoice!')
              return
            }
            
            try {
              setInvoicesLoading(true)
              const promises = selectedInvoices.map(inv => 
                invoiceApi.unarchiveInvoice(inv.id)
              )
              await Promise.all(promises)
              toast.success(`${selectedInvoices.length} invoice(s) unarchived successfully!`)
              setSelectedInvoices([])
              await fetchInvoices(currentPage, debouncedSearchQuery)
            } catch (error) {
              toast.error('Failed to unarchive some invoices')
            } finally {
              setInvoicesLoading(false)
            }
          }
        }
      ]
    }

    // For instructors (role_id === 2), show only Archive and Export
    if (isInstructor) {
      return [
        {
          name: 'Archive Invoices',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M2.5 16.6667C2.04167 16.6667 1.64944 16.5036 1.32333 16.1775C0.997222 15.8514 0.833889 15.4589 0.833333 15V5.60417C0.583333 5.45139 0.381945 5.25361 0.229167 5.01083C0.076389 4.76805 0 4.48667 0 4.16667V1.66667C0 1.20833 0.163333 0.816111 0.49 0.49C0.816667 0.163889 1.20889 0.000555556 1.66667 0H15C15.4583 0 15.8508 0.163333 16.1775 0.49C16.5042 0.816667 16.6672 1.20889 16.6667 1.66667V4.16667C16.6667 4.48611 16.5903 4.7675 16.4375 5.01083C16.2847 5.25417 16.0833 5.45167 15.8333 5.60333V15C15.8333 15.4583 15.6703 15.8508 15.3442 16.1775C15.0181 16.5042 14.6256 16.6672 14.1667 16.6667H2.5ZM2.5 5.83333V15H14.1667V5.83333H2.5ZM1.66667 4.16667H15V1.66667H1.66667V4.16667ZM6.66667 10H10C10.2361 10 10.4342 9.92 10.5942 9.76C10.7542 9.6 10.8339 9.40222 10.8333 9.16667C10.8328 8.93111 10.7528 8.73333 10.5933 8.57333C10.4339 8.41333 10.2361 8.33333 10 8.33333H6.66667C6.43056 8.33333 6.23278 8.41333 6.07333 8.57333C5.91389 8.73333 5.83389 8.93111 5.83333 9.16667C5.83278 9.40222 5.91278 9.60028 6.07333 9.76083C6.23389 9.92139 6.43167 10.0011 6.66667 10Z" fill="black"/>
            </svg>
          ),
          action: async () => {
            console.log('Archive Invoices clicked', selectedInvoices)
            if (selectedInvoices.length === 0) {
              toast.error('Please select at least one invoice!')
              return
            }

            try {
              setInvoicesLoading(true)
              const invoiceIds = selectedInvoices.map(inv => inv.id)
              const response = await invoiceApi.bulkArchiveInvoices(invoiceIds)
              toast.success(response.message || `${response.archivedCount} invoice(s) archived successfully!`)
              setSelectedInvoices([])
              await fetchInvoices(currentPage, debouncedSearchQuery)
              setShowBulkDropdown(false)
            } catch (error) {
              console.error('❌ Error archiving invoices:', error)
              toast.error(error.response?.data?.message || 'Failed to archive some invoices')
            } finally {
              setInvoicesLoading(false)
            }
          }
        },
        {
          name: 'Export Invoices',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 16.6667L15 16.6667" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.0007 3.33325V13.3333M10.0007 13.3333L12.9173 10.4166M10.0007 13.3333L7.08398 10.4166" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          ),
          action: handleBulkExportInvoices
        }
      ]
    }

    return [
      {
        name: 'Generate Invoices',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M18.3327 5.00016V15.0002C18.3327 15.4585 18.1696 15.851 17.8435 16.1777C17.5174 16.5043 17.1249 16.6674 16.666 16.6668H3.33268C2.87435 16.6668 2.48213 16.5038 2.15602 16.1777C1.8299 15.8516 1.66657 15.4591 1.66602 15.0002V5.00016C1.66602 4.54183 1.82935 4.14961 2.15602 3.8235C2.48268 3.49738 2.8749 3.33405 3.33268 3.3335H16.666C17.1243 3.3335 17.5168 3.49683 17.8435 3.8235C18.1702 4.15016 18.3332 4.54238 18.3327 5.00016ZM3.33268 6.66683H16.666V5.00016H3.33268V6.66683ZM3.33268 10.0002V15.0002H16.666V10.0002H3.33268Z" fill="black"/>
          </svg>
        ),
        action: () => {
          console.log('Generate Invoices clicked', selectedInvoices)
          handleGenerateMultiple()
        }
      },
      {
        name: 'Archive Invoices',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M2.5 16.6667C2.04167 16.6667 1.64944 16.5036 1.32333 16.1775C0.997222 15.8514 0.833889 15.4589 0.833333 15V5.60417C0.583333 5.45139 0.381945 5.25361 0.229167 5.01083C0.076389 4.76805 0 4.48667 0 4.16667V1.66667C0 1.20833 0.163333 0.816111 0.49 0.49C0.816667 0.163889 1.20889 0.000555556 1.66667 0H15C15.4583 0 15.8508 0.163333 16.1775 0.49C16.5042 0.816667 16.6672 1.20889 16.6667 1.66667V4.16667C16.6667 4.48611 16.5903 4.7675 16.4375 5.01083C16.2847 5.25417 16.0833 5.45167 15.8333 5.60333V15C15.8333 15.4583 15.6703 15.8508 15.3442 16.1775C15.0181 16.5042 14.6256 16.6672 14.1667 16.6667H2.5ZM2.5 5.83333V15H14.1667V5.83333H2.5ZM1.66667 4.16667H15V1.66667H1.66667V4.16667ZM6.66667 10H10C10.2361 10 10.4342 9.92 10.5942 9.76C10.7542 9.6 10.8339 9.40222 10.8333 9.16667C10.8328 8.93111 10.7528 8.73333 10.5933 8.57333C10.4339 8.41333 10.2361 8.33333 10 8.33333H6.66667C6.43056 8.33333 6.23278 8.41333 6.07333 8.57333C5.91389 8.73333 5.83389 8.93111 5.83333 9.16667C5.83278 9.40222 5.91278 9.60028 6.07333 9.76083C6.23389 9.92139 6.43167 10.0011 6.66667 10Z" fill="black"/>
          </svg>
        ),
        action: async () => {
          console.log('Archive Invoices clicked', selectedInvoices)
          if (selectedInvoices.length === 0) {
            toast.error('Please select at least one invoice!')
            return
          }

          try {
            setInvoicesLoading(true)
            const invoiceIds = selectedInvoices.map(inv => inv.id)
            const response = await invoiceApi.bulkArchiveInvoices(invoiceIds)
            toast.success(response.message || `${response.archivedCount} invoice(s) archived successfully!`)
            setSelectedInvoices([])
            await fetchInvoices(currentPage, debouncedSearchQuery)
            setShowBulkDropdown(false)
          } catch (error) {
            console.error('❌ Error archiving invoices:', error)
            toast.error(error.response?.data?.message || 'Failed to archive some invoices')
          } finally {
            setInvoicesLoading(false)
          }
        }
      },
      // {
      //   name: 'Export Invoices',
      //   icon: (
      //     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      //       <path d="M17.5 12.5V13.3333C17.5 16.6667 16.25 17.9167 12.9167 17.9167H7.08333C3.75 17.9167 2.5 16.6667 2.5 13.3333V12.5C2.5 9.58333 3.41667 8.41667 5.83333 8.125C6.075 8.1 6.33333 8.08333 6.60417 8.08333H13.3958C13.6667 8.08333 13.925 8.1 14.1667 8.125C16.5833 8.41667 17.5 9.58333 17.5 12.5Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      //       <path d="M14.1667 8.125C13.925 8.1 13.6667 8.08333 13.3958 8.08333H6.60417C6.33333 8.08333 6.075 8.1 5.83333 8.125C5.91667 7.875 6.04167 7.63333 6.20833 7.40833L8.325 4.65833C9.35 3.35833 10.65 3.35833 11.675 4.65833L12.8083 6.09167C13.0833 6.44167 13.2917 6.81667 13.4333 7.21667C13.6667 7.48333 13.9333 7.825 14.1667 8.125Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      //       <path d="M5 13.75H8.33333" stroke="black" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      //       <path d="M9.58301 13.75H15.833" stroke="black" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      //     </svg>
      //   ),
      //   action: handleBulkExportInvoices
      // },
      {
        name: 'Delete Invoices',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.1256 17.4997H3.87307C2.33504 17.4997 1.37259 15.8361 2.13926 14.5027L8.26554 3.84833C9.03455 2.51092 10.9641 2.51092 11.7332 3.84833L17.8594 14.5027C18.6261 15.8361 17.6637 17.4997 16.1256 17.4997Z" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M10 7.5V10.8333" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M10 14.1753L10.0083 14.1661" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        ),
        action: () => {
          console.log('Delete Invoices clicked', selectedInvoices)
          if (selectedInvoices.length === 0) {
            toast.error('Please select at least one invoice!')
            return
          }
          setShowDeleteInvoicePopup(true)
        }
      }
    ]
  }, [selectedInvoices, archiveMode, isInstructor])

  const handleClickOutside = (event) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
      setShowFilters(false)
    }
    if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(event.target)) {
      setShowBulkDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) {
    return (
      <div className="view-invoices-container">
        <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
          <div className="d-flex justify-content-between flex-col-tab align-start-tab" style={{padding: '40px 40px 10px 30px'}}>
            <div className="d-flex flex-column gap-2">
              <h3 className="text-black mb-0 page-main-title">VIEW INVOICES</h3>
              <p className="page-subtitle">Loading user information...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handlePaymentModal = () => {
    setShowPaymentModal(true)
  }

  const handleSavePayment = async (paymentData) => {
    try {
      console.log('Saving payment data:', paymentData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Payment information updated successfully!')
    } catch (error) {
      console.error('Error saving payment:', error)
      throw error
    }
  }

  return (
    <div className="view-invoices-container">
      <div className="col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
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
        <div className="d-flex align-items-center justify-content-center">
                    {isInstructor ? (<NotificationBell />) : null}
                    <img
                      src={MenuIcon}
                      alt='menu'
                      className='menu-icon-cie self-start-tab cursor-pointer'
                      onClick={() => dispatch(toggleCollapse())}
                    />
                  </div>
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
              {archiveMode 
                ? 'Return to View Invoices' 
                : isInstructor 
                  ? 'Return to Dashboard' 
                  : 'Return to User Management'}
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

            {showFilters && (
              <InvoiceFilters
                show={showFilters}
                onHide={() => setShowFilters(false)}
                anchorRef={searchContainerRef}
              />
            )}
          </div>

          {!archiveMode && (
            <div className="actions-container">
              {isInstructor ? (
                <>
                  <AcademyBtn
                    title="UPDATE PAYMENT METHODS"
                    icon={plusIcon}
                    onClick={handlePaymentModal}
                  />

                  <AcademyBtn
                    title="VIEW ARCHIVE"
                    icon={plusIcon}
                    onClick={handleViewArchive}
                  />

                  <div ref={bulkDropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
                    <button 
                      className="bulk-actions"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowBulkDropdown(!showBulkDropdown)
                      }}
                      disabled={false}
                      type="button"
                    >
                      <span>BULK ACTIONS</span>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {showBulkDropdown > 0 && (
                      <div 
                        className="dropdown-menu show" 
                        style={{ 
                          position: 'absolute',
                          top: 'calc(100% + 5px)',
                          right: 0,
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 9999,
                          width: 'fit-content',
                          padding: '0'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {bulkActions.map((action, index) => (
                          <div 
                            key={index}
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation()
                              action.action()
                              setShowBulkDropdown(false)
                            }}
                            style={{
                              padding: '10px 10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            {action.icon && <span>{action.icon}</span>}
                            <span style={{ fontSize: '14px', color: '#333' }}>{action.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
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

                  <div ref={bulkDropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
                    <button 
                      className="bulk-actions"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowBulkDropdown(!showBulkDropdown)
                      }}
                      type="button"
                      style={{
                        cursor: 'pointer'
                      }}
                    >
                      <span>BULK ACTIONS</span>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {showBulkDropdown && (
                      <div 
                        className="dropdown-menu show" 
                        style={{ 
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          right: 0,
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          width: 'fit-content',
                          zIndex: 9999,
                          padding: '8px 0'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {bulkActions.map((action, index) => (
                          <div 
                            key={index}
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation()
                              action.action()
                              setShowBulkDropdown(false)
                            }}
                            style={{
                              padding: '10px 10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'background-color 0.2s',
                              fontSize: '14px'
                            }}
                          >
                            {action.icon && <span>{action.icon}</span>}
                            <span style={{ fontSize: '14px', color: '#333' }}>{action.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
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
          />

          <div className="pagination-container">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || invoicesLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 6L5 12L11 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6L13 12L19 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || invoicesLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M15.75 6L9.75 12L15.75 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="pagination-info">{currentPage} / {pagination.totalPages || 1}</span>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages || invoicesLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages || invoicesLoading}
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
          selectedOrganizations={selectedInvoices}
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

        <ManagePaymentModal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          paymentData={null}
          onSave={handleSavePayment}
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
    </div>
  )
}

export default ViewInvoices