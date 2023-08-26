import Axios from 'axios'

export const fetchingApi = async({ url, authorization, method }) => {
  try {
    const result = await Axios({
      method,
      url,
      headers: {
        Authorization: authorization,
      }
    })
    return result
  } catch (error) {
    throw error
  }
}
