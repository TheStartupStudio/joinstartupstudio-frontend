import axiosInstance from '../../utils/AxiosInstance'

const getUserWithId = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`)

  if (response) {
    return response.data
  }
}
const getAllUsers = async () => {
  const response = await axiosInstance.get(`/users`)

  if (response) {
    return response.data
  }
}

export const getStudentInfoByIdAPI = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/student-info/${id}`)
    return response
  } catch (e) {
    throw e?.response
  }
}

const usersService = {
  getAllUsers,
  getUserWithId,
  getStudentInfoByIdAPI
}

export default usersService
