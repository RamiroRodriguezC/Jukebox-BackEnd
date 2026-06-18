const deezerService = require("../services/deezerService");
const { normalizeAlbumWithTracks, normalizeAlbumList } = require("../services/normalizeDeezer");
const { getAverageRating } = require("../services/ratingService");

async function search(req, res) {
  try {
    const { q, limit, index } = req.query;
    if (!q) return res.status(200).json({ data: [] });
    const result = await deezerService.searchAlbums(q, parseInt(limit) || 25, parseInt(index) || 0);
    res.json(normalizeAlbumList(result));
  } catch (err) {
    res.status(500).json({ error: "Error al buscar álbumes en Deezer" });
  }
}

async function getById(req, res) {
  try {
    const album = await deezerService.getAlbum(req.params.deezerId);
    const tracks = await deezerService.getAlbumTracks(req.params.deezerId);
    const result = normalizeAlbumWithTracks(album, tracks);
    const rating = await getAverageRating(req.params.deezerId, "Album");
    result.promedioRating = rating.promedio;
    result.cantReseñas = rating.cantidad;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el álbum" });
  }
}

module.exports = {
  search,
  getById,
};
