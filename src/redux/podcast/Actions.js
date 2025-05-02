import { 
  GET_ALL_PODCAST, 
  GET_ALL_PODCAST_ERROR,
  GET_GUIDANCE_VIDEOS,
  GET_MASTERCLASS_VIDEOS,
  SET_LOADING 
} from './Types'
import axiosInstance from '../../utils/AxiosInstance'

export const setLoading = () => ({
  type: SET_LOADING
})

export const getAllPodcast = () => async (dispatch) => {
  try {
    dispatch(setLoading())
    const response = await axiosInstance.get('/podcast?page=0&size=100')
    dispatch({
      type: GET_ALL_PODCAST,
      payload: response.data
    })
  } catch (err) {
    dispatch({
      type: GET_ALL_PODCAST_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const getGuidanceVideos = () => async (dispatch) => {
  try {
    dispatch(setLoading())
    const response = await axiosInstance.get('/contents/by-type/guidance')
    dispatch({
      type: GET_GUIDANCE_VIDEOS,
      payload: response.data
    })
  } catch (err) {
    dispatch({
      type: GET_ALL_PODCAST_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const getMasterclassVideos = () => async (dispatch) => {
  try {
    dispatch(setLoading())
    const response = await axiosInstance.get('/contents/by-type/master')
    dispatch({
      type: GET_MASTERCLASS_VIDEOS,
      payload: response.data
    })
  } catch (err) {
    dispatch({
      type: GET_ALL_PODCAST_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}
