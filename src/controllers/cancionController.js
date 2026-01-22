const cancionService = require("../services/cancionService");

async function getAll(req, res) {
  try {
    // 1. Leemos los parámetros de paginación desde la URL (query string)
    // Ej: /reviews?limit=10&cursor=a1b2c3d4
    const options = {
      limit: req.query.limit,
      cursor: req.query.cursor
    };

    const canciones = await cancionService.getAllCanciones(options);
    res.json(canciones);
  } catch (err) {
        console.error("Error en la consulta de Canciones:", err); 
    res.status(500).json({ error: err.message });
  }
};

async function getById(req, res) {
  const id = req.params.id;
  try {
    const canciones = await cancionService.getCancionById(id);
    res.status(200).json(canciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function searchCanciones(req, res){
    const busqueda = req.query.q; 
    
    // El Controller maneja los errores de la petición HTTP y llama al Service
    try {
        // Lógica de Negocio: Llama al Service con el dato de la petición
        const resultados = await cancionService.buscarCanciones(busqueda);

        // Respuesta HTTP
        res.status(200).json(resultados);

    } catch (error) {
        // Si el Service lanzó un error (ej: fallo de DB), el Controller responde con 500
        console.error("Error en el controller de búsqueda:", error.message);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

/* async function updateCancion(req,res){
    const cancionActualizada = await cancionService.updateCancion(req.params.id, req.body);
    res.status(200).json(cancionActualizada);
} */

// Borrado Lógico (Soft Delete)
async function softDelete(req, res) {
  try {
    const id = req.params.id;
    // Llamamos al servicio SIN opciones (por defecto es soft delete)
    const result = await cancionService.deleteCancion(id);

    if (result.canciones === 0) {
        return res.status(404).json({ message: "Cancion no encontrada o ya eliminada." });
    }

    res.status(200).json({
        message: "Cancion eliminada lógicamente.",
        report: result
    });
  } catch (err) {
    console.error("Error en softDelete (Cancion):", err);
    res.status(500).json({ error: "Error interno al eliminar la cancion." });
  }
}

module.exports = {
    getAll,
    getById,
    searchCanciones,
    //updateCancion,
    softDelete,
};