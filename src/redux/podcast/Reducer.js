import { GET_ALL_PODCAST, GET_ALL_PODCAST_ERROR } from './Types'

const initialState = {
  podcasts: []
}

const podcastReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case GET_ALL_PODCAST:
      return {
        ...state,
        podcasts: payload
      }

    default:
      return state
  }
}

export default podcastReducer
