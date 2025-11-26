export const setTrialTime = (totalSeconds, isTrialActive) => ({
  type: 'SET_TRIAL_TIME',
  payload: { totalSeconds, isTrialActive }
})

export const decrementTrialTime = () => ({
  type: 'DECREMENT_TRIAL_TIME'
})

export const stopTrialTime = () => ({
  type: 'STOP_TRIAL_TIME'
})