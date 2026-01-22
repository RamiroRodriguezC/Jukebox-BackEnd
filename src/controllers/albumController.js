// 💡 Importamos el MÓDULO DE SERVICIOS en lugar del Modelo
const albumService = require("../services/albumService");

async function getAll(req, res) {
    try {
        // 1. Leemos los parámetros de paginación desde la URL (query string)
        // Ej: /reviews?limit=10&cursor=a1b2c3d4
        const options = {
          limit: req.query.limit,
          cursor: req.query.cursor
        };
        const albums = await albumService.getAllAlbums(options);
        res.json(albums); 
    } catch (err) {
        // 3. Maneja el error HTTP (500 Internal Server Error)
        console.error("Error al obtener álbumes:", err); 
        res.status(500).json({ 
            error: "Error interno del servidor al obtener Albums" 
        });
    }
};

async function getById(req, res) {
  try {
    const id = req.params.id;
    const albums = await albumService.getAlbumById(id); 
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el album" });
  }
};

// Borrado Lógico (Soft Delete)
async function softDelete(req, res) {
  try {
    const id = req.params.id;
    // Llamamos al servicio SIN opciones (por defecto es soft delete)
    const result = await albumService.deleteAlbum(id);

    if (result.albums === 0) {
        return res.status(404).json({ message: "Album no encontrado o ya eliminado." });
    }

    res.status(200).json({
        message: "Album eliminado lógicamente.",
        report: result
    });
  } catch (err) {
    console.error("Error en softDelete (Album):", err);
    res.status(500).json({ error: "Error interno al eliminar al album." });
  }
}

module.exports = {
    getAll,
    getById,
    softDelete,
};