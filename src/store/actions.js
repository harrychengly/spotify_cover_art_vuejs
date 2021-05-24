import AuthService from '../services/auth.service'
import SpotifyService from '../services/spotify.service'

export default {

  logOut({ commit }) {
    commit('removeUserIsLoggedIn')
    AuthService.logout()
  },

  setUserIsLoggedIn({ commit }) {
    commit('setUserIsLoggedIn')
  },

  async retrievePlaylistArtists({ commit }, playlistId) {
    commit('setError', null)
    commit('setRetrieveArtistsLoading', true)

    try {
      const records = await SpotifyService.fetchPlaylistTracks(playlistId)

      const artistsCollection = {}

      let maxArtistFrequency = 0

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
          maxArtistFrequency = Math.max(maxArtistFrequency, artistsCollection[artist.name])
        })
      })

      const allArtists = Object.entries(artistsCollection)

      commit('setArtists', allArtists)
      commit('setMaxArtistFrequency', maxArtistFrequency)

      return true
    } catch (error) {
      commit('setError', 'Cannot get playlist. Please try again.')
      return false
    } finally {
      commit('removeRetrieveArtistsLoading', false)
    }
  },

  async changeSpotifyCover({ commit }, { playlistId, image }) {
    commit('setError', null)
    commit('setChangeCoverLoading')

    try {
      await SpotifyService.changeSpotifyCover(playlistId, `${image}`)

      return true
    } catch (error) {
      commit('setError', 'Cannot change playlist cover. Please try again.')
      return false
    } finally {
      commit('removeChangeCoverLoading')
    }
  }
}