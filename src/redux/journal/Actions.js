import {
  LOADING_J,
  JOURNAL_SAVE_SUCCESS,
  JOURNAL_SAVE_ERROR,
  JOURNAL_GET_SUCCESS,
  JOURNAL_GET_ERROR,
  JOURNAL_FINISHED_SUCCESS,
  JOURNAL_FINISHED_ERROR,
  GET_FINISHED_JOURNAL_SUCCESS,
  SAVE_FINISHED_JOURNAL_SUCCESS,
  SAVE_FINISHED_COURSE_SUCCESS
} from './Types'

import axiosInstance from '../../utils/AxiosInstance'

export const checkIfUserHasFinishedJournal =
  (journalId) => async (dispatch) => {
    const journalItems = []
    const journalTasks = await axiosInstance.get(`/journals/${journalId}`)
    const response = await axiosInstance.get(`/userItems/${journalId}/journal`)
    const currentJournal = response.data
    try {
      for (let i = 0; i < journalTasks.data.Items.length; i++) {
        if (
          currentJournal.map(
            (item) => item.Item.order === journalTasks.data.Items[i].order
          )
        ) {
          //check this again
          currentJournal.map((item) => {
            if (item.content !== null && item.content !== '') {
              journalItems.push(true)
            }
          })
        } else {
          if (
            journalTasks.data.Items[i].type === 'empty' ||
            journalTasks.data.Items[i].type === null
          ) {
            journalItems.push(true)
          } else {
            journalItems.push(false)
          }
        }
      }
      journalItems.includes(false) || journalItems.length === 0
        ? dispatch({
            type: JOURNAL_FINISHED_SUCCESS,
            payload: false
          })
        : dispatch({
            type: JOURNAL_FINISHED_SUCCESS,
            payload: true
          })
    } catch (err) {
      dispatch({
        type: JOURNAL_FINISHED_ERROR,
        payload: err?.response?.data?.message || 'Server Error'
      })
    }
  }

export const saveJournal = (data) => async (dispatch) => {
  try {
    //LOADING_J first
    dispatch({ type: LOADING_J })

    await axiosInstance.post(`/userItems/multiple`, data).then((res) =>
      dispatch({
        type: JOURNAL_SAVE_SUCCESS,
        payload: res.data
      })
    )

    const journalParams = {
      journals: [data.journalId]
    }
    await axiosInstance.post(`/histories`, journalParams)

    dispatch(checkIfUserHasFinishedJournal(data.journalId))
  } catch (err) {
    dispatch({
      type: JOURNAL_SAVE_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const getJournal = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`/userItems/${data.journalId}`)
    dispatch({
      type: JOURNAL_GET_SUCCESS,
      payload: response.data
    })
  } catch (err) {
    dispatch({
      type: JOURNAL_GET_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const getFinishedJournals = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`/histories`)

    dispatch({
      type: GET_FINISHED_JOURNAL_SUCCESS,
      payload: response.data
    })
  } catch (err) {
    dispatch({
      type: JOURNAL_GET_ERROR,
      payload: err?.response?.data?.message || 'Server Error'
    })
  }
}

export const saveFinishedJournals = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_FINISHED_JOURNAL_SUCCESS,
    payload: data
  })
}

export const saveFinishedCourses = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_FINISHED_COURSE_SUCCESS,
    payload: data
  })
}
