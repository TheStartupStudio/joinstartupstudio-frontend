import { GET_ALL_PODCAST, GET_ALL_PODCAST_ERROR } from './Types'

import axiosInstance from '../../utils/AxiosInstance'

export const getAllPodcast = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/podcast')
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
