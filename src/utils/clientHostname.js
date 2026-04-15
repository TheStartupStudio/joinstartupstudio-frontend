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
 * Client picker is only shown on localhost or the studio tenant subdomain.
 * Other subdomains (e.g. fma) send client derived from the hostname.
 */
export function canChooseClientInUI() {
  if (typeof window === 'undefined') return true
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true
  return getHostnameSubdomainLabel() === 'studio'
}

/**
 * Value for API `client` fields: manual selection when allowed; otherwise subdomain slug.
 */
export function getClientPayloadValue(selectedFromForm) {
  if (canChooseClientInUI()) {
    if (selectedFromForm != null && selectedFromForm !== '') {
      return selectedFromForm
    }
    return 'all'
  }
  const slug = getHostnameSubdomainLabel()
  return slug || 'all'
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
