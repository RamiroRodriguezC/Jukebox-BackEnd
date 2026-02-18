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

async function getAlbumsByArtist(artistId,options = {}) {
    // Buscamos álbumes donde el array de autores contenga un objeto con _id igual a artistId
    const albums = await globalService.getDocuments(Album,options, { "autores._id": artistId });
    return albums;
}


module.exports = {
    getAllAlbums,
    getAlbumById,
    deleteAlbum,
    getAlbumsByArtist,
    // ... otras funciones
};