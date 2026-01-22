const  Cancion = require("../models/cancionModel");
const globalService = require("./globalService");

// FALTARIA EL MANEJO DE ERRORES
async function getAllCanciones(options = {}) {
    const canciones = await globalService.getDocuments(Cancion, options);
    return canciones;
}

async function getCancionById(id) {
    const cancion = await globalService.getDocument(Cancion, { _id: id });
    return cancion;
}

/* 

Deberia extenderse / modificarse, para que tambien busque albums y artistas

*/
async function buscarCanciones(busqueda) {
    // Si la cadena de búsqueda está vacía o es nula, devolver un array vacío.
    // es una validacion simple y nos evita hacer una consulta innecesaria.
    if (!busqueda || busqueda.trim() === '') {
        return [];
    }
    
    // Este try catch basicamente va a atajar los errores de mongo, la DB, y la comunicacion 
    // con la misma. El del controller ataja los errores de la peticion HTTP.
    try {
        const resultados = await Cancion.find(
            // FILTRO: Busca en todos los campos que estan en el indice
            { 
                $text: { $search: busqueda } 
            },
            /*  Proyección: Incluye el score de relevancia en los resultados
                score: es un campo virtual que MongoDB crea para ordenar por relevancia
                $meta: es un poco tecnico, pero es un proyector de metadatos de mongoDB,
                permite acceder a información calculada por la base de datos durante la 
                ejecución de una consulta, información que no está almacenada 
                permanentemente en el documento, en este caso el score.
            */
            { 
                score: { $meta: "textScore" } 
            }
        )
        // Ordena por relevancia y limita a 20 resultados
        .sort( { 
            score: { $meta: "textScore" } 
        } ) 
        .limit(20);

        return resultados;

    } catch (error) {
        console.error("Error en la capa de servicio al buscar canciones:", error);
        // Es mejor relanzar el error para que el Controller lo maneje y devuelva el 500.
        throw new Error("Fallo en la búsqueda de la base de datos.");
    }
}

/* async function updateCancion(id, data){
    // Reutilizamos la función genérica de 'update' del servicio global
        return await globalService.update(Cancion, id, data);
} */

async function deleteCancion(id, options = {}) {
    return await Cancion.delete({ _id: id }, options);
}


module.exports = {
    getAllCanciones,
    buscarCanciones,
    getCancionById,
   // updateCancion,
    deleteCancion,
};