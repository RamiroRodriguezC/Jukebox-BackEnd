const app = require('express');
const router = app.Router();
const cancionController = require('../controllers/cancionController');

router.get("/search", cancionController.search);
router.get("/:deezerId", cancionController.getById);

module.exports = router;
