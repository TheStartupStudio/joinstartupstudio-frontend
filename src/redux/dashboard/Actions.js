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
} from "./Types";
// import { Auth } from "aws-amplify";
import axiosInstance from "../../utils/AxiosInstance";
import {getEvents, getPeriods, postEvent} from "./Service";
import { JOURNAL_GET_ERROR } from "../journal/Types";
// import { toast } from "react-toastify";
// import IntlMessages from "../../utils/IntlMessages";
// actions.js
import axios from "axios";

export const getPeriodsStart = () => async (dispatch) => {
  dispatch({ type: GET_PERIODS_START });
  try {
    const response = await getPeriods();
    const periods = response.data;
   dispatch(getPeriodsSuccess(periods))
  } catch (error) {
    dispatch(getPeriodsError(error))

  }
};

export const getPeriodsSuccess = (periods) => {
  return {
    type: GET_PERIODS_SUCCESS,
    payload: {periods},
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
    const periods = response.data;
    dispatch(getEventsSuccess(periods))
  } catch (error) {
    dispatch(getEventsError(error))

  }
};

export const getEventsSuccess = (events) => {
  return {
    type: GET_EVENTS_SUCCESS,
    payload: {events},
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

    const periods = response.data;
    dispatch(postEventSuccess(periods))
  } catch (error) {
    dispatch(postEventError(error))

  }
};

export const postEventSuccess = (event) => {
  return {
    type: POST_EVENT_SUCCESS,
    payload: {event},
  };
};

export const postEventError = (error) => async (dispatch) => {
  dispatch({
    type: POST_EVENT_ERROR,
    payload: error?.response?.data?.message || "Server Error",
  });
};

