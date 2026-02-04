const app = require('express');
const listaController = require('../controllers/listaController');
const { authenticateToken, isAdmin,isAuthor} = require('../middlewares/authMiddleware');
const router = app.Router();

router.post('/', listaController.crearNuevaLista,authenticateToken,isAuthor);
router.delete('/:listaId', listaController.eliminarLista,authenticateToken,isAuthor,isAdmin);
router.post('/:listaId/items', listaController.addItem,authenticateToken,isAuthor,isAdmin);
router.delete('/:listaId/items/:itemId', listaController.removeItem,authenticateToken,isAuthor,isAdmin);


module.exports = router;