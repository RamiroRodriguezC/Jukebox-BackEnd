const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listaSchema = new Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, default: "" },
  tipo_items: { type: String, enum: ["Cancion", "Album"], required: true },

  eliminable: { type: Boolean, default: true },

  max_items: { type: Number, default: null },

  autor: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    username: { type: String, required: true },
  },
  items: {
    type: [
      {
        deezer_id: { type: Number, required: true },
        titulo: { type: String, required: true },
        url_miniatura: { type: String },
      },
    ],
    validate: {
      validator: function (v) {
        if (!this.max_items) return true;
        return v.length <= this.max_items;
      },
      message: "Esta lista alcanzó su límite máximo de ítems.",
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("Lista", listaSchema);
