const app = require('express');

const router = app.Router();
const albumController = require('../controllers/albumController');
const {authenticateToken, isAdmin, isSelf} = require("../middlewares/authMiddleware")

router.get("/", albumController.getAll);
router.get("/:id", albumController.getById);
// Borrado Lógico (Soft Delete)
router.delete("/:id", authenticateToken, isAdmin, albumController.softDelete);

// Borrado Físico (Hard Delete) - SOLO ADMIN - SIN IMPLEMENTAR
// Usamos una URL diferente para ser explícitos, por ejemplo '/hard/:id'
/* router.delete("/hard/:id", authenticateToken, isAdmin, albumController.hardDeleteReview); */


module.exports = router;