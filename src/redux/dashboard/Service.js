import axios from "axios";
import axiosInstance from "../../utils/AxiosInstance";
import { getPeriodsSuccess } from "./Actions";

export const getPeriods = () => async (dispatch) => {
  debugger;
  try {
    const response = await axiosInstance.get("/periods");
    debugger;
    dispatch(getPeriodsSuccess(response.data));
  } catch (error) {
    throw error.message;
  }
};
