const app = require('express');
const router = app.Router();
const artistaController = require('../controllers/artistaController');

router.get("/search", artistaController.search);
router.get("/:deezerId/albums", artistaController.getAlbums);
router.get("/:deezerId/top", artistaController.getTopTracks);
router.get("/:deezerId", artistaController.getById);

module.exports = router;
