const mongoose = require("mongoose");
/**
 * Ejecuta un borrado lógico en cascada de forma genérica.
 * * NOTA: Esta implementación carga los IDs de los documentos a borrar en memoria.
 * Para colecciones extremadamente grandes (millones de documentos), esto podría
 * requerir optimización futura mediante procesamiento por lotes (cursors/batches).
 * Para la escala actual del proyecto, es seguro y eficiente.
 *
 * @param {mongoose.Model} Model - El modelo 'this' desde el que se llama.
 * @param {object} filter - Filtro inicial para encontrar documentos.
 * @param {object} config - Configuración de dependencias (cascade/effects).
 * @returns {Promise<object>} Reporte final acumulado.
 */
async function runCascadeDelete(Model, filter, config) {
    /* El la estructura basica para el reporte final, lo que devolvemos al final, un pequeño resumen de lo borrado 
    reporteFinal es basicamente, una especie de diccionario con formato {tipo de dato eliminado (key) : cant eliminada (value)} */
    const reporteKey = Model.collection.name;
    const reporteFinal = { [reporteKey]: 0 };

    // 1. Encontrar los documentos "padre" a borrar.

    /* le agregamos al filtro/query que pasamos por parametro, que solo busque los que no esten borrados (isDeleted : false)
    De esta forma evitamos intentar borrar algo que ya esta borrado */
    const baseQuery = { ...filter, isDeleted: false };
    
    /* Hacemos la busqueda de los elementos que vamos a borrar, pueden ser muchos, eso lo determinara el filtro.
       Guardaremos sus ID para poder buscar luego TODOS los elementos relacionados (hijos y embebidos) */

    /* |=======================| NOTA DE RENDIMIENTO |================================|
       | Si esta consulta devolviera decenas de miles de documentos,                  |
       | cargar todos sus IDs en memoria podría ser ineficiente.                      |
       | En ese caso, se debería usar un enfoque de procesamiento por lotes (batching)| 
       | o cursores.                                                                  |  
       |===========================================================================| */

    // usamos lean para que devuelva objetos JS simples y no documentos Mongoose completos (más liviano)
    const padres = await Model.find(baseQuery).select('_id').lean();

    // Si no encontramos nada que borrar, terminamos aquí y devolvemos el reporte vacío (ej: { artistas: 0 }).
    // Esto es importante para la recursión: es el caso base que detiene la ejecución si llegamos a una hoja del árbol sin hijos.
    if (padres.length === 0) {
        return reporteFinal;
    }

    // Transformamos el array de objetos [{ _id: '1' }, { _id: '2' }] en un array simple de IDs ['1', '2'].
    // 'padres.map' recorre cada objeto 'doc' y extrae solo su propiedad '_id'.
    // Este array 'idsPadres' es lo que pasaremos a las queries de los hijos.
    const idsPadres = padres.map(doc => doc._id);
    
    console.log(`[Cascade - ${Model.modelName}] Iniciando borrado de ${padres.length} documentos...`);

    // 2. Procesar CASCADAS (Recursión)

    /* Si en el config vino la propiedad 'cascade', significa que este modelo tiene hijos que también deben borrarse. */
    if (config.cascade) {
        /* Para cada "hijo" definido en el config.cascade, ejecutamos su borrado lógico.
        Esto es recursivo: cada hijo puede tener a su vez sus propios hijos, y así sucesivamente. */

        // Por cada configuración de documento hijo en la lista de cascada... (si es album por ejemplo, canciones y reviews)
        for (const documentoHijo of config.cascade) { /* documentoHijo = cada hijo configurado en el modelo */
            // Obtenemos el modelo hijo (ej: 'Cancion') usando mongoose.model().
            const modeloHijo = mongoose.model(documentoHijo.modelName);
            
            /*  Usamos la función 'buildQuery' que definimos en el modelo padre para crear
             la consulta que encontrará a los hijos correctos de todos los padres que hayan
             sido marcados para borrado y cuyas id esten en padresId. 
            // Ej: { 'album._id': { $in: ['id_album_1', 'id_album_2'] } } */
            const queryHijo = documentoHijo.buildQuery(idsPadres);
            
            // --- LLAMADA RECURSIVA ---
            /* 
            Llamamos a runCascadeDelete() para el modelo hijo, pasándole su query con
            todos los hijos que hay que borrar, a los que aplicaremos nuevamente esta funcion
            con la config de cada hijo que estara declarada en su modelo respectivo.
            Esto sigue hasta que lleguemos a un modelo sin hijos (caso base), momento en el cual
            la función simplemente marcará esos documentos como borrados y retornará.
            */
            const childResult = await modeloHijo.delete(queryHijo);
            
            /*  Esto es logica para el resumen/reporte final. 
            Cuando el hijo termina, nos devuelve SU reporte. Lo fusionamos con el nuestro.
             Si nosotros teníamos { albums: 1 } y el hijo devuelve { canciones: 5, reviews: 50 },
             el reporteFinal pasará a ser { artistas: 1, albums: 5, canciones: 50 }. */
            for (const [key, value] of Object.entries(childResult)) {
                reporteFinal[key] = (reporteFinal[key] || 0) + value;
            }
        }
    }

    /* 
          3. ACA IRIA LA LOGICA PARA PROCESAR LOS "EFFECTS"
          CONSISTE BASICAMENTE, EN MANEJAR EFECTOS SECUNDARIOS DE LA ELIMINACION DE UN DOCUMENTO
          POR EJEMPLO, DATOS DEL PROPIO DOCUMENTO EMBEBIDOS/DESNORMALIZADOS EN OTRO.
          POR FALTA DE TIEMPO NO LLEGO A IMPLEMENTARSE PARA ESTA INSTANCIA PERO SERA IMPLEMENTADO
          SIN FALTA PARA LA INSTANCIA FINAL DEL TRABAJO.
     */

    /* 4. Borrar los padres (la operación final)
       Cuando ya borramos todos los hijos correctamente, ahora si, borramos los padres
        */
    const selfResult = await softDelete(Model, { _id: { $in: idsPadres } });

    // Actualizamos nuestro propio contador en el reporte con la cantidad real de documentos borrados.
    reporteFinal[reporteKey] += selfResult.modifiedCount;

    console.log(`[Cascade - ${Model.modelName}] Finalizado. Reporte parcial:`, reporteFinal);
    return reporteFinal;
}

function softDelete(Model, filter) {
    return Model.updateMany(
        filter, 
        { $set: { isDeleted: true } }
    );
}

/* Podria implementarse esta funcion con un if o un condicional y usarla en lugar de softDelete, reutilizando
runCascadeDelete, pero por ahora no se implemento 

function hardDelete(Model, filter) {
    return Model.deleteMany(filter);
}

*/

/**
 * 
 * @param {object} documento - El documento de Mongoose (Usuario, Review, Cancion, etc.). 
 * @returns {boolean} Retorna true si está eliminado, false si no, null si no existe.
 */
function isDeleted(documento) {
    return documento.isDeleted;
} 

module.exports = {
    runCascadeDelete,
    isDeleted
};
