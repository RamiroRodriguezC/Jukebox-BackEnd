const app = require('express');

const router = app.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, isAdmin,isAuthor} = require('../middlewares/authMiddleware');

router.get("/" , reviewController.getAll); 
router.post("/create" ,authenticateToken ,reviewController.createReview);  
router.put("/:id" ,authenticateToken,isAuthor,reviewController.updateReview);  // QUE EL UPDATE SE HAGA SOBRE EL MISMO USUARIO QUE ESTA PIDIENDO ESE UPDATE O QUE LO HAGA UN ADMIN
router.delete("/:id", authenticateToken, isAdmin, reviewController.softDelete);

// Borrado Físico (Hard Delete) - SOLO ADMIN - SIN IMPLEMENTAR
// Usamos una URL diferente para ser explícitos, por ejemplo '/hard/:id'
/* router.delete("/hard/:id", authenticateToken, isAdmin, reviewController.hardDeleteReview); */

router.get("/:id", reviewController.getById); 



module.exports = router;