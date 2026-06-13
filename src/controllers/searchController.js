const deezerService = require("../services/deezerService");
const { normalizeArtist, normalizeAlbum, normalizeTrack } = require("../services/normalizeDeezer");

const globalSearch = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(200).json([]);
    }

    let results = [];

    switch (type) {
      case "Artista": {
        const data = await deezerService.searchArtists(q, 25, 0);
        results = (data.data || []).map(a => ({
          ...normalizeArtist(a),
          url_portada: a.picture_medium || "",
        }));
        break;
      }
      case "Album": {
        const data = await deezerService.searchAlbums(q, 25, 0);
        results = (data.data || []).map(normalizeAlbum);
        break;
      }
      case "Cancion": {
        const data = await deezerService.searchTracks(q, 25, 0);
        results = (data.data || []).map(normalizeTrack);
        break;
      }
      default: {
        const [artists, albums, tracks] = await Promise.all([
          deezerService.searchArtists(q, 5, 0),
          deezerService.searchAlbums(q, 5, 0),
          deezerService.searchTracks(q, 5, 0),
        ]);
        results = [
          ...(artists.data || []).map(a => ({ ...normalizeArtist(a), url_portada: a.picture_medium || "" })),
          ...(albums.data || []).map(normalizeAlbum),
          ...(tracks.data || []).map(normalizeTrack),
        ];
        break;
      }
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error en la búsqueda", error: error.message });
  }
};

module.exports = { globalSearch };
