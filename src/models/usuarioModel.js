const mongoose = require("mongoose");
const { runCascadeDelete } = require('../services/deleteService');

const usuarioSchema = new mongoose.Schema(
  {
    mail: { type: String, required: true, unique: true, trim: true},
    passwordHash: { type: String, required: true, default: "#FFFFFF" },
    username: {type: String, required: true, trim: true},
    //el enum deberia estar declarado afuera
    rol: { type: String, enum: ["admin", "user"], default: "user" },
    url_profile_photo: { type: String, default: "" },
    isDeleted : { type: Boolean, default: false },

        canciones_favoritas: {
        type: [{ // Define el array de objetos con esta estructura
            // Referencia a la Canción (ID para consultas profundas)
            _id: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Cancion", 
                required: true 
            },
            titulo: { type: String, required: true },

            // Datos desnormalizados para visualización rápida
            autor_nombre: { type: String, required: true },
            album_portada: { type: String, default: "" }
        }], 
        // Validador de Mongoose: Asegura que el array no tenga más de 4 elementos.
        validate: {
            validator: function(v) {
                return v.length <= 4;
            },
            message: props => `El array de canciones favoritas no puede exceder los 4 elementos (actual: ${props.value.length})`
        }
    }, 
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