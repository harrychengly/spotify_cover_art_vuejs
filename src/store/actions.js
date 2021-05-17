import SpotifyService from '../services/spotify.service'

export default {
  logOut({ commit }) {
    // Remove access token
    commit('removeAccessToken')
    // Remove refresh token
    commit('removeRefreshToken')
  },

  setUserIsLoggedIn({ commit }) {
    commit('setUserIsLoggedIn')
  },

  setTokens({ commit }, { accessToken, refreshToken }) {
    commit('setAccessToken', accessToken)
    commit('setRefreshToken', refreshToken)
  },

  async retrievePlaylistArtists({ commit }, playlistId) {
    commit('setError', null)
    commit('setRetrieveArtistsLoading', true)

    try {
      const records = await SpotifyService.fetchPlaylistTracks(playlistId)

      const artistsCollection = {}

      records.forEach(record => {
        // Get the artists of the track
        const artists = record.track.artists
        // Store the frequency of artists in the playlist
        artists.forEach(artist => {
          if (artist.name in artistsCollection) {
            artistsCollection[artist.name] += 1
          } else {
            artistsCollection[artist.name] = 1
          }
        })
      })

      const allArtists = Object.entries(artistsCollection)

      commit('setArtists', allArtists)

      return true
    } catch (error) {
      console.log(error)
      commit('setError', 'Cannot get playlist. Please try again.')
      return false
    } finally {
      commit('removeRetrieveArtistsLoading', false)
    }
  }
}