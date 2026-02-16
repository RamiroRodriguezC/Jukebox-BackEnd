const mongoose = require('mongoose');

const searchData = async (query, type) => {
    const modelName = type;
    //error si vino algo incorrecto
    if (!modelName) throw new Error("Tipo no reconocido");

    // ESTO ES CLAVE: Intentamos obtener el modelo
    const Modelo = mongoose.model(modelName);
    
    // Determinamos la condición de búsqueda según la categoría. Usamos regex para permitir búsquedas parciales
    // y case-insensitive ( options : i). 
    // Si a futuro quisiesemos agregar una busqueda más compleja, como buscar por autor en canciones o álbumes,
    // es escalable hacerlo desde aqui, agregando más campos o condiciones.

    const categoryMap = {
        'Usuario': { username: { $regex: query, $options: 'i' },},
        'Artista': { nombre: { $regex: query, $options: 'i' } },
        'Album': { titulo: { $regex: query, $options: 'i' } },
        'Cancion': { titulo: { $regex: query, $options: 'i' } }
    };

    // Obtenemos la condición específica para el modelo actual.
    const categoryCondition = categoryMap[modelName];
    
    // Armamos la query, usando regex para una busqueda parcial y usando 'i'.
    // Filtramos siempre x isDeleted: false para no traer resultados borrados
    const mongoQuery = {
        ...categoryCondition, // "Esparcimos" la condición específica (ej: el $or o el nombre)
        isDeleted: false      // Mantenemos el filtro de seguridad
    };
    
    console.log("3. Query final a Mongo:", JSON.stringify(mongoQuery));

    const results = await Modelo.find(mongoQuery).lean();
    
    console.log("4. Resultados encontrados:", results.length);
    return results;
};

module.exports = { searchData };