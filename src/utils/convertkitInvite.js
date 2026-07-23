/**
 * ConvertKit / Kit friend invite from the browser (public API key only).
 * Kit V3 form subscribe allows browser CORS (Access-Control-Allow-Origin: *).
 */
const CONVERTKIT_API_KEY = 'oC-yebuKqrCmJHqMpKs6yA'
const CONVERTKIT_FORM_ID = '9692068'
const CONVERTKIT_FRIEND_TAG_ID = '21234880'

export async function sendFriendInviteViaConvertKit({
  friendName,
  friendEmail
}) {
  const subscribeRes = await fetch(
    `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: friendEmail,
        first_name: friendName
      })
    }
  )

  if (!subscribeRes.ok) {
    const text = await subscribeRes.text()
    throw new Error(text || `ConvertKit error (${subscribeRes.status})`)
  }

  // Tag for Kit automations tied to "invited-friend" (best-effort)
  try {
    await fetch(
      `https://api.convertkit.com/v3/tags/${CONVERTKIT_FRIEND_TAG_ID}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: friendEmail
        })
      }
    )
  } catch (_) {
    /* ignore tag failures */
  }

  return subscribeRes.json()
}
