const app = require('express');
const listaController = require('../controllers/listaController');
const { authenticateToken, isAdmin,isAuthor} = require('../middlewares/authMiddleware');
const router = app.Router();

const Lista = require('../models/listaModel');

// Esto crea la función que valida si el user es dueño de UNA LISTA
const esAutorDeLista = isAuthor(Lista);

router.post('/create', authenticateToken,listaController.crearNuevaLista);
router.post('/:id/addItem', authenticateToken,esAutorDeLista,listaController.addItem);
router.delete('/:id/items/:itemId', authenticateToken,esAutorDeLista,listaController.removeItem);
router.delete('/:id', authenticateToken,esAutorDeLista,listaController.eliminarLista);



module.exports = router;