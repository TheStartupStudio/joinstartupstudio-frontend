import {
  GET_PERIODS_START,
  GET_PERIODS_SUCCESS,
  GET_PERIODS_ERROR,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_ERROR,
  GET_EVENTS_START,
  POST_EVENT_START,
  POST_EVENT_SUCCESS,
  POST_EVENT_ERROR,
  EDIT_EVENT_START,
  EDIT_EVENT_SUCCESS,
  EDIT_EVENT_ERROR,
  DELETE_EVENT_SUCCESS,
  DELETE_EVENT_ERROR,
  CHANGE_EVENT_DATE_START,
  CHANGE_EVENT_DATE_SUCCESS,
  CHANGE_EVENT_DATE_ERROR,
  OPEN_TASK_MODAL,
  CLOSE_TASK_MODAL,
  OPEN_CALENDAR_EVENT_MODAL,
  CLOSE_CALENDAR_EVENT_MODAL,
  OPEN_CALENDAR_DELETE_EVENT_MODAL,
  CLOSE_CALENDAR_DELETE_EVENT_MODAL,
  OPEN_ADD_TASK_MODAL,
  CLOSE_ADD_TASK_MODAL,
  OPEN_EDIT_TASK_MODAL,
  CLOSE_EDIT_TASK_MODAL,
  OPEN_CALENDAR_EVENT_MODAL_IN_CLICK,
  CLOSE_CALENDAR_EVENT_MODAL_IN_CLICK,
} from "./Types";

import {
  changeEventDate,
  deleteEvent,
  editEvent,
  getEvents,
  getPeriods,
  postEvent,
} from "./Service";

export const getPeriodsStart = () => async (dispatch) => {
  dispatch({ type: GET_PERIODS_START });
  try {
    const response = await getPeriods();
    const periods = response.data;
    dispatch(getPeriodsSuccess(periods));
  } catch (error) {
    dispatch(getPeriodsError(error));
  }
};

export const getPeriodsSuccess = (periods) => {
  return {
    type: GET_PERIODS_SUCCESS,
    payload: { periods },
  };
};

export const getPeriodsError = (error) => async (dispatch) => {
  dispatch({
    type: GET_PERIODS_ERROR,
    payload: error?.response?.data?.message || "Server Error",
  });
};

export const getEventsStart = () => async (dispatch) => {
  dispatch({ type: GET_EVENTS_START });
  try {
    const response = await getEvents();

    const events = response.data;
    dispatch(getEventsSuccess(events));
  } catch (error) {
    dispatch(getEventsError(error));
  }
};

export const getEventsSuccess = (events) => {
  return {
    type: GET_EVENTS_SUCCESS,
    payload: { events },
  };
};

export const getEventsError = (error) => async (dispatch) => {
  dispatch({
    type: GET_EVENTS_ERROR,
    payload: error?.response?.data?.message || "Server Error",
  });
};

export const postEventStart = (event) => async (dispatch) => {
  dispatch({ type: POST_EVENT_START });
  try {
    const response = await postEvent(event);
    const eventData = response.data;
    dispatch(postEventSuccess(eventData));
  } catch (error) {
    dispatch(postEventError(error));
  }
};

export const postEventSuccess = (event) => {
  return {
    type: POST_EVENT_SUCCESS,
    payload: { event },
  };
};

export const postEventError = (error) => async (dispatch) => {
  dispatch({
    type: POST_EVENT_ERROR,
    payload: error?.response?.data?.message || "Server Error",
  });
};

export const editEventStart = (event, eventId) => async (dispatch) => {
  dispatch({ type: EDIT_EVENT_START });
  try {
    const response = await editEvent(event, eventId.eventId);
    const eventData = response.data;
    dispatch(editEventSuccess(eventData));
  } catch (error) {
    dispatch(editEventError(error));
  }
};

export const editEventSuccess = (event) => {
  return {
    type: EDIT_EVENT_SUCCESS,
    payload: { event },
  };
};

export const editEventError = (error) => async (dispatch) => {
  dispatch({
    type: EDIT_EVENT_ERROR,
    payload: error?.response?.data?.message || "Server Error",
  });
};

export const deleteEventStart = (eventId) => async (dispatch) => {
  dispatch({ type: EDIT_EVENT_START });
  try {
    const response = await deleteEvent(eventId);
    const eventData = response.data;
    dispatch(deleteEventSuccess(eventData));
  } catch (error) {
    dispatch(deleteEventError(error));
  }
};

export const deleteEventSuccess = (event) => {
  return {
    type: DELETE_EVENT_SUCCESS,
    payload: { event },
  };
};

export const deleteEventError = (error) => async (dispatch) => {
  dispatch({
    type: DELETE_EVENT_ERROR,
    payload: error?.response?.data?.message || "Server Error",
  });
};

export const changeEventDateStart =
  (eventDate, eventId) => async (dispatch) => {
    dispatch({ type: CHANGE_EVENT_DATE_START });
    try {
      const response = await changeEventDate(eventDate, eventId.eventId);
      const eventData = response.data;
      dispatch(changeEventDateSuccess(eventData));
    } catch (error) {
      dispatch(changeEventDateError(error));
    }
  };

export const changeEventDateSuccess = (event) => {
  return {
    type: CHANGE_EVENT_DATE_SUCCESS,
    payload: { event },
  };
};

export const changeEventDateError = (error) => async (dispatch) => {
  dispatch({
    type: CHANGE_EVENT_DATE_ERROR,
    payload: error?.response?.data?.message || "Server Error",
  });
};

export const openAddTaskModal = (type) => async (dispatch) => {
  dispatch({
    type: OPEN_ADD_TASK_MODAL,
    payload: type,
  });
};

export const closeAddTaskModal = (type) => async (dispatch) =>
  dispatch({
    type: CLOSE_ADD_TASK_MODAL,
    payload: type,
  });

export const openEditTaskModal = (type) => async (dispatch) => {
  dispatch({
    type: OPEN_EDIT_TASK_MODAL,
    payload: type,
  });
};

export const closeEditTaskModal = (type) => async (dispatch) =>
  dispatch({
    type: CLOSE_EDIT_TASK_MODAL,
    payload: type,
  });

export const openCalendarEventModal = () => ({
  type: OPEN_CALENDAR_EVENT_MODAL,
});

export const closeCalendarEventModal = () => ({
  type: CLOSE_CALENDAR_EVENT_MODAL,
});

export const openCalendarDeleteEventModal = () => ({
  type: OPEN_CALENDAR_DELETE_EVENT_MODAL,
});

export const closeCalendarDeleteEventModal = () => ({
  type: CLOSE_CALENDAR_DELETE_EVENT_MODAL,
});
export const openCalendarEventInClickModal = () => ({
  type: OPEN_CALENDAR_EVENT_MODAL_IN_CLICK,
});

export const closeCalendarEventInClickModal = () => ({
  type: CLOSE_CALENDAR_EVENT_MODAL_IN_CLICK,
});
