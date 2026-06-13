const deezerService = require("../services/deezerService");

async function getChart(req, res) {
  try {
    const top = parseInt(req.query.top) || 6;

    const chart = await deezerService.getGlobalChart();

    res.json({
      artists: (chart.artists?.data || []).slice(0, top).map(a => ({
        _id: a.id,
        nombre: a.name,
        url_foto: a.picture_medium || "",
        pais: a.country || "",
      })),
      albums: (chart.albums?.data || []).slice(0, top).map(a => ({
        _id: a.id,
        titulo: a.title,
        url_portada: a.cover_medium || "",
        anio: a.release_date ? a.release_date.split("-")[0] : "",
        autores: a.artist ? [{ nombre: a.artist.name }] : [],
      })),
      tracks: (chart.tracks?.data || []).slice(0, top).map(t => ({
        _id: t.id,
        titulo: t.title,
        duracion: t.duration,
        preview: t.preview || "",
        autor_nombre: t.artist?.name || "",
        album_titulo: t.album?.title || "",
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el chart de Deezer" });
  }
}

module.exports = { getChart };
