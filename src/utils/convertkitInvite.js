/**
 * Studio Builder Challenge — "Invite a friend" (frontend-only, Kit/ConvertKit only).
 *
 * Uses ONLY the public API key (never the API secret) so nothing sensitive is
 * exposed in the browser bundle. Form UID and tag name were resolved once to
 * their numeric Kit IDs (v3 subscribe/tag endpoints require numeric IDs).
 *
 *   CONVERTKIT_FORM_ID  = numeric id for form uid "f0f989bbe1"
 *   CONVERTKIT_TAG_ID   = numeric id for tag "invited-friend"
 */
const CONVERTKIT_API_KEY = 'oC-yebuKqrCmJHqMpKs6yA'
const CONVERTKIT_FORM_ID = '9692068' // uid: f0f989bbe1
const CONVERTKIT_TAG_ID = '21234880' // name: invited-friend

async function kitPost(path, body) {
  const response = await fetch(`https://api.convertkit.com/v3${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: CONVERTKIT_API_KEY, ...body })
  })

  const text = await response.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch (_) {
    json = null
  }

  return { ok: response.ok, status: response.status, text, json }
}

export async function sendFriendInviteViaConvertKit({
  friendName,
  friendEmail,
  inviterName,
  inviterEmail
}) {
  let result = await kitPost(`/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
    email: friendEmail,
    first_name: friendName,
    fields: {
      inviter_name: inviterName || '',
      inviter_email: inviterEmail || ''
    }
  })

  // Retry without custom fields in case the account doesn't have them
  if (!result.ok) {
    result = await kitPost(`/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      email: friendEmail,
      first_name: friendName
    })
  }

  if (!result.ok) {
    throw new Error(result.text || `ConvertKit error (${result.status})`)
  }

  // Tag drives the actual invite automation/email in Kit — best-effort
  try {
    await kitPost(`/tags/${CONVERTKIT_TAG_ID}/subscribe`, {
      email: friendEmail
    })
  } catch (error) {
    console.warn('ConvertKit tag failed (subscription still created):', error)
  }

  return result.json
}
