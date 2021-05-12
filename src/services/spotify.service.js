import ApiService from './api.service'

const SpotifyService = {

  fetchPlaylistTracks: async function (playlistId) {

    try {
      const res = await ApiService.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`)

      return res.data.items
    } catch (error) {
      throw new Error(error)
    }
  }

}

export default SpotifyService