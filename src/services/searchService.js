const mongoose = require('mongoose');

const searchData = async (query, type) => {
    const modelName = type;
    //error si vino algo incorrecto
    if (!modelName) throw new Error("Tipo no reconocido");

    // ESTO ES CLAVE: Intentamos obtener el modelo
    const Modelo = mongoose.model(modelName);
    
    // Determinamos el campo de búsqueda (que tipo de dato es el que se busca) dependiendo del modelo
    // Si es Album o Cancion, buscamos por 'titulo', si es Artista o Usuario, buscamos por 'nombre'
    const filterField = (modelName === 'Album' || modelName === 'Cancion') ? 'titulo' : 'nombre';
    
    // Armamos la query, usando regex para una busqueda parcial y usando 'i'.
    // Filtramos siempre x isDeleted: false para no traer resultados borrados
    const mongoQuery = {
        [filterField]: { $regex: query, $options: 'i' },
        isDeleted: false
    };
    
    console.log("3. Query final a Mongo:", JSON.stringify(mongoQuery));

    const results = await Modelo.find(mongoQuery).lean();
    
    console.log("4. Resultados encontrados:", results.length);
    return results;
};

module.exports = { searchData };