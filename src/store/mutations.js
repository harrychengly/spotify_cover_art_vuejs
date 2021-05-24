export default {

  setArtists(state, payload) {
    state.artists = payload
  },

  setError(state, payload) {
    state.error = payload
  },

  setUserIsLoggedIn(state) {
    state.userIsLoggedIn = true
  },

  removeUserIsLoggedIn(state) {
    state.userIsLoggedIn = false
  },

  setRetrieveArtistsLoading(state) {
    state.retrieveArtistsLoading = true
  },

  removeRetrieveArtistsLoading(state) {
    state.retrieveArtistsLoading = false
  },

  setChangeCoverLoading(state) {
    state.changeCoverLoading = true
  },

  removeChangeCoverLoading(state) {
    state.changeCoverLoading = false
  },

  setMaxArtistFrequency(state, payload) {
    state.maxArtistFrequency = payload
  }
}