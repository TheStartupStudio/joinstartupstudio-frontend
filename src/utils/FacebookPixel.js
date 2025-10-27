/**
 * Facebook Pixel Event Tracking Utility
 * Use these functions to track user actions throughout the app
 */

// Check if fbq is available
const isFbqAvailable = () => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function'
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
    window.fbq('track', 'StartTrial', {
      value: trialData.value || 0,
      currency: trialData.currency || 'USD',
      predicted_ltv: trialData.predictedLifetimeValue || 0
    })
    console.log('Facebook Pixel: Trial Started tracked')
  }
}

export const trackSignUp = (method = 'email') => {
  if (isFbqAvailable()) {
    window.fbq('track', 'CompleteRegistration', {
      status: 'completed',
      registration_method: method
    })
    console.log('Facebook Pixel: Sign Up tracked')
  }
}

export const trackSubscribe = (subscriptionData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('track', 'Subscribe', {
      value: subscriptionData.value || 0,
      currency: subscriptionData.currency || 'USD',
      predicted_ltv: subscriptionData.predictedLifetimeValue || 0
    })
    console.log('Facebook Pixel: Subscribe tracked')
  }
}

export const trackPurchase = (purchaseData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('track', 'Purchase', {
      value: purchaseData.value || 0,
      currency: purchaseData.currency || 'USD',
      content_name: purchaseData.contentName || '',
      content_type: purchaseData.contentType || 'product'
    })
    console.log('Facebook Pixel: Purchase tracked')
  }
}

export const trackLead = (leadData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('track', 'Lead', {
      content_name: leadData.contentName || '',
      content_category: leadData.contentCategory || ''
    })
    console.log('Facebook Pixel: Lead tracked')
  }
}

export const trackAddToCart = (productData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('track', 'AddToCart', {
      value: productData.value || 0,
      currency: productData.currency || 'USD',
      content_name: productData.contentName || '',
      content_type: productData.contentType || 'product'
    })
    console.log('Facebook Pixel: Add to Cart tracked')
  }
}

export const trackInitiateCheckout = (checkoutData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('track', 'InitiateCheckout', {
      value: checkoutData.value || 0,
      currency: checkoutData.currency || 'USD',
      num_items: checkoutData.numItems || 1
    })
    console.log('Facebook Pixel: Initiate Checkout tracked')
  }
}

export const trackViewContent = (contentData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('track', 'ViewContent', {
      content_name: contentData.contentName || '',
      content_category: contentData.contentCategory || '',
      content_ids: contentData.contentIds || [],
      content_type: contentData.contentType || 'product'
    })
    console.log('Facebook Pixel: View Content tracked')
  }
}

export const trackSearch = (searchData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('track', 'Search', {
      search_string: searchData.searchString || '',
      content_category: searchData.contentCategory || ''
    })
    console.log('Facebook Pixel: Search tracked')
  }
}

/**
 * Track custom events (use for app-specific actions)
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  if (isFbqAvailable()) {
    window.fbq('trackCustom', eventName, eventData)
    console.log(`Facebook Pixel: Custom event "${eventName}" tracked`, eventData)
  }
}

// Export all tracking functions
export default {
  trackPageView,
  trackTrialStarted,
  trackSignUp,
  trackSubscribe,
  trackPurchase,
  trackLead,
  trackAddToCart,
  trackInitiateCheckout,
  trackViewContent,
  trackSearch,
  trackCustomEvent
}