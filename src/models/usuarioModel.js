const mongoose = require("mongoose");
const { runCascadeDelete } = require('../services/deleteService');

const usuarioSchema = new mongoose.Schema(
  {
    mail: { type: String, required: true, unique: true, trim: true},
    passwordHash: { type: String, required: true},
    username: {type: String, required: true, trim: true},
    //el enum deberia estar declarado afuera
    bio: { type: String, default: "" },
    rol: { type: String, enum: ["admin", "user"], default: "user" },
    url_profile_photo: { type: String, default: "" },
    isDeleted : { type: Boolean, default: false },

    lists: {
            favoriteSongs: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Lista" 
            },
            favoriteAlbums: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Lista" 
            },
            listenLater: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Lista" 
            }
        }
  },
  { timestamps: true }
);

/**
 * Método estático para realizar un borrado lógico de usuarios.
 * Este método orquesta el borrado de sus dependencias (Reviews).
 * @param {object} query - Filtro para encontrar los usuarios a borrar (ej: { _id: '...' }).
 */

/* Declaramos como funcion estatica del schema (https://mongoosejs.com/docs/guide.html#statics) 
   Basicamente estamos agregandole una funcion mas, como find, como cualquier otra.      */

usuarioSchema.statics.delete = async function(query) {
    // Llamamos al "corredor" genérico pasándole el modelo actual ('this'),
    // la query original, y el objeto de configuración de dependencias.
    return runCascadeDelete(this, query, {
        
        // 'cascade': Lista de modelos HIJOS que deben borrarse lógicamente también.
        cascade: [
            // 1. Borrar las REVIEWS asociadas a este usuario.
            {
                modelName: 'Review',
                // 'parentIds' es un array con los IDs de los usuarios que estamos borrando.
                /* $in es practicamente un or, busca coincidencia con al menos uno de los valores del array
                   como el id es unica va a encontrar el modelo que corresponda a cada id */
                buildQuery: (parentIds) => ({ 'autor._id': { $in: parentIds } })
            },

        ],

        // 'effects': Lista de modelos RELACIONADOS que deben actualizarse (NO borrarse).
        effects: []
    });
}

module.exports = mongoose.model("Usuario", usuarioSchema);