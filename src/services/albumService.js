// src/services/albumService.js
const globalService = require("./globalService");
const Album = require("../models/albumModel");


async function getAllAlbums(options = {}) {
    // La lógica de la base de datos se queda aquí.
    // Usamos .find() sin parámetros para obtener todos.
    const albums = await globalService.getDocuments(Album, options);
    return albums;
}

async function getAlbumById(id) {
    const album = await globalService.getDocument(Album, { _id: id });
    return album;
}
// Puedes añadir otras funciones aquí, como getAlbumById, createAlbum, etc.

async function deleteAlbum(id, options = {}) {
    return await Album.delete({ _id: id }, options);
}


module.exports = {
    getAllAlbums,
    getAlbumById,
    deleteAlbum,
    // ... otras funciones
};