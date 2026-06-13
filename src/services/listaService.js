const Lista = require("../models/listaModel");

const createLista = async (data) => {
  const nuevaLista = new Lista(data);
  return await nuevaLista.save();
};

const addItemToList = async (id, itemData) => {
  const lista = await Lista.findById(id);
  if (!lista) throw new Error("La lista no existe");

  const yaExiste = lista.items.some(item => item.deezer_id === itemData.deezer_id);
  if (yaExiste) return lista;

  lista.items.push(itemData);
  await lista.save();
  return lista;
};

const removeItemFromList = async (listaId, deezerId) => {
  const listaActualizada = await Lista.findByIdAndUpdate(
    listaId,
    { $pull: { items: { deezer_id: Number(deezerId) } } },
    { new: true }
  );
  if (!listaActualizada) throw new Error("La lista no existe");
  return listaActualizada;
};

const deleteLista = async (listaId) => {
  const lista = await Lista.findById(listaId);
  if (!lista) throw new Error("La lista no existe");

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
  deleteLista,
};
