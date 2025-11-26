import axiosInstance from './AxiosInstance'

export const invoiceApi = {

     /**
   * Get ALL invoices (super admin only)
   */
    getAllInvoices: async (params = {}) => {
    const { page = 1, limit = 10, status, includeArchived = 'false', search = '' } = params
    const response = await axiosInstance.get('/invoices', {
      params: { page, limit, status, includeArchived, search }
    })
    return response.data
  },

  /**
   * Get all invoices for an organization
   */
  getOrganizationInvoices: async (organizationId, params = {}) => {
    const { page = 1, limit = 10, status, includeArchived = 'false' } = params
    
    console.log('Fetching invoices with params:', {
      organizationId,
      page,
      limit,
      status,
      includeArchived
    })
    
    const response = await axiosInstance.get(`/invoices/organization/${organizationId}`, {
      params: { page, limit, status, includeArchived }
    })
    
    console.log('Invoice API response:', response.data)
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
   * Delete invoice
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
   * Archive invoice
   */
  archiveInvoice: async (invoiceId) => {
    const response = await axiosInstance.post(`/invoices/${invoiceId}/archive`)
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
  }
}