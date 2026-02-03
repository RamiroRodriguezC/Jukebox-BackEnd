const updateRatingStats = async (entidad_tipo, id, viejo = 0, nuevo = 0, accion) => {
    // IMPORTANTE: mongoose.model() es la clave para la flexibilidad
    const Modelo = mongoose.model(entidad_tipo); 
    
    const entidad = await Modelo.findById(id);
    if (!entidad) return;

    // Aseguramos que sumaRating exista (por si hay documentos viejos en tu DB)
    if (entidad.sumaRating === undefined) {
        entidad.sumaRating = (entidad.promedioRating || 0) * (entidad.cantReseñas || 0);
    }

    switch (accion) {
        case 'CREATE':
            entidad.cantReseñas += 1;
            entidad.sumaRating += nuevo;
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

    await entidad.save();
};