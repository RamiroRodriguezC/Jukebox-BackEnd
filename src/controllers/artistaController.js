const deezerService = require("../services/deezerService");
const { normalizeArtist, normalizeAlbumList, normalizeTrackList } = require("../services/normalizeDeezer");

async function search(req, res) {
  try {
    const { q, limit, index } = req.query;
    if (!q) return res.status(200).json({ data: [] });
    const result = await deezerService.searchArtists(q, parseInt(limit) || 25, parseInt(index) || 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar artistas en Deezer" });
  }
}

async function getById(req, res) {
  try {
    const result = await deezerService.getArtist(req.params.deezerId);
    res.json(normalizeArtist(result));
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el artista" });
  }
}

async function getAlbums(req, res) {
  try {
    const { limit, index } = req.query;
    const result = await deezerService.getArtistAlbums(
      req.params.deezerId,
      parseInt(limit) || 50,
      parseInt(index) || 0
    );
    res.json(normalizeAlbumList(result));
  } catch (err) {
    res.status(500).json({ error: "Error al obtener álbumes del artista" });
  }
}

async function getTopTracks(req, res) {
  try {
    const { limit, index } = req.query;
    const result = await deezerService.getArtistTopTracks(
      req.params.deezerId,
      parseInt(limit) || 50,
      parseInt(index) || 0
    );
    res.json(normalizeTrackList(result));
  } catch (err) {
    res.status(500).json({ error: "Error al obtener top canciones del artista" });
  }
}

module.exports = {
  search,
  getById,
  getAlbums,
  getTopTracks,
};
