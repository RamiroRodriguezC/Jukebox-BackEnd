const app = require('express');
const router = app.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, isAdminOrReviewOwner } = require('../middlewares/authMiddleware');

router.get("/", reviewController.getAll);
router.post("/create", authenticateToken, reviewController.createReview);
router.put("/:id", authenticateToken, isAdminOrReviewOwner, reviewController.updateReview);
router.delete("/:id", authenticateToken, isAdminOrReviewOwner, reviewController.softDelete);
router.get("/:entityType/:deezerId", reviewController.getReviewsByEntity);
router.get("/:id", reviewController.getById);

module.exports = router;
