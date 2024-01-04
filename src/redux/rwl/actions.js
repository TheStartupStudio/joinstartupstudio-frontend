import * as types from './types'
import rwlService from './service'

export const fetchAllItems = () => {
  return async (dispatch) => {
    try {
      const data = await rwlService.fetchAllItems()
      dispatch(fetchAllItemsFulfilled(data))
    } catch (error) {
      dispatch(fetchAllItemsRejected(error))
    }
  }
}

export const fetchAllUserSelections = () => {
  return async (dispatch) => {
    try {
      const data = await rwlService.fetchAllUserSelections()
      dispatch(fetchAllUserSelectionsFulfilled(data))
    } catch (error) {
      dispatch(fetchAllUserSelectionsRejected(error))
    }
  }
}

export const addUserSelection = (itemID) => {
  return async (dispatch) => {
    try {
      const data = await rwlService.addUserSelection(itemID)
      dispatch(addSelection(data))
      await dispatch(fetchAllUserSelections())
    } catch (error) {
      throw error
    }
  }
}

export const removeUserSelection = (itemID) => {
  return async (dispatch) => {
    try {
      await rwlService.removeUserSelection(itemID)

      dispatch(removeSelection(itemID))
      await dispatch(fetchAllUserSelections())
    } catch (error) {
      throw error
    }
  }
}

export const userSelectionIsCheckedToggle = (itemID) => {
  return async (dispatch) => {
    try {
      await rwlService.userSelectionIsCheckedToggle(itemID)

      dispatch(userSelectionIsCheckedToggleAction(itemID))
      await dispatch(fetchAllUserSelections())
    } catch (error) {
      throw error
    }
  }
}

export const createUserArticle = (itemID, content) => {
  return async (dispatch) => {
    try {
      const data = await rwlService.createUserArticle(itemID, content)
      dispatch(createUserArticleAction(data))
    } catch (error) {
      throw error
    }
  }
}
export const getUserArticle = (studentID,itemID) => {
  return async (dispatch) => {
    try {
      const data = await rwlService.fetchArticleData(studentID,itemID)
      dispatch(getUserArticleAction(data.data))
      return data
    } catch (error) {
      throw error
    }
  }
}

export const updateUserArticle = (itemID, content) => {
  return async (dispatch) => {
    try {
      const data = await rwlService.updateUserArticle(itemID, content)
      await dispatch(updateUserArticleAction(data))
    } catch (error) {
      if (error.response && error.response.status === 404) {
        dispatch(articleNotFoundAction('Article not found for this ID.'))
      } else {
        throw error
      }
    }
  }
}
export const articleNotFoundAction = (message) => ({
  type: types.ARTICLE_NOT_FOUND,
  message
})
export const updateUserArticleAction = (payload) => {
  return { type: types.UPDATE_USER_ARTICLE, payload }
}
export const getUserArticleAction = (payload) => {
  return { type: types.GET_USER_ARTICLE, payload }
}

export const createUserArticleAction = (payload) => {
  return { type: types.CREATE_USER_SELECTION_ARTICLE, payload }
}
export function fetchAllItemsFulfilled(payload) {
  return { type: types.FETCH_ITEMS_FULFILLED, payload }
}
export function fetchAllItemsRejected(error) {
  return { type: types.FETCH_ITEMS_REJECTED, error }
}
export function addSelection(payload) {
  return { type: types.ADD_SELECTION, payload }
}
export function userSelectionIsCheckedToggleAction(payload) {
  return { type: types.USER_SELECTION_ISCHECKED_TOGGLE, payload }
}
export function removeSelection(payload) {
  return { type: types.REMOVE_SELECTION, payload }
}
export function fetchAllUserSelectionsFulfilled(payload) {
  return { type: types.FETCH_USER_SELECTIONS_FULFILLED, payload }
}
export function fetchAllUserSelectionsRejected(error) {
  return { type: types.FETCH_USER_SELECTIONS_REJECTED, error }
}
