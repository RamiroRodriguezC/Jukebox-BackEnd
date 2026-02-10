const app = require('express');

const router = app.Router();
const searchController = require('../controllers/searchController');

router.get("/", searchController.globalSearch);

module.exports = router;