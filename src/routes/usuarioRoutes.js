const app = require('express');

const router = app.Router();
const usuarioController = require('../controllers/usuarioController')
const {authenticateToken, isAdmin, isSelf} = require("../middlewares/authMiddleware")

router.post("/create", usuarioController.createUsuario);
router.post("/login", usuarioController.login);

// --- Rutas de GET (De más específicas a más genéricas) ---

// GET / (raíz, específica)
router.get("/", authenticateToken, isAdmin, usuarioController.getAll);

// GET /mail/:mail (ruta específica de búsqueda)
// Esta DEBE ir ANTES de /:id para que Express no confunda "mail" con un "id".
// router.get("/mail/:mail", authenticateToken, isAdmin, usuarioController.getByEmail);

// GET /:id (ruta genérica de ID)
// Esta siempre va después de otras rutas GET más específicas.
router.get("/:id", usuarioController.getById);

// --- Rutas de POST (con parámetros) ---
router.post("/:id/favorito/:idCancion", authenticateToken, isSelf, usuarioController.addCancionAFavorito);

// --- Rutas de PUT ---
router.put("/:id", authenticateToken, isSelf, usuarioController.updateUsuario);

// --- Rutas de DELETE (De más específicas a más genéricas) ---
router.delete("/:id/favorito/:idCancion", authenticateToken, isSelf, usuarioController.deleteCancionEnFavorito);
router.delete("/:id", authenticateToken, isAdmin, usuarioController.softDelete);

// Borrado Físico (Hard Delete) - SOLO ADMIN - SIN IMPLEMENTAR
// Usamos una URL diferente para ser explícitos, por ejemplo '/hard/:id'
/* router.delete("/hard/:id", authenticateToken, isAdmin, usuarioController.hardDeleteReview); */


module.exports = router;
