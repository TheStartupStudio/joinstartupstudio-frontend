import * as types from './types'

const initialState = {
  loading: false,
  masterclassVideos: [],
  podcastVideos: [],
  proficientSkills: [],
  ltsJournals: [],
  iamr: [],
  sprints: [],
  feedbacks: 0,
  mentorMeetings: 0,
  portfolio: [],
  error: null,
  message: ''
}

const platformBadgesReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case types.FETCH_WATCHED_MASTERCLASS_VIDEOS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_WATCHED_MASTERCLASS_VIDEOS_FULFILLED:
      return {
        ...state,
        loading: false,
        masterclassVideos: payload,
        error: null
      }
    case types.FETCH_WATCHED_MASTERCLASS_VIDEOS_REJECTED:
      return {
        ...state,
        loading: false,
        masterclassVideos: payload,
        error: payload
      }
    case types.FETCH_WATCHED_PODCAST_VIDEOS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_WATCHED_PODCAST_VIDEOS_FULFILLED:
      return {
        ...state,
        loading: false,
        podcastVideos: payload,
        error: null
      }
    case types.FETCH_WATCHED_PODCAST_VIDEOS_REJECTED:
      return {
        ...state,
        loading: false,
        podcastVideos: payload,
        error: payload
      }
    case types.CREATE_WATCHED_MASTERCLASS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.CREATE_WATCHED_MASTERCLASS_FULFILLED:
      return {
        ...state,
        loading: false,
        masterclassVideos: [...state.masterclassVideos, payload],
        error: null
      }
    case types.CREATE_WATCHED_MASTERCLASS_REJECTED:
      return {
        ...state,
        loading: false,
        masterclassVideos: payload,
        error: payload
      }
    case types.CREATE_WATCHED_PODCAST_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.CREATE_WATCHED_PODCAST_FULFILLED:
      return {
        ...state,
        loading: false,
        podcastVideos: [...state.podcastVideos, payload],
        error: null
      }
    case types.CREATE_WATCHED_PODCAST_REJECTED:
      return {
        ...state,
        loading: false,
        podcastVideos: payload,
        error: payload
      }
    case types.FETCH_PROFFICIENT_IAMR_SKILL_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_PROFFICIENT_IAMR_SKILL_FULFILLED:
      return {
        ...state,
        loading: false,
        proficientSkills: payload,
        error: null
      }
    case types.FETCH_PROFFICIENT_IAMR_SKILL_REJECTED:
      return {
        ...state,
        loading: false,
        proficientSkills: payload,
        error: payload
      }
    case types.FETCH_COMPLETED_JOURNALS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_COMPLETED_JOURNALS_FULFILLED:
      return {
        ...state,
        loading: false,
        ltsJournals: payload,
        error: null
      }
    case types.FETCH_COMPLETED_JOURNALS_REJECTED:
      return {
        ...state,
        loading: false,
        ltsJournals: payload,
        error: payload
      }
    case types.FETCH_COMPLETED_SPRINTS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_COMPLETED_SPRINTS_FULFILLED:
      return {
        ...state,
        loading: false,
        sprints: payload,
        error: null
      }
    case types.FETCH_COMPLETED_SPRINTS_REJECTED:
      return {
        ...state,
        loading: false,
        sprints: payload,
        error: payload
      }
    case types.FETCH_COMPLETED_FEEDBACKS_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_COMPLETED_FEEDBACKS_FULFILLED:
      return {
        ...state,
        loading: false,
        feedbacks: payload,
        error: null
      }
    case types.FETCH_COMPLETED_FEEDBACKS_REJECTED:
      return {
        ...state,
        loading: false,
        feedbacks: payload,
        error: payload
      }
    case types.FETCH_COMPLETED_MENTOR_MEETING_PENDING:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_COMPLETED_MENTOR_MEETING_FULFILLED:
      return {
        ...state,
        loading: false,
        mentorMeetings: payload,
        error: null
      }
    case types.FETCH_COMPLETED_MENTOR_MEETING_REJECTED:
      return {
        ...state,
        loading: false,
        mentorMeetings: payload,
        error: payload
      }
    case types.FETCH_COMPLETED_PORTFOLIO_CONTENT_PENDING:
      return {
        ...state,
        loading: true,

        error: null
      }
    case types.FETCH_COMPLETED_PORTFOLIO_CONTENT_FULFILLED:
      return {
        ...state,
        loading: false,
        portfolio: payload,
        error: null
      }
    case types.FETCH_COMPLETED_PORTFOLIO_CONTENT_REJECTED:
      return {
        ...state,
        loading: false,
        portfolio: payload,
        error: payload
      }
    default:
      return state
  }
}

export default platformBadgesReducer