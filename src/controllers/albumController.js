const deezerService = require("../services/deezerService");
const { normalizeAlbumWithTracks, normalizeAlbumList } = require("../services/normalizeDeezer");

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
    res.json(normalizeAlbumWithTracks(album, tracks));
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el álbum" });
  }
}

module.exports = {
  search,
  getById,
};
