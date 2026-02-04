const mongoose = require("mongoose");

const listaSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "" },
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    tipo_items: { type: String, enum: ['Cancion', 'Album'], required: true },
    items: [{
        _id: { type: mongoose.Schema.Types.ObjectId, refPath: 'tipo_items' },
        titulo: { type: String, required: true },
        url_miniatura: { type: String } // Portada del álbum o de la canción
    }]
}, { timestamps: true });

module.exports = mongoose.model("Lista", listaSchema);