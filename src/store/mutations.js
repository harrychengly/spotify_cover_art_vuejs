export default {
  setAccessToken(state, payload) {
    state.accessToken = payload
  },

  setRefreshToken(state, payload) {
    state.refreshToken = payload
  },

  setArtists(state, payload) {
    state.artists = payload
  },

  setError(state, payload) {
    state.error = payload
  },

  removeAccessToken(state) {
    state.accessToken = null
  },

  removeRefreshToken(state) {
    state.refreshToken = null
  },

  setUserIsLoggedIn(state) {
    state.userIsLoggedIn = true
  },

  setRetrieveArtistsLoading(state) {
    state.retrieveArtistsLoading = true
  },

  removeRetrieveArtistsLoading(state) {
    state.retrieveArtistsLoading = false
  },

  setMaxArtistFrequency(state, payload) {
    state.maxArtistFrequency = payload
  }
}