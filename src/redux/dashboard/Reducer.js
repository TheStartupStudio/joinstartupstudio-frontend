import {
  GET_PERIODS_ERROR,
  GET_PERIODS_START,
  GET_PERIODS_SUCCESS,
} from "./Types";

const initialState = {
  periods: [],
  loading: false,
  error: null,
};

const dashboardReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PERIODS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PERIODS_SUCCESS:
      debugger;
      return {
        ...state,
        periods: payload.periods,
        loading: false,
        error: null,
      };
    case GET_PERIODS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    default:
      return state;
  }
};
export default dashboardReducer;
