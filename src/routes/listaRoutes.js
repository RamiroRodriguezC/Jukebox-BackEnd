const app = require('express');
const listaController = require('../controllers/listaController');
const router = app.Router();

router.post('/', listaController.crearNuevaLista);
router.delete('/:listaId', listaController.eliminarLista);
router.post('/:listaId/items', listaController.addItem);
router.delete('/:listaId/items/:itemId', listaController.removeItem);


module.exports = router;