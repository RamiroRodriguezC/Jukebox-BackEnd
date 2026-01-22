const app = require('express');

const router = app.Router();
const artistaController = require('../controllers/artistaController');
const {authenticateToken, isAdmin, isSelf} = require("../middlewares/authMiddleware")

router.get("/", artistaController.getAll);
router.get("/:id", artistaController.getById);
//router.delete("/:id", authenticateToken, isAdmin, artistaController.softDelete);

// Borrado Físico (Hard Delete) - SOLO ADMIN - SIN IMPLEMENTAR
// Usamos una URL diferente para ser explícitos, por ejemplo '/hard/:id'
/* router.delete("/hard/:id", authenticateToken, isAdmin, artistaController.hardDeleteReview); */


module.exports = router;