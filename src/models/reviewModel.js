const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 0, max: 5 },
    like: { type: Boolean, default: false },
    comentario: { type: String },
    isDeleted: { type: Boolean, default: false },

    autor: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
      username: { type: String, required: true },
      url_profile_photo: { type: String, default: "" },
    },

    entidad_tipo: {
      type: String,
      required: true,
      enum: ["Cancion", "Album"],
    },
    deezer_id: {
      type: Number,
      required: true,
    },

    entidad_info: {
      titulo: { type: String, required: true },
      autor_nombre: { type: String, required: true },
      url_portada: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    collection: "reviews",
  }
);

reviewSchema.statics.delete = async function (query) {
  const { runCascadeDelete } = require("../services/deleteService");
  return runCascadeDelete(this, query, {
    cascade: [],
    effects: [],
  });
};

module.exports = mongoose.model("Review", reviewSchema);
