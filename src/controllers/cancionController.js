const deezerService = require("../services/deezerService");

async function search(req, res) {
  try {
    const { q, limit, index } = req.query;
    if (!q) return res.status(200).json({ data: [] });
    const result = await deezerService.searchTracks(q, parseInt(limit) || 25, parseInt(index) || 0);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar canciones en Deezer" });
  }
}

async function getById(req, res) {
  try {
    const result = await deezerService.getTrack(req.params.deezerId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la canción" });
  }
}

module.exports = {
  search,
  getById,
};
