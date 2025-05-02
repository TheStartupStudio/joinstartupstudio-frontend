import { 
  GET_ALL_PODCAST, 
  GET_ALL_PODCAST_ERROR, 
  GET_GUIDANCE_VIDEOS,
  GET_MASTERCLASS_VIDEOS,
  SET_LOADING 
} from './Types'

const initialState = {
  podcasts: [],
  guidanceVideos: [],
  masterclassVideos: [],
  loading: false,
  error: null
}

const podcastReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_ALL_PODCAST:
      return {
        ...state,
        podcasts: payload,
        loading: false
      }
    case GET_GUIDANCE_VIDEOS:
      return {
        ...state,
        guidanceVideos: payload,
        loading: false
      }
    case GET_MASTERCLASS_VIDEOS:
      return {
        ...state,
        masterclassVideos: payload,
        loading: false
      }
    case GET_ALL_PODCAST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      }
    default:
      return state
  }
}

export default podcastReducer
