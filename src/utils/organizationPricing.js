import axiosInstance from './AxiosInstance'
import { DEFAULT_TRIAL_SETTINGS } from './trialSettings'

export const DEFAULT_PLAN_DETAILS = {
  monthly: {
    price: '15.00',
    total: '15.00',
    period: 'month',
    priceId: process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID,
    frequency: 'monthly',
    commitment: '12-months commitment'
  },
  annual: {
    price: '150.00',
    total: '150.00',
    period: 'year',
    priceId: process.env.REACT_APP_STRIPE_ANNUAL_PRICE_ID,
    frequency: 'yearly',
    commitment: 'Get 2 months free when you pay for the entire year'
  }
}

const PERIOD_MAP = {
  monthly: 'month',
  yearly: 'year',
  'one-time': 'one-time',
  '6-month': '6 months'
}

const COMMITMENT_MAP = {
  monthly: '12 months',
  yearly: 'year',
  'one-time': 'one-time payment',
  '6-month': '6 months'
}

export function transformApiPricingToPlanDetails(pricing = {}) {
  const orgPricing = {}

  Object.keys(pricing).forEach((key) => {
    const plan = pricing[key]
    if (!plan || plan.amount == null) return

    orgPricing[key] = {
      price: Number(plan.amount).toFixed(2),
      total: Number(plan.amount).toFixed(2),
      period: PERIOD_MAP[plan.frequency] || plan.frequency,
      priceId: plan.priceId,
      commitment: COMMITMENT_MAP[plan.frequency] || plan.frequency,
      description: plan.description,
      frequency: plan.frequency,
      isOrganizationPrice: true
    }
  })

  return orgPricing
}

export function resolvePlanDetailsFromApiResponse(data) {
  if (data?.pricing && Object.keys(data.pricing).length > 0) {
    return transformApiPricingToPlanDetails(data.pricing)
  }

  if (data?.defaultPricing && Object.keys(data.defaultPricing).length > 0) {
    return transformApiPricingToPlanDetails(data.defaultPricing)
  }

  return null
}

export function getDefaultSelectedPlan(planDetails = {}) {
  if (planDetails.monthly) return 'monthly'
  if (planDetails.annual) return 'annual'
  if (planDetails['6-month']) return '6-month'
  if (planDetails['one-time']) return 'one-time'
  return Object.keys(planDetails)[0] || 'monthly'
}

export function buildSubscriptionCheckoutPayload(selectedPlan, planDetails = {}) {
  const selected = planDetails[selectedPlan] || {}

  return {
    planType: selectedPlan,
    organizationPriceId: selected.priceId,
    frequency: selected.frequency || selectedPlan,
    isOneTime:
      selectedPlan === 'one-time' || selected.frequency === 'one-time'
  }
}

export function getLowestPlanPrice(planDetails = DEFAULT_PLAN_DETAILS) {
  const amounts = Object.values(planDetails)
    .map((plan) => parseFloat(plan.price))
    .filter((amount) => Number.isFinite(amount) && amount >= 0)

  if (amounts.length === 0) return null
  return Math.min(...amounts).toFixed(2)
}

export function getRegisterHeadline(planDetails, trialSettings = DEFAULT_TRIAL_SETTINGS) {
  if (trialSettings?.trialEnabled) {
    const days = trialSettings.trialPeriodDays ?? 14
    return days === 1
      ? 'Start your 1-day free trial today'
      : `Start your ${days}-day free trial today`
  }

  const monthlyPrice = planDetails?.monthly?.price
  if (monthlyPrice) {
    return `Plans from $${monthlyPrice}/month`
  }

  const lowestPrice = getLowestPlanPrice(planDetails)
  if (lowestPrice != null) {
    return `Plans from $${lowestPrice}`
  }

  return 'Start building today'
}

export function getRegisterTrialNotice(trialSettings = DEFAULT_TRIAL_SETTINGS) {
  if (!trialSettings?.trialEnabled) {
    return 'Your card is stored securely. You will be charged based on the plan you choose when you subscribe. You may cancel at any time from your account settings.'
  }

  const days = trialSettings.trialPeriodDays ?? 14
  const trialLabel = days === 1 ? '1-day free trial' : `${days}-day free trial`

  return `Your card is stored securely and won’t be charged today. After your ${trialLabel}, your card will be charged based on the plan you choose. You may cancel at any time by going to your account settings page. Cancellation must be submitted at least 48 hours prior to renewal.`
}

export async function fetchOrganizationPricingByEmail(email) {
  const response = await axiosInstance.post('/auth/check-organization-pricing', {
    email
  })

  return response.data
}

export async function fetchOrganizationPricingForUser(userId) {
  const response = await axiosInstance.get(
    '/super-admin/user/organization-pricing',
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }
  )

  return response.data
}
