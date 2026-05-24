import { getClientsConfigUrl } from './getBaseURL'

/**
 * First hostname label when the app is on a tenant subdomain
 * (e.g. fma.joinstudioos.com → "fma"). Null for localhost or bare host.
 */
export function getHostnameSubdomainLabel() {
  if (typeof window === 'undefined') return null
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null
  const parts = hostname.split('.')
  if (parts.length < 3) return null
  const sub = parts[0]
  if (!sub || sub === 'www' || sub === 'api') return null
  return sub
}

/**
 * Canonical client mapping for hostname-derived slugs.
 */
export function normalizeClientName(clientValue) {
  if (clientValue == null) return clientValue
  const normalized = String(clientValue).trim()
  if (!normalized) return normalized
  if (normalized.toLowerCase() === 'tss-dev') return 'LOCAL'
  return normalized
}

const MULTI_CLIENT_DEFAULT_SUBDOMAINS = new Set(['studio', 'tss', 'tss-dev'])

/** Subdomains where the clients-config list (Select Clients) is editable. */
const MULTI_CLIENT_LIST_CHOICE_SUBDOMAINS = new Set([
  'studio',
  'academy',
  'tss',
  'tss-dev'
])

/**
 * Organization and similar admin pickers: localhost and any tenant subdomain.
 */
export function canChooseClientInUI() {
  if (typeof window === 'undefined') return true
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true
  return getHostnameSubdomainLabel() != null
}

/**
 * Select Clients (clients-config) picker: localhost, studio, academy, and dev hosts.
 * Tenant-specific hosts (e.g. fma) lock to that subdomain slug.
 */
export function canChooseClientsListInUI() {
  if (typeof window === 'undefined') return true
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true
  const sub = getHostnameSubdomainLabel()
  if (sub == null) return false
  return MULTI_CLIENT_LIST_CHOICE_SUBDOMAINS.has(sub)
}

/** Studio/dev hosts default API client to "all"; other tenants default to their slug. */
export function usesAllClientsDefault() {
  if (typeof window === 'undefined') return true
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true
  const sub = getHostnameSubdomainLabel()
  return sub == null || MULTI_CLIENT_DEFAULT_SUBDOMAINS.has(sub)
}

/**
 * Value for API `client` fields: manual selection when set; otherwise "all"
 * on studio/dev hosts or the current tenant slug (e.g. fma).
 */
export function getClientPayloadValue(selectedFromForm) {
  if (selectedFromForm != null && selectedFromForm !== '') {
    return normalizeClientName(selectedFromForm)
  }
  if (usesAllClientsDefault()) return 'all'
  const slug = getHostnameSubdomainLabel()
  return normalizeClientName(slug) || 'all'
}

/**
 * `globalId` for edit/delete payloads: prefer id from the loaded record, then
 * `REACT_APP_GLOBAL_ID` in `.env`. Omitted when neither is set.
 */
export function getGlobalIdForPayload(recordGlobalId) {
  if (recordGlobalId != null && String(recordGlobalId).trim() !== '') {
    return String(recordGlobalId).trim()
  }
  const v = process.env.REACT_APP_GLOBAL_ID
  if (v == null || String(v).trim() === '') return undefined
  return String(v).trim()
}

export function attachGlobalIdToPayload(payload, recordGlobalId) {
  const gid = getGlobalIdForPayload(recordGlobalId)
  if (gid === undefined) return { ...payload }
  return { ...payload, globalId: gid }
}

/** Body for DELETE (and similar) with `client` + optional `globalId`. */
export function getClientAndGlobalBody(selectedFromForm, recordGlobalId) {
  return attachGlobalIdToPayload(
    { client: getClientPayloadValue(selectedFromForm) },
    recordGlobalId
  )
}

/**
 * clients-config is served from the shared /academy/ API on production.
 * Tenant subdomains (fma, etc.) use their own API root for other routes.
 */
export async function fetchClientsConfig(axiosInstance) {
  return axiosInstance.get(getClientsConfigUrl())
}

/** @returns {string[]} */
export function parseClientsConfigResponse(response) {
  const clientsList = response?.data?.clients
  return Array.isArray(clientsList) ? clientsList : []
}
