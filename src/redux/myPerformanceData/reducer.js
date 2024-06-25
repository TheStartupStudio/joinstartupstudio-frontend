import * as types from './types'

const initialState = {
  loading: false,
  sectionOneData: [],
  sectionTwoData: [],
  certification: [],
  instructorDebriefData: [],
  masterclassPercentage: 0,
  podcastPercentage: 0,
  qaPercentage: 0,
  error: null,
  message: '',
  sectionOneLoading: false,
  sectionTwoLoading: false,
  certificationLoading: false,
  instructorDebriefLoading: false,
  masterclassLoading: false,
  podcastLoading: false,
  qaLoading: false
}

const performanceDataReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case types.SET_SECTION_ONE_PENDING:
      return {
        ...state,
        sectionOneLoading: true,
        error: null
      }
    case types.SET_SECTION_ONE_FULFILLED:
      return {
        ...state,
        sectionOneLoading: false,
        sectionOneData: payload,
        error: null
      }
    case types.SET_SECTION_ONE_REJECTED:
      return {
        ...state,
        sectionOneLoading: false,
        sectionOneData: payload,
        error: payload
      }
    case types.SET_INSTRUCTOR_SECTION_ONE_PENDING:
      return {
        ...state,
        sectionOneLoading: true,
        error: null
      }
    case types.SET_INSTRUCTOR_SECTION_ONE_FULFILLED:
      return {
        ...state,
        sectionOneLoading: false,
        sectionOneData: payload,
        error: null
      }
    case types.SET_INSTRUCTOR_SECTION_ONE_REJECTED:
      return {
        ...state,
        sectionOneLoading: false,
        sectionOneData: payload,
        error: payload
      }
    case types.SET_SECTION_TWO_PENDING:
      return {
        ...state,
        sectionTwoLoading: true,
        error: null
      }
    case types.SET_SECTION_TWO_FULFILLED:
      return {
        ...state,
        sectionTwoLoading: false,
        sectionTwoData: payload,
        error: null
      }
    case types.SET_SECTION_TWO_REJECTED:
      return {
        ...state,
        sectionTwoLoading: false,
        sectionTwoData: payload,
        error: payload
      }
    case types.SET_INSTRUCTOR_SECTION_TWO_PENDING:
      return {
        ...state,
        sectionTwoLoading: true,
        error: null
      }
    case types.SET_INSTRUCTOR_SECTION_TWO_FULFILLED:
      return {
        ...state,
        sectionTwoLoading: false,
        sectionTwoData: payload,
        error: null
      }
    case types.SET_INSTRUCTOR_SECTION_TWO_REJECTED:
      return {
        ...state,
        sectionTwoLoading: false,
        sectionTwoData: payload,
        error: payload
      }
    case types.SET_CERTIFICATION_PENDING:
      return {
        ...state,
        certificationLoading: true,
        error: null
      }
    case types.SET_CERTIFICATION_FULFILLED:
      return {
        ...state,
        certificationLoading: false,
        certification: payload,
        error: null
      }
    case types.SET_CERTIFICATION_REJECTED:
      return {
        ...state,
        certificationLoading: false,
        certification: payload,
        error: payload
      }
    case types.SET_INSTRUCTOR_CERTIFICATION_PENDING:
      return {
        ...state,
        certificationLoading: true,
        error: null
      }
    case types.SET_INSTRUCTOR_CERTIFICATION_FULFILLED:
      return {
        ...state,
        certificationLoading: false,
        certification: payload,
        error: null
      }
    case types.SET_INSTRUCTOR_CERTIFICATION_REJECTED:
      return {
        ...state,
        certificationLoading: false,
        certification: payload,
        error: payload
      }
    case types.SET_INSTRUCTOR_DEBRIEF_PENDING:
      return {
        ...state,
        instructorDebriefLoading: true,
        error: null
      }
    case types.SET_INSTRUCTOR_DEBRIEF_FULFILLED:
      return {
        ...state,
        instructorDebriefLoading: false,
        instructorDebriefData: payload,
        error: null
      }
    case types.SET_INSTRUCTOR_DEBRIEF_REJECTED:
      return {
        ...state,
        instructorDebriefLoading: false,
        instructorDebriefData: payload,
        error: payload
      }
    case types.SET_INSTRUCTOR_DEBRIEF_WITH_ID_PENDING:
      return {
        ...state,
        instructorDebriefLoading: true,
        error: null
      }
    case types.SET_INSTRUCTOR_DEBRIEF_WITH_ID_FULFILLED:
      return {
        ...state,
        instructorDebriefLoading: false,
        instructorDebriefData: payload,
        error: null
      }
    case types.SET_INSTRUCTOR_DEBRIEF_WITH_ID_REJECTED:
      return {
        ...state,
        instructorDebriefLoading: false,
        instructorDebriefData: payload,
        error: payload
      }
    case types.SET_MASTERCLASS_PERCENTAGE_PENDING:
      return {
        ...state,
        masterclassLoading: true,
        error: null
      }
    case types.SET_MASTERCLASS_PERCENTAGE_FULFILLED:
      return {
        ...state,
        masterclassLoading: false,
        masterclassPercentage: payload,
        error: null
      }
    case types.SET_MASTERCLASS_PERCENTAGE_REJECTED:
      return {
        ...state,
        masterclassLoading: false,
        masterclassPercentage: payload,
        error: payload
      }
    case types.SET_INSTRUCTOR_MASTERCLASS_PERCENTAGE_PENDING:
      return {
        ...state,
        masterclassLoading: true,
        error: null
      }
    case types.SET_INSTRUCTOR_MASTERCLASS_PERCENTAGE_FULFILLED:
      return {
        ...state,
        masterclassLoading: false,
        masterclassPercentage: payload,
        error: null
      }
    case types.SET_INSTRUCTOR_MASTERCLASS_PERCENTAGE_REJECTED:
      return {
        ...state,
        masterclassLoading: false,
        masterclassPercentage: payload,
        error: payload
      }
    case types.SET_PODCAST_PERCENTAGE_PENDING:
      return {
        ...state,
        podcastLoading: true,
        error: null
      }
    case types.SET_PODCAST_PERCENTAGE_FULFILLED:
      return {
        ...state,
        podcastLoading: false,
        podcastPercentage: payload,
        error: null
      }
    case types.SET_PODCAST_PERCENTAGE_REJECTED:
      return {
        ...state,
        podcastLoading: false,
        podcastPercentage: payload,
        error: payload
      }
    case types.SET_INSTRUCTOR_PODCAST_PERCENTAGE_PENDING:
      return {
        ...state,
        podcastLoading: true,
        error: null
      }
    case types.SET_INSTRUCTOR_PODCAST_PERCENTAGE_FULFILLED:
      return {
        ...state,
        podcastLoading: false,
        podcastPercentage: payload,
        error: null
      }
    case types.SET_INSTRUCTOR_PODCAST_PERCENTAGE_REJECTED:
      return {
        ...state,
        podcastLoading: false,
        podcastPercentage: payload,
        error: payload
      }
    case types.SET_QA_PERCENTAGE_PENDING:
      return {
        ...state,
        qaLoading: true,
        error: null
      }
    case types.SET_QA_PERCENTAGE_FULFILLED:
      return {
        ...state,
        qaLoading: false,
        qaPercentage: payload,
        error: null
      }
    case types.SET_QA_PERCENTAGE_REJECTED:
      return {
        ...state,
        qaLoading: false,
        qaPercentage: payload,
        error: payload
      }
    case types.SET_INSTRUCTOR_QA_PERCENTAGE_PENDING:
      return {
        ...state,
        qaLoading: true,
        error: null
      }
    case types.SET_INSTRUCTOR_QA_PERCENTAGE_FULFILLED:
      return {
        ...state,
        qaLoading: false,
        qaPercentage: payload,
        error: null
      }
    case types.SET_INSTRUCTOR_QA_PERCENTAGE_REJECTED:
      return {
        ...state,
        qaLoading: false,
        qaPercentage: payload,
        error: payload
      }
    default:
      return state
  }
}

export default performanceDataReducer
