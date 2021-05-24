import axios from 'axios'
import store from '../store'

const ApiService = {

  _401Interceptor: null,

  setTokenHeader(accessToken) {
    return `Bearer ${accessToken}`
  },

  post(resource, data) {
    return axios.post(resource, data)
  },

  get(resource, config = null) {
    return axios.get(resource, config)
  },

  mount401Interceptor() {
    this._401Interceptor = axios.interceptors.response.use(
      (response) => response,
      async (e) => {
        if (e.response && e.response.status === 401) {
          const errorObj = e.response.data.error
          if (errorObj.message.includes("access token")) {
            store.dispatch("home/logOut")
            throw e
          }
        }
        throw e
      }
    )
  },

}

export default ApiService