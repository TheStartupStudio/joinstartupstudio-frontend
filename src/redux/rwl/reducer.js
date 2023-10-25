import * as types from './types'

const inititalState = {
  loading: false,
  items: [],
  userSelections: [],
  userArticles: {},
  error: false,
  message: ''
}

const rwlJournalReducer = (state = inititalState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.FETCH_ITEMS_PENDING:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case types.FETCH_ITEMS_FULFILLED:
      return {
        ...state,
        items: payload,
        isLoading: false,
        error: null
      }
    case types.FETCH_ITEMS_REJECTED:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case types.FETCH_USER_SELECTIONS_PENDING:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case types.FETCH_USER_SELECTIONS_FULFILLED:
      return {
        ...state,
        isLoading: false,
        userSelections: payload,
        error: null
      }
    case types.FETCH_USER_SELECTIONS_REJECTED:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case types.ADD_SELECTION:
      return {
        ...state,
        userSelections: [...state.userSelections, payload]
      }
    case types.REMOVE_SELECTION:
      const updatedUserSelections = state.userSelections.filter(
        (item) => item.itemID !== action.payload
      )
      return {
        ...state,
        userSelections: updatedUserSelections
      }
    case types.USER_SELECTION_ISCHECKED_TOGGLE:
      const itemID = action.payload
      const userSelectionsUpdated = state.userSelections.map((selection) => {
        if (selection.itemID === itemID) {
          return {
            ...selection,
            isChecked: !selection.isChecked
          }
        }
        return selection
      })

      return {
        ...state,
        userSelections: userSelectionsUpdated
      }

    case types.CREATE_USER_SELECTION_ARTICLE:
      return {
        ...state,
        userArticles: [...state.userArticles, payload]
      }
    case types.GET_USER_ARTICLE:
      return {
        ...state,
        userArticles: action.payload
      }

    case types.UPDATE_USER_ARTICLE:
      const { articleID, updatedContent } = action.payload

      if (articleID === state.userArticles.id) {
        return {
          ...state,
          userArticles: {
            ...state.userArticles,
            content: updatedContent
          }
        }
      }

      return state
    case types.ARTICLE_NOT_FOUND:
      return {
        ...state,
        message: action.payload
      }
    default:
      return state
  }
}

export default rwlJournalReducer
