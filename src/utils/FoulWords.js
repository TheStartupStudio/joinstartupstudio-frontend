import axiosInstance from './AxiosInstance'
import parse from 'html-react-parser'

class FoulWords {
  static async register(userId, foulWords, module) {
    await axiosInstance.post('/foul-words', {
      ...foulWords,
      userId: userId,
      page: window.location.pathname,
      module: module
    })
  }

  static printMessage(foulWords) {
    const uniqueFoulWords = [...new Set(foulWords.foulWords)]

    const message =
      uniqueFoulWords.length > 1
        ? parse(
            `We have detected these possibly inappropriate words: <i> <u> ${uniqueFoulWords.toString()} </u> </i> in your writing, please revise your text before submitting. Your account can be suspended if inappropriate words are used. Contact us if you have any questions!`
          )
        : parse(
            `We have detected this possibly inappropriate word: <i> <u> ${uniqueFoulWords.toString()} </u> </i> in your writing, please revise your text before submitting. Your account can be suspended if inappropriate words are used. Contact us if you have any questions!`
          )

    return message
  }
}

export default FoulWords
