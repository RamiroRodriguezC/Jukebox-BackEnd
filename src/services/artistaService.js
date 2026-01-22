const Artista = require("../models/artistaModel");
const globalService = require("./globalService");

// FALTARIA EL MANEJO DE ERRORES
async function getAllArtistas(options = {}) {
    const artistas = await globalService.getDocuments(Artista, options);
    return artistas;
}

async function getArtistaById(id) {
    const artista = await globalService.getDocument(Artista, { _id: id });
    return artista;
}

async function deleteArtista(id, options = {}) {
    return await Artista.delete({ _id: id }, options);
}


module.exports = {
    deleteArtista,
    getAllArtistas,
    getArtistaById, 
};