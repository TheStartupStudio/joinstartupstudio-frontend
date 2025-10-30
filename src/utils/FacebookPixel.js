/**
 * Facebook Pixel Event Tracking Utility
 * Use these functions to track user actions throughout the app
 */

// Check if fbq is available
const isFbqAvailable = () => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function'
}

// ✅ Track which events have been fired to prevent duplicates
const firedEvents = new Set()

// ✅ Helper to prevent duplicate events within a time window
const trackEventOnce = (eventKey, trackFunction, timeout = 5000) => {
  if (firedEvents.has(eventKey)) {
    console.log(`🚫 Prevented duplicate event: ${eventKey}`)
    return false
  }
  
  firedEvents.add(eventKey)
  trackFunction()
  
  // Clear the flag after timeout
  setTimeout(() => {
    firedEvents.delete(eventKey)
  }, timeout)
  
  return true
}

/**
 * Track standard Facebook events
 */
export const trackPageView = () => {
  if (isFbqAvailable()) {
    window.fbq('track', 'PageView')
  }
}

export const trackTrialStarted = (trialData = {}) => {
  if (isFbqAvailable()) {
    const eventKey = `StartTrial_${Date.now()}`
    trackEventOnce(eventKey, () => {
      window.fbq('track', 'StartTrial', {
        value: trialData.value || 0,
        currency: trialData.currency || 'USD',
        predicted_ltv: trialData.predictedLifetimeValue || 0
      })
      console.log('✅ Facebook Pixel: Trial Started tracked')
    })
  }
}

export const trackSignUp = (method = 'email') => {
  if (isFbqAvailable()) {
    const eventKey = `CompleteRegistration_${Date.now()}`
    trackEventOnce(eventKey, () => {
      window.fbq('track', 'CompleteRegistration', {
        status: 'completed',
        registration_method: method
      })
      console.log('✅ Facebook Pixel: Sign Up tracked')
    })
  }
}

export const trackSubscribe = (subscriptionData = {}) => {
  if (isFbqAvailable()) {
    const eventKey = `Subscribe_${subscriptionData.value || 'default'}_${Date.now()}`
    trackEventOnce(eventKey, () => {
      window.fbq('track', 'Subscribe', {
        value: subscriptionData.value || 0,
        currency: subscriptionData.currency || 'USD',
        predicted_ltv: subscriptionData.predictedLifetimeValue || 0
      })
      console.log('✅ Facebook Pixel: Subscribe tracked')
    })
  }
}

export const trackCancelSubscription = (cancellationData = {}) => {
  if (isFbqAvailable()) {
    const eventKey = `CancelSubscription_${Date.now()}`
    trackEventOnce(eventKey, () => {
      window.fbq('trackCustom', 'CancelSubscription', {
        cancellation_reason: cancellationData.reason || 'user_initiated',
        subscription_duration: cancellationData.duration || 0,
        subscription_value: cancellationData.value || 0,
        currency: cancellationData.currency || 'USD',
        user_segment: cancellationData.userSegment || ''
      })
      console.log('✅ Facebook Pixel: Cancel Subscription tracked', cancellationData)
    })
  }
}

export const trackLead = (leadData = {}) => {
  if (isFbqAvailable()) {
    const eventKey = `Lead_${Date.now()}`
    trackEventOnce(eventKey, () => {
      window.fbq('track', 'Lead', {
        content_name: leadData.contentName || '',
        content_category: leadData.contentCategory || ''
      })
      console.log('✅ Facebook Pixel: Lead tracked')
    })
  }
}

/**
 * Track custom events (use for app-specific actions)
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('trackCustom', eventName, eventData)
    console.log(`✅ Facebook Pixel: Custom event "${eventName}" tracked`, eventData)
  }
}

// Export all tracking functions
export default {
  trackPageView,
  trackTrialStarted,
  trackSignUp,
  trackSubscribe,
  trackCancelSubscription,
  trackLead,
  trackCustomEvent
}