const Review = require("../models/reviewModel");
const Usuario = require("../models/usuarioModel");
const globalService = require("./globalService");

async function getAllReviews(options = {}) {
  return globalService.getDocuments(Review, options);
}

async function getReviewById(id) {
  return globalService.getDocument(Review, { _id: id });
}

async function createReview(data) {
  const { rating, like, comentario, entidad_tipo, autor_id, deezer_id, entidad_info } = data;

  if (!rating || !entidad_tipo || !deezer_id || !autor_id || !entidad_info) {
    const error = new Error("Faltan campos obligatorios: rating, entidad_tipo, deezer_id, autor_id, entidad_info");
    error.statusCode = 400;
    throw error;
  }

  if (!["Cancion", "Album"].includes(entidad_tipo)) {
    const error = new Error(`El tipo de entidad '${entidad_tipo}' no es válido.`);
    error.statusCode = 400;
    throw error;
  }

  const autor = await Usuario.findOne({ _id: autor_id, isDeleted: false });
  if (!autor) {
    const error = new Error(`No se encontró el autor con ID '${autor_id}'.`);
    error.statusCode = 404;
    throw error;
  }

  const reviewData = {
    rating,
    entidad_tipo,
    deezer_id,
    like,
    autor: {
      _id: autor._id,
      username: autor.username,
      url_profile_photo: autor.url_profile_photo || "",
    },
    entidad_info: {
      titulo: entidad_info.titulo,
      autor_nombre: entidad_info.autor_nombre || "Desconocido",
      url_portada: entidad_info.url_portada || "",
    },
  };

  if (comentario !== undefined) reviewData.comentario = comentario;

  return await Review.create(reviewData);
}

async function updateReview(id, data) {
  const review = await Review.findById(id);
  if (!review || review.isDeleted) throw new Error("No encontrado");

  review.set(data);
  await review.save();
  return review;
}

async function deleteReview(id, options = {}) {
  return Review.delete({ _id: id }, options);
}

async function getReviews(tipo, deezerId, options = {}) {
  const query = {
    entidad_tipo: tipo,
    deezer_id: Number(deezerId),
    isDeleted: false,
  };
  return globalService.getDocuments(Review, options, query);
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviews,
};
