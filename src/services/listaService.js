const Lista = require('../models/listaModel');

const addItemToList = async (listaId, itemData) => {
    // itemData vendrá con { _id, titulo, url_miniatura }
    
    // Usamos $addToSet para evitar duplicados (que no agreguen 2 veces lo mismo)
    const listaActualizada = await Lista.findByIdAndUpdate(
        listaId,
        { $addToSet: { items: itemData } },
        { new: true }
    );

    if (!listaActualizada) throw new Error("La lista no existe");
    return listaActualizada;
};

const removeItemFromList = async (listaId, itemId) => {
    const listaActualizada = await Lista.findByIdAndUpdate(
        listaId,
        { $pull: { items: { _id: itemId } } }, // Busca en el array el objeto con ese _id y lo saca
        { new: true }
    );

    if (!listaActualizada) throw new Error("La lista no existe");
    return listaActualizada;
};

const createLista = async (data) => {
    const nuevaLista = new Lista(data);
    return await nuevaLista.save();
};

const deleteLista = async (listaId, usuarioId) => {
    // Es importante pedir el usuarioId por seguridad, 
    // para que nadie borre listas ajenas.
    const listaEliminada = await Lista.findOneAndDelete({ 
        _id: listaId, 
        usuario_id: usuarioId 
    });

    if (!listaEliminada) {
        throw new Error("La lista no existe o no tenés permiso para borrarla");
    }

    return listaEliminada;
};

module.exports = { addItemToList, createLista, removeItemFromList, deleteLista };