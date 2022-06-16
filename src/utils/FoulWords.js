import axiosInstance from './AxiosInstance'

class FoulWords {
  static async register(userId, foulWords, module) {
    await axiosInstance.post('/foul-words', {
      ...foulWords,
      userId: userId,
      page: window.location.pathname,
      module: module
    })
  }
}

export default FoulWords
