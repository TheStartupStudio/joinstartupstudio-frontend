const initialState = {
  totalSeconds: 0,
  isTrialActive: false,
  trialTimeRemaining: null,
  lastFetchTime: null
}

const trialTimerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TRIAL_TIME':
      return {
        ...state,
        totalSeconds: action.payload.totalSeconds,
        isTrialActive: action.payload.isTrialActive,
        lastFetchTime: Date.now()
      }
    case 'DECREMENT_TRIAL_TIME':
      const newTotalSeconds = state.totalSeconds > 0 ? state.totalSeconds - 1 : 0
      const days = Math.floor(newTotalSeconds / (24 * 60 * 60))
      const hours = Math.floor((newTotalSeconds % (24 * 60 * 60)) / (60 * 60))
      const minutes = Math.floor((newTotalSeconds % (60 * 60)) / 60)
      const seconds = newTotalSeconds % 60
      
      return {
        ...state,
        totalSeconds: newTotalSeconds,
        trialTimeRemaining: { days, hours, minutes, seconds },
        isTrialActive: newTotalSeconds > 0
      }
    case 'STOP_TRIAL_TIME':
      return {
        ...state,
        isTrialActive: false,
        trialTimeRemaining: null
      }
    default:
      return state
  }
}

export default trialTimerReducer