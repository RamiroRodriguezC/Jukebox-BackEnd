const app = require("express");
const router = app.Router();
const chartController = require("../controllers/chartController");

router.get("/", chartController.getChart);

module.exports = router;
