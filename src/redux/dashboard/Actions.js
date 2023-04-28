import {
  GET_PERIODS_START,
  GET_PERIODS_SUCCESS,
  GET_PERIODS_ERROR,
} from "./Types";
// import { Auth } from "aws-amplify";
import axiosInstance from "../../utils/AxiosInstance";
import { getPeriods } from "./Service";
import { JOURNAL_GET_ERROR } from "../journal/Types";
// import { toast } from "react-toastify";
// import IntlMessages from "../../utils/IntlMessages";
// actions.js
import axios from "axios";

export const getPeriodsStart = () => async (dispatch) => {
  try {
    // dispatch({ type: GET_PERIODS_START });
    const response = await axiosInstance.get("/periods");
    const periods = response.data;
    dispatch({
      type: GET_PERIODS_SUCCESS,
      payload: { periods },
    });
  } catch (error) {
    dispatch({
      type: GET_PERIODS_ERROR,
      payload: { error: error.message },
    });
  }
};

export const getPeriodsSuccess = (periods) => {
  return {
    type: GET_PERIODS_SUCCESS,
    payload: periods,
  };
};

export const getPeriodsError = (error) => async (dispatch) => {
  dispatch({
    type: GET_PERIODS_ERROR,
    payload: error?.response?.data?.message || "Server Error",
  });
};
