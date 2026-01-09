import axiosInstance from './AxiosInstance'

export const invoiceApi = {
  /**
   * Get ALL invoices (super admin only)
   */
  getAllInvoices: async (params = {}) => {
    const { page = 1, limit = 10, status, search = '', organizationName, dateFrom, dateTo } = params
    const response = await axiosInstance.get('/invoices', {
      params: { page, limit, status, search, organizationName, dateFrom, dateTo }
    })
    return response.data
  },

  /**
   * Get all invoices for an organization
   */
  getOrganizationInvoices: async (organizationId, params = {}) => {
    const { page = 1, limit = 10, status } = params
    
    const response = await axiosInstance.get(`/invoices/organization/${organizationId}`, {
      params: { page, limit, status }
    })
    
    return response.data
  },

  /**
   * Get single invoice by ID
   */
  getInvoiceById: async (invoiceId) => {
    const response = await axiosInstance.get(`/invoices/${invoiceId}`)
    return response.data
  },

  /**
   * Generate invoice for organization
   */
  generateInvoice: async (organizationId) => {
    const response = await axiosInstance.post(`/invoices/generate/${organizationId}`)
    return response.data
  },

  /**
   * Update invoice
   */
  updateInvoice: async (invoiceId, data) => {
    const response = await axiosInstance.put(`/invoices/${invoiceId}`, data)
    return response.data
  },

  /**
   * Delete invoice (hard delete)
   */
  deleteInvoice: async (invoiceId) => {
    const response = await axiosInstance.delete(`/invoices/${invoiceId}`)
    return response.data
  },

  /**
   * Pay invoice
   */
  payInvoice: async (invoiceId, paymentData) => {
    const response = await axiosInstance.post(`/invoices/${invoiceId}/pay`, paymentData)
    return response.data
  },

  /**
   * Send invoice email
   */
  sendInvoiceEmail: async (invoiceId, emailData) => {
    const response = await axiosInstance.post(`/invoices/${invoiceId}/send`, emailData)
    return response.data
  },

  /**
   * Download invoice PDF
   */
  downloadInvoice: async (invoiceId) => {
    const response = await axiosInstance.get(`/client/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    })
    return response
  },

  // ✅ ARCHIVE FUNCTIONALITY (matching backend routes)

  /**
   * Get all archived invoices for current user
   */
  getArchivedInvoices: async (params = {}) => {
    const { page = 1, limit = 10, search = '', organizationName, dateFrom, dateTo } = params
    const response = await axiosInstance.get('/client/invoices/archived', {
      params: { page, limit, search, organizationName, dateFrom, dateTo }
    })
    return response.data
  },

  /**
   * Archive invoice - creates archive record
   */
  archiveInvoice: async (invoiceId, notes = null) => {
    const response = await axiosInstance.post(`/invoices/${invoiceId}/archive`, { notes })
    return response.data
  },

  /**
   * Unarchive invoice - removes from archive
   */
  unarchiveInvoice: async (invoiceId) => {
    const response = await axiosInstance.delete(`/invoices/${invoiceId}/unarchive`)
    return response.data
  },

  /**
   * Bulk archive invoices
   */
  bulkArchiveInvoices: async (invoiceIds) => {
    const response = await axiosInstance.post('/client/invoices/bulk-archive', { invoiceIds })
    return response.data
  },

  /**
   * Bulk generate invoices
   */
  bulkGenerateInvoices: async (organizationIds) => {
    const promises = organizationIds.map(id => 
      axiosInstance.post(`/invoices/generate/${id}`)
    )
    const responses = await Promise.allSettled(promises)
    return responses
  },

  /**
   * Get all invoices for the logged-in client's organization
   */
  getClientInvoices: async (params = {}) => {
    const { page = 1, limit = 10, search = '', organizationName, dateFrom, dateTo } = params
    const response = await axiosInstance.get('/client/invoices', {
      params: { page, limit, search, organizationName, dateFrom, dateTo }
    })
    return response.data
  },

  /**
   * Get single invoice details for client
   */
  getClientInvoiceById: async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`/client/invoices/${invoiceId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching client invoice:', error)
      throw error
    }
  },

  /**
   * Pay an invoice using Stripe (client-side)
   */
  // payClientInvoice: async (invoiceId, paymentData) => {
  //   try {
  //     const response = await axiosInstance.post(`/client/invoices/${invoiceId}/pay`, paymentData)
  //     return response.data
  //   } catch (error) {
  //     console.error('Error paying client invoice:', error)
  //     throw error
  //   }
  // },

  /**
   * Download invoice as PDF (client-side)
   */
  downloadClientInvoice: async (invoiceId) => {
    const response = await axiosInstance.get(`/client/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice-${invoiceId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    return response.data
  },

  /**
   * Pay invoice (client-side)
   */
  payClientInvoice: async (invoiceId, paymentData = {}) => {
    const response = await axiosInstance.post(`/client/invoices/${invoiceId}/pay`, paymentData)
    return response.data
  },

  /**
   * Schedule invoice payment
   */
  scheduleInvoicePayment: async (invoiceId, data) => {
    const response = await axiosInstance.post(`/invoices/${invoiceId}/schedule-payment`, data)
    return response.data
  },

  /**
   * Get client payment method
   */
  getClientPaymentMethod: async () => {
    const response = await axiosInstance.get('/client/payment-method')
    return response.data
  }
}