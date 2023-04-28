import axios from "axios";
import axiosInstance from "../../utils/AxiosInstance";
import { getPeriodsSuccess } from "./Actions";

export const getPeriods = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/periods");
    dispatch(getPeriodsSuccess(response.data));
  } catch (error) {
    throw error.message;
  }
};
