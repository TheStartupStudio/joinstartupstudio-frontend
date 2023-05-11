import {
  CHANGE_EVENT_DATE_ERROR,
  CHANGE_EVENT_DATE_START,
  CHANGE_EVENT_DATE_SUCCESS,
  CLOSE_ADD_TASK_MODAL,
  CLOSE_CALENDAR_DELETE_EVENT_MODAL,
  CLOSE_CALENDAR_EVENT_MODAL,
  CLOSE_CALENDAR_EVENT_MODAL_IN_CLICK,
  CLOSE_EDIT_TASK_MODAL,
  CLOSE_TASK_MODAL,
  DELETE_EVENT_ERROR,
  DELETE_EVENT_START,
  DELETE_EVENT_SUCCESS,
  EDIT_EVENT_ERROR,
  EDIT_EVENT_START,
  EDIT_EVENT_SUCCESS,
  GET_EVENTS_ERROR,
  GET_EVENTS_START,
  GET_EVENTS_SUCCESS,
  GET_PERIODS_ERROR,
  GET_PERIODS_START,
  GET_PERIODS_SUCCESS,
  OPEN_ADD_TASK_MODAL,
  OPEN_CALENDAR_DELETE_EVENT_MODAL,
  OPEN_CALENDAR_EVENT_MODAL,
  OPEN_CALENDAR_EVENT_MODAL_IN_CLICK,
  OPEN_EDIT_TASK_MODAL,
  OPEN_TASK_MODAL,
  POST_EVENT_ERROR,
  POST_EVENT_START,
  POST_EVENT_SUCCESS,
} from "./Types";

const initialState = {
  periods: [],
  events: [],
  loading: false,
  error: null,
  addTaskEventModal: false,
  editTaskEventModal: false,
  taskEventModalInClick: false,
  calendarEventModal: false,
  calendarDeleteEventModal: false,
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
      break;
    case GET_PERIODS_SUCCESS:
      return {
        ...state,
        periods: payload.periods,
        loading: false,
        error: null,
      };
      break;

    case GET_PERIODS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
      break;

    case GET_EVENTS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
      break;

    case GET_EVENTS_SUCCESS:
      return {
        ...state,
        events: payload.events,
        loading: false,
        error: null,
      };
      break;

    case GET_EVENTS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
      break;

    case POST_EVENT_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
      break;

    case POST_EVENT_SUCCESS:
      return {
        ...state,
        events: [...state.events, payload.event],
        loading: false,
        error: null,
        addTaskEventModal: false,
        taskEventModalInClick: false,
      };
      break;

    case POST_EVENT_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
      break;

    case EDIT_EVENT_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
      break;

    case EDIT_EVENT_SUCCESS:
      const updatedEvent = payload.event;
      const updatedEvents = state.events.map((event) => {
        if (event.id === updatedEvent.id) {
          return updatedEvent;
        }
        return event;
      });
      return {
        ...state,
        events: updatedEvents,
        loading: false,
        error: null,
        editTaskEventModal: false,
        // calendarEventModal: false,
      };
      break;

    case EDIT_EVENT_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
      break;
    case DELETE_EVENT_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
      break;
    case DELETE_EVENT_SUCCESS:
      const deletedEvent = payload.event;
      return {
        ...state,
        events: state.events.filter((event) => event.id !== deletedEvent.id),
        loading: false,
        error: null,
        calendarEventModal: false,
        calendarDeleteEventModal: false,
      };
    case DELETE_EVENT_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
      break;

    case CHANGE_EVENT_DATE_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
      break;
    case CHANGE_EVENT_DATE_SUCCESS:
      return {
        ...state,
        events: state.events.map((event) => {
          if (event.id === payload.event.id) {
            return payload.event;
          }
          return event;
        }),
        loading: false,
        error: null,
      };
      break;
    case CHANGE_EVENT_DATE_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
      break;
    case OPEN_ADD_TASK_MODAL:
      return { ...state, addTaskEventModal: true };
    case CLOSE_ADD_TASK_MODAL:
      return { ...state, addTaskEventModal: false };
    case OPEN_EDIT_TASK_MODAL:
      return { ...state, editTaskEventModal: true };
    case CLOSE_EDIT_TASK_MODAL:
      return { ...state, editTaskEventModal: false };
    case OPEN_CALENDAR_EVENT_MODAL:
      return { ...state, calendarEventModal: true };
    case CLOSE_CALENDAR_EVENT_MODAL:
      return { ...state, calendarEventModal: false };
    case OPEN_CALENDAR_EVENT_MODAL_IN_CLICK:
      return { ...state, taskEventModalInClick: true };
    case CLOSE_CALENDAR_EVENT_MODAL_IN_CLICK:
      return { ...state, taskEventModalInClick: false };
    case OPEN_CALENDAR_DELETE_EVENT_MODAL:
      return { ...state, calendarDeleteEventModal: true };
    case CLOSE_CALENDAR_DELETE_EVENT_MODAL:
      return { ...state, calendarDeleteEventModal: false };
    default:
      return state;
  }
};
export default dashboardReducer;
