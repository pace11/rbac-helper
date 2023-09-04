import Axios from 'axios'

/**
 *
 * @param {String} url
 * @param {String} authorization
 * @param {String} method
 * @returns {Promise}
 */
export const fetchingApi = async ({ url, authorization, method }) => {
  try {
    const result = await Axios({
      method,
      url,
      headers: {
        Authorization: `Bearer ${authorization}`,
        'X-Client-Id': 'ESTUARI',
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {Object[]} data
 * @returns {[]}
 */
export const mappingSubject = (data) => {
  const final = []
  for (const index in data) {
    if (final.length === 0) final.push(data[index]?.subject)
    if (!final.includes(data[index]?.subject)) final.push(data[index]?.subject)
  }
  return final
}
