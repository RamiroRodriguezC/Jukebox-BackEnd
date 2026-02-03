const updateRatingStats = async (entidad_tipo, id, viejo = 0, nuevo = 0, accion) => {
    // IMPORTANTE: mongoose.model() es la clave para la flexibilidad
    console.log("Estoy en rating service", entidad_tipo, id, viejo, nuevo, accion);

    const Modelo = mongoose.model(entidad_tipo); 
    
    const entidad = await Modelo.findById(id);
    if (!entidad) return;

    // Aseguramos que sumaRating exista (por si hay documentos viejos en tu DB)
    if (entidad.sumaRating === undefined) {
        entidad.sumaRating = (entidad.promedioRating || 0) * (entidad.cantReseñas || 0);
    }

    switch (accion) {
        case 'CREATE':
            console.log("Estoy en CREATE");
            entidad.cantReseñas += 1;
            console.log("Nueva cantidad de reseñas:", entidad.cantReseñas);
            entidad.sumaRating += nuevo;
            console.log("Nueva suma de ratings:", entidad.sumaRating);
            break;
        case 'DELETE':
            entidad.cantReseñas = Math.max(0, entidad.cantReseñas - 1);
            entidad.sumaRating -= viejo;
            break;
        case 'UPDATE':
            entidad.sumaRating = entidad.sumaRating - viejo + nuevo;
            break;
    }

    // Recalcular promedio
    entidad.promedioRating = entidad.cantReseñas > 0 
        ? Number((entidad.sumaRating / entidad.cantReseñas).toFixed(1)) 
        : 0;

        console.log("Promedio recalculado:", entidad.promedioRating);
        
    await entidad.save();
};