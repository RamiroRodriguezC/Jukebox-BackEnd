const deezerService = require("../services/deezerService");
const { normalizeTrack, normalizeTrackList } = require("../services/normalizeDeezer");
const { getAverageRating } = require("../services/ratingService");

async function search(req, res) {
  try {
    const { q, limit, index } = req.query;
    if (!q) return res.status(200).json({ data: [] });
    const result = await deezerService.searchTracks(q, parseInt(limit) || 25, parseInt(index) || 0);
    res.json(normalizeTrackList(result));
  } catch (err) {
    res.status(500).json({ error: "Error al buscar canciones en Deezer" });
  }
}

async function getById(req, res) {
  try {
    const result = await deezerService.getTrack(req.params.deezerId);
    const normalized = normalizeTrack(result);
    const rating = await getAverageRating(req.params.deezerId, "Cancion");
    normalized.promedioRating = rating.promedio;
    normalized.cantReseñas = rating.cantidad;
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la canción" });
  }
}

module.exports = {
  search,
  getById,
};
