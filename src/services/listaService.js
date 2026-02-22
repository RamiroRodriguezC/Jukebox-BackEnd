const Lista = require('../models/listaModel');

const createLista = async (data) => {
    const nuevaLista = new Lista(data);
    return await nuevaLista.save();
};

const addItemToList = async (id, itemData) => {
    // Buscamos la lista (Traemos el documento completo)
    const lista = await Lista.findById(id);
    if (!lista) throw new Error("La lista no existe");

    // Control de duplicados manual, si hay alguno (some) con el mismo _id, no lo agregamos.
    const yaExiste = lista.items.some(item => item._id.toString() === itemData._id.toString());
    
    if (yaExiste) {
        return lista; // Si ya está, devolvemos sin hacer nada
    }

    // Agregamos al array en memoria
    lista.items.push(itemData);

    // Guardamos el documento completo.
    // Aca interviene el validator de Mongoose (model), que chequea que el item cumpla con el schema.
    await lista.save();

    return lista;
};

const removeItemFromList = async (listaId, itemId) => {
    // Para borrar sí podemos usar el método rápido, no necesitamos validar límites
    const listaActualizada = await Lista.findByIdAndUpdate(
        listaId,
        { $pull: { items: { _id: itemId } } }, 
        { new: true }
    );

    if (!listaActualizada) throw new Error("La lista no existe");
    return listaActualizada;
};

const deleteLista = async (listaId) => {
    const lista = await Lista.findById(listaId);
    if (!lista) throw new Error("La lista no existe");

    // Verificación de seguridad (eliminable: false)
    if (lista.eliminable === false) {
        throw new Error("No tienes permiso para eliminar esta lista del sistema.");
    }

    await Lista.findByIdAndDelete(listaId);
    return lista;
};

module.exports = {
    createLista,
    addItemToList,
    removeItemFromList,
    deleteLista
};