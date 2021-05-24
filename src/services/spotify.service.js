import ApiService from './api.service'
import TokenService from './token.service'

const SpotifyService = {

  fetchPlaylistTracks: async function (playlistId) {

    const accessToken = TokenService.getAccessToken()

    try {
      const res = await ApiService.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: ApiService.setTokenHeader(accessToken)
        }
      })

      return res.data.items
    } catch (error) {
      throw new Error(error)
    }
  },

}

export default SpotifyService