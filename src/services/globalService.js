const deleteService = require("./deleteService");

/**
 * Realiza un update en un documento de Mongoose siempre y cuando este no este eliminado (Soft Delete) y exista.
 *  @param {object} Model - El modelo de Mongoose (Usuario, Review, Cancion, etc.).
 *  @param {string} id - El ID del documento a actualizar.
 *  @param {object} data - Objeto con los campos a actualizar.
 *  @returns {Promise<object|null>} El documento actualizado o null si no se encontró.
 */

async function update(Model, id, data) {
    const documento = await Model.findById(id);
    // si el documento existe y si no esta eliminado, hacemos el update
    if (!documento){
         const error = new Error(`${Model.modelName} no encontrad@ (ID: ${id})`);
         error.statusCode = 404;
         throw error;
    }    
    // Si el documento está marcado como eliminado, lanzamos un error
    if (await deleteService.isDeleted(documento)) {
        const error = new Error(`${Model.modelName} no esta disponible o ha sido eliminad@ (ID: ${id})`);
        error.statusCode = 404;
         throw error;
    }

    /*
    El método .set() funciona como una fusión (merge). Solo actualiza los campos que vienen en el objeto data. 
    Los campos que ya existían en documento pero que no vienen en data, se quedan exactamente como estaban.
    */
    documento.set(data); 
    console.log(`Actualizando ${Model.modelName} con ID ${id} con los datos:`, data);
    await documento.save();
    console.log(`${Model.modelName} con ID ${id} actualizado correctamente.`);
    return documento;
} 

/**
 * Obtiene documentos de la base de datos usando paginación por cursor.
 * Ideal para "infinite scroll".
 * Siempre excluye los documentos marcados como 'isDeleted: true'.
 *
 * @param {object} Model - El Modelo de Mongoose (Usuario, Review, Cancion, etc.).
 * @param {object} [filtro={}] - El objeto de filtro para MongoDB (ej: { autor_id: id }).
 * @param {object} [options={}] - Opciones de paginación.
 * @param {string} [options.cursor] - El `_id` del último documento visto (para obtener la siguiente "página").
 * @param {number} [options.limit] - El número de documentos por página.
 * @returns {Promise<object>} - Una promesa que resuelve a un objeto con los documentos y metadatos de paginación.
 * Ej: {
 * docs: [documentos...],
 * limit: 10,
 * hasNextPage: true,
 * nextCursor: "60c72b9a1f1a4e001f..."
 * }
 */
async function getDocuments(Model, options = {} ,filtro = {}) {
  try {
    // Combina el filtro proporcionado con el filtro base (isDeleted: false)
    const query = { ...filtro, isDeleted: false };
    // Desestructuracion de options;
    const { cursor, limit } = options;
    const limitNum = parseInt(limit, 10);

    // Verifica si se proporcionó un límite válido
    const isPaginated = !isNaN(limitNum) && limitNum > 0;

    // Si hay un cursor, lo añadimos al query.
    // Asumimos orden descendente por _id (más nuevos primero).
    // Pedimos documentos donde el _id sea MENOR que el cursor ($lt) = less than.
    if (isPaginated && cursor) {
      query._id = { $lt: cursor };
    }

    // Siempre ordenamos por _id descendente para paginación por cursor
    // Esto es crucial para que el orden sea estable.
    // Declaramos con let por que sera necesario cambiar su valor y con const no podriamos
    let mongooseQuery = Model.find(query).sort({ _id: -1 });

    let docs = [];
    let hasNextPage = false;
    let nextCursor = null;

    if (isPaginated) {
      // Pedimos "limit + 1" documentos para saber si hay una página siguiente
      const docsToFetch = limitNum + 1;
      // Asignamos el resultado directamente a 'docs'
      docs = await mongooseQuery.limit(docsToFetch).exec();

      if (docs.length === docsToFetch) {
        // Si obtuvimos "limit + 1" docs, hay una página siguiente
        hasNextPage = true;
        docs.pop(); // Quitamos el documento extra
      }

      /* El nuevo cursor es el _id del último documento de la lista actual
         Este if esta para evitar errores si se usa directamente la api fuera del frontEnd
         En el front esto se manejaria con hasNextPage para no poder pedir nuevas paginas
         ademas tampoco queda el next cursor declarado cuando no deberia haberlo */
      if (docs.length > 0) {
        nextCursor = docs[docs.length - 1]._id.toString();
      }

    } else {
      // Si no hay paginación (no se proveyó 'limit'), devuelve todo
      // Asignamos el resultado directamente a 'docs'
      docs = await mongooseQuery.exec();
    }

    // Prepara el objeto de respuesta
    const resultado = {
      docs: docs,                                  // resultado de la query
      limit: isPaginated ? limitNum : docs.length, // esto es para el frontend, es la cant de colecciones que se muestran
      hasNextPage: hasNextPage,                    // booleano que dice si hay otra pagina para pedir, para prevenir errores
      nextCursor: nextCursor,                      // cursor apuntando a el ultimo elemento devuelto de la query para partir de ahi cuando queramos pasar de pagina.
    };
    
    // log para ver el resultado
    console.log(`Documentos obtenidos de ${Model.modelName} (Límite: ${limitNum || 'Ninguno'}, Cursor: ${cursor || 'Inicio'}) con filtro ${JSON.stringify(filtro)}`);
    
    return resultado;

  } catch (error) {
    // Mensaje de error actualizado
    const mensajeError = `Error al obtener los documentos "${Model.modelName}" con criterios (${JSON.stringify(filtro)}) y opciones (${JSON.stringify(options)}): \n`;

    console.error(mensajeError, error);
    throw new Error(`${mensajeError} \n Detalles: ${error.message}`);
  }
}

/**
 * Obtiene el primer (o unico) de la base de datos según un filtro específico.
 * Siempre excluye las reviews marcadas como 'isDeleted: true'.
 * usa findOne en lugar de find, dado que es mas eficaz cuando esperamos un solo resultado.
 *
 * @param {object} filtro - El objeto de filtro para MongoDB (ej: { autor_id: id }).
 * @param {object} Model - El Model de Mongoose (Usuario, Review, Cancion, etc.).
 * @returns {Promise<Array>} - Una promesa que resuelve a un array de reviews.
 */
async function getDocument(Model, filtro = {}) {
  try {
    const query = { ...filtro, isDeleted: false };
    console.log(` \n\n\n Buscando UN documento de ${JSON.stringify(filtro)} \n\n\n`);
    // Usar findOne() devuelve un objeto o null
    const response = await Model.findOne(query); 
    
    // log para ver el resultado | El JSON.stringify es para convertir el objeto en un string legible y poder concatenarlo
    if  (!response){
      console.log(`No se encontró ningún documento ${Model.modelName} con filtro ${JSON.stringify(filtro)}`);
    } else {
      console.log(`Documento encontrado de ${Model.modelName} con filtro ${JSON.stringify(filtro)}:`, response);
    }
    //
    return response;
    
    // Maneja errores como por ejemplo, que el modelo no exista o la conexion a la DB falle, etc.
  } catch (error) {
     const mensajeError = `Error al obtener UN documento "${Model.modelName}" con criterios (${JSON.stringify(filtro)})`;
     console.error(mensajeError, error);
     throw new Error(`${mensajeError} \n Detalles: ${error.message}`);
  }
}

module.exports = {
    update,
    getDocument,
    getDocuments,
};

