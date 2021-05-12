import axios from 'axios'

const ApiService = {

  setTokenHeader(accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  },

  removeTokenHeader() {
    axios.defaults.headers.common.Authorization = ""
  },

  post(resource, data) {
    return axios.post(resource, data)
  },

  get(resource, params = null) {
    return axios.get(resource, { params })
  }

}

export default ApiService