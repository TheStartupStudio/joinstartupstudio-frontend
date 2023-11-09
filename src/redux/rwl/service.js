import axiosInstance from '../../utils/AxiosInstance'

const fetchAllItems = async () => {
  try {
    const response = await axiosInstance.get('/rwl/items')

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch items')
    }
  } catch (error) {
    throw error
  }
}

const fetchAllUserSelections = async () => {
  try {
    const response = await axiosInstance.get('/rwl/userSelections')

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch user selections')
    }
  } catch (error) {
    throw error
  }
}

const fetchUserSelectionsByCategory = async (categoryID) => {
  try {
    const response = await axiosInstance.get(
      `/rwl/userSelections/category/${categoryID}`
    )
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch user selections with category id')
    }
  } catch (error) {
    throw error
  }
}

const addUserSelection = async (itemID) => {
  try {
    const response = await axiosInstance.post(`/rwl/userSelections/${itemID}`)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to create user selection')
    }
  } catch (error) {
    throw error
  }
}
const removeUserSelection = async (itemID) => {
  try {
    const response = await axiosInstance.delete(`/rwl/userSelections/${itemID}`)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to delete user selection')
    }
  } catch (error) {
    throw error
  }
}

const userSelectionIsCheckedToggle = async (itemID) => {
  try {
    const response = await axiosInstance.patch(`/rwl/userSelections/${itemID}`)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to update user selection')
    }
  } catch (error) {
    throw error
  }
}

const createUserArticle = async (itemID, content) => {
  try {
    const response = await axiosInstance.post(`/rwl/userArticles/${itemID}`, {
      content: content
    })

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to update user selection')
    }
  } catch (error) {
    throw error
  }
}
const fetchArticleData = async (studentID,itemID) => {
  try {
    const response = await axiosInstance.get(`/rwl/userArticles/user/${studentID}/${itemID}`)

    if (response.status === 200) {
      return response
    } else {
      throw new Error('Failed to fetch article')
    }
  } catch (error) {
    throw error
  }
}

const updateUserArticle = async (id, content) => {
  try {
    const response = await axiosInstance.patch(`/rwl/userArticles/${id}`, {
      content: content
    })

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to fetch article')
    }
  } catch (error) {
    throw error
  }
}

const rwlService = {
  fetchAllItems,
  fetchAllUserSelections,
  fetchUserSelectionsByCategory,
  addUserSelection,
  removeUserSelection,
  userSelectionIsCheckedToggle,
  createUserArticle,
  fetchArticleData,
  updateUserArticle
}

export default rwlService
