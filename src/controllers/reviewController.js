const reviewService = require("../services/reviewService");

async function getAll(req, res) {
  try {
    const options = {
      limit: req.query.limit,
      cursor: req.query.cursor
    };
    const reviews = await reviewService.getAllReviews(options);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getById(req, res) {
  const id = req.params.id;
  try {
    const reviews = await reviewService.getReviewById(id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function createReview(req, res) {
  const review = await reviewService.createReview(req.body);
  res.status(201).json(review);
}

async function updateReview(req, res) {
  const reviewActualizada = await reviewService.updateReview(req.params.id, req.body);
  res.status(201).json(reviewActualizada);
}

async function softDelete(req, res) {
  try {
    const id = req.params.id;
    const result = await reviewService.deleteReview(id);

    if (result.reviews === 0) {
      return res.status(404).json({ message: "Review no encontrada o ya eliminada." });
    }

    res.status(200).json({
      message: "Review eliminada lógicamente.",
      report: result
    });
  } catch (err) {
    console.error("Error en softDelete (Review):", err);
    res.status(500).json({ error: "Error interno al eliminar la review." });
  }
}

async function getReviewsByEntity(req, res) {
  try {
    const { entityType, deezerId } = req.params;

    const mapTypes = {
      'cancion': 'Cancion',
      'album': 'Album',
    };

    const tipoNormalizado = mapTypes[entityType.toLowerCase()];

    if (!tipoNormalizado) {
      return res.status(400).json({
        error: "El tipo de entidad debe ser 'album' o 'cancion'"
      });
    }

    const options = {
      limit: req.query.limit,
      cursor: req.query.cursor
    };

    const reviews = await reviewService.getReviews(tipoNormalizado, deezerId, options);
    res.status(200).json(reviews);

  } catch (err) {
    res.status(500).json({
      error: `Error al obtener las reviews: \n ${err.message}`
    });
  }
}

module.exports = {
  getAll,
  getById,
  createReview,
  updateReview,
  softDelete,
  getReviewsByEntity,
};
