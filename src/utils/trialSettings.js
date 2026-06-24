export const DEFAULT_TRIAL_SETTINGS = {
  trialEnabled: true,
  trialPeriodDays: 14
}

export function getTrialSettingsFromUniversity(university) {
  if (!university) {
    return DEFAULT_TRIAL_SETTINGS
  }

  const trialEnabled = university.trialEnabled !== false
  const parsedDays = parseInt(university.trialPeriodDays, 10)
  const trialPeriodDays =
    Number.isFinite(parsedDays) && parsedDays >= 0 ? parsedDays : 14

  return {
    trialEnabled: trialEnabled && trialPeriodDays > 0,
    trialPeriodDays
  }
}

export function formatTrialLabel(trialPeriodDays) {
  return trialPeriodDays === 1 ? '1-day trial' : `${trialPeriodDays}-day trial`
}
