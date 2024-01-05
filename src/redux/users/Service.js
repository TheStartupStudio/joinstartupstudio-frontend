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

const usersService = {
  getAllUsers,
  getUserWithId
}

export default usersService
