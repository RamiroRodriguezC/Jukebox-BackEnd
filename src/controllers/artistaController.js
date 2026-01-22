const artistaService = require("../services/artistaService");


async function getAll(req, res) {
  try {
      // 1. Leemos los parámetros de paginación desde la URL (query string)
      // Ej: /reviews?limit=10&cursor=a1b2c3d4
      const options = {
        limit: req.query.limit,
        cursor: req.query.cursor
      };
      const artistas = await artistaService.getAllArtistas(options);
      res.json(artistas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener Artistas" });
  }
};

async function getById(req, res) {
  const id = req.params.id;
  try {
    const artistas = await artistaService.getArtistaById(id);
    res.json(artistas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el artista" });
  }
};


// Borrado Lógico (Soft Delete)
/* async function softDelete(req, res) {
  try {
    const id = req.params.id;
    // Llamamos al servicio SIN opciones (por defecto es soft delete)
    const result = await artistaService.deleteArtista(id);

    if (result.artistas === 0) {
        return res.status(404).json({ message: "Artista no encontrado o ya eliminada." });
    }

    res.status(200).json({
        message: "Artista eliminado lógicamente.",
        report: result
    });
  } catch (err) {
    console.error("Error en softDelete (Artista):", err);
    res.status(500).json({ error: "Error interno al eliminar al artista." });
  }
} 
*/

module.exports = {
  getAll,
  getById,
  //softDelete,
};