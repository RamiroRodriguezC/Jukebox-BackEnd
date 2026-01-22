const app = require('express');

const router = app.Router();
const cancionController = require('../controllers/cancionController')
const reviewController = require('../controllers/reviewController');
const {authenticateToken, isAdmin, isSelf} = require("../middlewares/authMiddleware")

router.get('/search', cancionController.searchCanciones); 
router.get("/", cancionController.getAll);
//
// router.put("/:id",cancionController.updateCancion);  
router.get("/:id", cancionController.getById);

router.delete("/:id", authenticateToken, isAdmin, cancionController.softDelete);

// Borrado Físico (Hard Delete) - SOLO ADMIN - SIN IMPLEMENTAR
// Usamos una URL diferente para ser explícitos, por ejemplo '/hard/:id'
/* router.delete("/hard/:id", authenticateToken, isAdmin, cancionController.hardDeleteReview); */

router.get("/reviews/:id", reviewController.getSongReviews); //Para traer las reviews de una cancion

module.exports = router;