const ACCESS_TOKEN_KEY = 'aToken'
const REFRESH_TOKEN_KEY = 'rToken'

const TokenService = {

  saveAccessToken(accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  },

  saveRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  },

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

}

export default TokenService