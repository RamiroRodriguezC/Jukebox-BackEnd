const app = require('express');
const router = app.Router();
const albumController = require('../controllers/albumController');

router.get("/search", albumController.search);
router.get("/:deezerId", albumController.getById);

module.exports = router;
