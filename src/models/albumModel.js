const mongoose = require("mongoose");
const { runCascadeDelete } = require('../services/deleteService');

const albumSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true},
    anio: { type: Number, required: true },
    url_portada: { type: String, default: "" },
    isDeleted : { type: Boolean, default: false },

    // *** CAMBIO: Desnormalización del Artista (nombre) ***
    autores: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Artista", required: true },
        nombre: { type: String, required: true } // Nombre del artista
    }],

    // *** CAMBIO: Embeber Tracklist (referencias parciales) ***
    canciones: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Cancion", required: true },
        titulo: { type: String, required: true } // Título para la lista de canciones (tracklist)
    }]
  },
  
  { timestamps: true }
);

/**
 * Método estático para realizar un borrado lógico de Álbumes.
 * Este método orquesta el borrado de sus dependencias (Canciones, Reviews).
 * @param {object} query - Filtro para encontrar los álbumes a borrar (ej: { _id: '...' }).
 */

/* Declaramos como funcion estatica del schema (https://mongoosejs.com/docs/guide.html#statics) 
   Basicamente estamos agregandole una funcion mas, como find, como cualquier otra.      */

albumSchema.statics.delete = async function(query) {
    // Llamamos al "corredor" genérico pasándole el modelo actual ('this'),
    // la query original, y el objeto de configuración de dependencias.
    return runCascadeDelete(this, query, {
        
        // 'cascade': Lista de modelos HIJOS que deben borrarse lógicamente también.
        cascade: [
            // 1. Borrar las CANCIONES asociadas a este álbum.
            {
                modelName: 'Cancion',
                // 'parentIds' es un array con los IDs de los álbumes que estamos borrando.
                /* $in es practicamente un or, busca coincidencia con al menos uno de los valores del array
                   como el id es unica va a encontrar el modelo que corresponda a cada id */
                buildQuery: (parentIds) => ({ 'album._id': { $in: parentIds } })
            },
            // 2. Borrar las REVIEWS que son directamente del álbum.
            {
                modelName: 'Review',
                buildQuery: (parentIds) => ({
                    entidad_id: { $in: parentIds },
                    entidad_tipo: 'Album'
                })
            }
        ],

        // 'effects': Lista de modelos RELACIONADOS que deben actualizarse (NO borrarse).
        effects: [
            /* EJEMPLO HIPOTÉTICO: Si Artista tuviera 'discografia' embebida
            {
                modelName: 'Artista',
                reportAs: 'artistasActualizados', // <--- AQUÍ VA EL reportAs
                buildQuery: (parentIds) => ({ 'discografia._id': { $in: parentIds } }),
                operation: (parentIds) => ({ $pull: { discografia: { _id: { $in: parentIds } } } })
            }
            */
        ]
    });
}
// ...

module.exports = mongoose.model("Album", albumSchema);
