const mongoose = require("mongoose");
const { runCascadeDelete } = require('../services/deleteService');

const artistaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true},
    pais: { type: String, required: true, trim: true},
    descripcion: { type: String, default: "" },
    url_foto: { type: String, default: "" },
    isDeleted : { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* 

 EN ARTISTA AUN NO ESTA IMPLEMENTADA LA FUNCION DELETE, PUESTO QUE REQUIERE DE LOGICA ADICIONAL:
 COMO LAS CANCIONES Y ALBUNES PUEDEN TENER MULTIPLES ARTISTAS, NO SE PUEDE SIMPLEMENTE BORRAR EN CASCADA.
 HABRIA QUE DESVINCULAR A ESE ARTISTA DE LA CANCION Y EL ALBUM, Y SI EL ALBUM ES DE UN UNICO ARTISTA (O YA BORRE TODOS)
 AHI SI ELIMINARLO

*/

module.exports = mongoose.model("Artista", artistaSchema);