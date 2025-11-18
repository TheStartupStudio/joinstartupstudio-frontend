// Track user registration
export const trackRegistration = (userData) => {
  if (typeof window.trackGA4Signup === 'function') {
    window.trackGA4Signup({
      userId: userData.userId,
      method: userData.method || 'email',
      role: userData.role || 'student',
      subscriptionStatus: 'trial'
    })
  }
}

// Track subscription purchase
export const trackSubscriptionPurchase = (subscriptionData) => {
  const { plan, price, transactionId, items } = subscriptionData

  if (typeof window.trackGA4Purchase === 'function') {
    window.trackGA4Purchase({
      transactionId: transactionId,
      value: parseFloat(price),
      currency: 'USD',
      items: items || [{
        item_id: plan,
        item_name: `${plan} Subscription`,
        item_category: 'Subscription',
        price: parseFloat(price),
        quantity: 1
      }]
    })
  }

  if (typeof window.trackGA4Subscribe === 'function') {
    window.trackGA4Subscribe({
      value: parseFloat(price),
      currency: 'USD',
      plan: plan,
      billingCycle: 'monthly'
    })
  }
}

// Track trial start
export const trackTrialStart = (trialData) => {
  if (typeof window.trackGA4TrialStart === 'function') {
    window.trackGA4TrialStart({
      plan: trialData.plan || 'free_trial',
      predictedLTV: trialData.predictedLTV || 119.88
    })
  }
}

// Track search
export const trackSearch = (searchData) => {
  if (typeof window.trackGA4Search === 'function') {
    window.trackGA4Search(searchData.query, searchData.resultsCount)
  }
}

// Track errors
export const trackError = (errorData) => {
  if (typeof window.trackGA4Error === 'function') {
    window.trackGA4Error(errorData.message, errorData.type)
  }
}

// Track subscription cancellation
export const trackCancellation = (cancellationData) => {
  if (typeof window.trackGA4CancelSubscription === 'function') {
    window.trackGA4CancelSubscription({
      reason: cancellationData.reason,
      duration: cancellationData.duration || 0,
      value: cancellationData.value || 0
    })
  }
}