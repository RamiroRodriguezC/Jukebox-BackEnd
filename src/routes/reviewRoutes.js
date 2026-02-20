const app = require('express');

const router = app.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, isAdmin,isAuthor, isAdminOrReviewOwner} = require('../middlewares/authMiddleware');

const Review = require('../models/reviewModel');

router.get("/" , reviewController.getAll); 
router.post("/create" ,authenticateToken ,reviewController.createReview);  
router.put("/:id" ,authenticateToken, isAdminOrReviewOwner, reviewController.updateReview);  // QUE EL UPDATE SE HAGA SOBRE EL MISMO USUARIO QUE ESTA PIDIENDO ESE UPDATE O QUE LO HAGA UN ADMIN
router.delete("/:id", authenticateToken, isAdminOrReviewOwner, reviewController.softDelete);
router.get("/:entityType/:id", reviewController.getReviewsByEntity); //Para traer las reviews de una cancion

// Borrado Físico (Hard Delete) - SOLO ADMIN - SIN IMPLEMENTAR
// Usamos una URL diferente para ser explícitos, por ejemplo '/hard/:id'
/* router.delete("/hard/:id", authenticateToken, isAdmin, reviewController.hardDeleteReview); */

router.get("/:id", reviewController.getById); 



module.exports = router;