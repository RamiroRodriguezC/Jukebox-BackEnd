const deezerService = require("../services/deezerService");
const { normalizeArtistList, normalizeAlbumList, normalizeTrackList } = require("../services/normalizeDeezer");

const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(200).json({ artists: [], albums: [], tracks: [] });
    }

    const [artists, albums, tracks] = await Promise.all([
      deezerService.searchArtists(q, 5, 0),
      deezerService.searchAlbums(q, 5, 0),
      deezerService.searchTracks(q, 5, 0),
    ]);

    res.status(200).json({
      artists: normalizeArtistList(artists),
      albums: normalizeAlbumList(albums),
      tracks: normalizeTrackList(tracks),
    });
  } catch (error) {
    res.status(500).json({ message: "Error en la búsqueda", error: error.message });
  }
};

module.exports = { globalSearch };
