const mongoose = require("mongoose");
const { runCascadeDelete } = require('../services/deleteService');

const cancionSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true},
    duracion: { type: Number, required: true }, // Duracion en segundos
    generos: { type: [String], default: [] },
    fecha_salida: { type: Date, default: null },
    isDeleted : { type: Boolean, default: false },

    album: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
        titulo: { type: String, required: true },
        url_portada: { type: String, default: "" }, // Para mostrar la carátula sin consultar el álbum
    },

    autores: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Artista", required: true },
        nombre: { type: String, required: true } // Para mostrar la canción con su artista
    }]

  },
  { 
    timestamps: true ,
    collection: 'canciones' 
    //hubo que agregar colecction : 'canciones' porque sino mongoose
    //creaba la coleccion 'cancions' por el pluralizer.
  }
);

// Índice de texto completo para búsquedas eficientes

/* Indexación Inteligente (Paso Previo): Cuando creas un índice de texto, MongoDB:

Tokeniza: Divide el texto en palabras individuales.

Normaliza: Ignora mayúsculas/minúsculas (CAnciOn se vuelve cancion).

Stemming (Radicación): Reduce las palabras a su raíz lingüística (ej: "corriendo", "corrió", "corren" se reducen a la raíz corr-).

Filtra: Ignora palabras vacías (stop words), como "el", "la", "un", "y", que no aportan valor a la búsqueda.
*/

cancionSchema.index(
    { 
      // Campos a indexar para búsqueda de texto completo
        titulo: 'text', 
        'album.titulo': 'text',
        'autores.nombre': 'text' 
    }, 
    { 
        // peso/jerarquia de los campos (va a priorizar las coincidencias en titulo, decreciendo
        // hacia el menor peso)
        weights: { 
            titulo: 3,
            'album.titulo': 2,
            'autores.nombre': 1 
        },
        
         default_language: 'spanish', // Configura el idioma para la tokenización y stemming
        name: 'fullTextSearchIndex'   // Nombre del índice
    }
);

/**
 * Método estático para realizar un borrado lógico de Canciones.
 * Este método orquesta el borrado de sus dependencias (Reviews).
 * @param {object} query - Filtro para encontrar los álbumes a borrar (ej: { _id: '...' }).
 */

/* Declaramos como funcion estatica del schema (https://mongoosejs.com/docs/guide.html#statics) 
   Basicamente estamos agregandole una funcion mas, como find, como cualquier otra.      */

cancionSchema.statics.delete = async function(query) {
    // Llamamos al "corredor" genérico pasándole el modelo actual ('this'),
    // la query original, y el objeto de configuración de dependencias.
    return runCascadeDelete(this, query, {
        
        // 'cascade': Lista de modelos HIJOS que deben borrarse lógicamente también.
        cascade: [
            // 1. Borrar las REVIEWS que son directamente del álbum.
            {
                modelName: 'Review',
                buildQuery: (parentIds) => ({
                    entidad_id: { $in: parentIds },
                    entidad_tipo: 'Cancion'
                })
            }
        ],

        // 'effects': Lista de modelos RELACIONADOS que deben actualizarse (NO borrarse).
        effects: []
    });
}

module.exports = mongoose.model("Cancion", cancionSchema);