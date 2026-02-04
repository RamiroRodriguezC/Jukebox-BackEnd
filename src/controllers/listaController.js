const listaService = require('../services/listaService');

const crearNuevaLista = async (req, res) => {
    try {
        // 1. Extraemos los datos de la petición (API)
        const { titulo, descripcion, tipo_items } = req.body;
        const usuario_id = req.usuario.id; // Viene del token/auth

        // 2. Le pedimos al SERVICE que haga el trabajo sucio
        const lista = await listaService.createLista({
            titulo,
            descripcion,
            usuario_id,
            tipo_items
        });

        // 3. Respondemos al cliente de la API
        res.status(201).json(lista);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addItem = async (req, res) => {
    try {
        const { listaId } = req.params;
        const { _id, titulo, url_miniatura } = req.body;

        // Validamos que vengan los datos mínimos
        if (!_id || !titulo) {
            return res.status(400).json({ message: "Faltan datos del ítem" });
        }

        const lista = await listaService.addItemToList(listaId, { _id, titulo, url_miniatura });
        
        res.status(200).json({
            message: "Ítem agregado correctamente",
            lista
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const { listaId, itemId } = req.params;

        const lista = await listaService.removeItemFromList(listaId, itemId);
        
        res.status(200).json({
            message: "Ítem removido de la lista",
            lista
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const eliminarLista = async (req, res) => {
    try {
        const { listaId } = req.params;
        const usuarioId = req.usuario.id; // Asumiendo que tenés authMiddleware

        await listaService.deleteLista(listaId, usuarioId);
        
        res.status(200).json({
            message: "Lista eliminada definitivamente"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { crearNuevaLista, addItem, removeItem, eliminarLista };