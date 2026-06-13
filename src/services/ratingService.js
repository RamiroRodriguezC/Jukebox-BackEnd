const Review = require("../models/reviewModel");

async function getAverageRating(deezerId, entidadTipo) {
  const result = await Review.aggregate([
    { $match: { deezer_id: deezerId, entidad_tipo: entidadTipo, isDeleted: false } },
    { $group: { _id: null, promedio: { $avg: "$rating" }, total: { $sum: 1 } } },
  ]);

  if (result.length === 0) {
    return { promedio: 0, cantidad: 0 };
  }

  return {
    promedio: Number((result[0].promedio).toFixed(1)),
    cantidad: result[0].total,
  };
}

module.exports = { getAverageRating };
