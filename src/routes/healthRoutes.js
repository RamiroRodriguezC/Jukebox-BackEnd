const app = require('express');
const router = app.Router();

router.get("/ping", (req, res) => {
  res.json({ status: "alive" });
});

module.exports = router;
