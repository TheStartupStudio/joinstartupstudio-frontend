import axiosInstance from '../../utils/AxiosInstance'

/**
 * Fetches organization branding (logo, banner) by domain.
 * @param {string} domain - Organization domain (e.g. subdomain or full domain)
 * @returns {Promise<{ success: boolean, logo: string|null, banner: string|null }>}
 */
export const getOrganizationBrandingByDomain = async (domain) => {
  const response = await axiosInstance.get('/auth/organization-branding', {
    params: { domain: (domain || '').toString().trim() }
  })
  return response.data
}
