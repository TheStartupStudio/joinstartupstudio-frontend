// backButtonReducer.js
const initialState = {
  state: false,
  location: ''
}

const backButtonReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_BACK_BUTTON':
      return {
        ...state,
        state: action.payload.state,
        location: action.payload.location
      }
    default:
      return state
  }
}

export const setBackButton = (state, location) => ({
  type: 'SET_BACK_BUTTON',
  payload: { state, location }
})

export default backButtonReducer
