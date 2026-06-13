const listaService = require('../services/listaService');

const crearNuevaLista = async (req, res) => {
    try {
        const { titulo, descripcion, tipo_items, max_items, eliminable } = req.body;

        const autor = {
            _id: req.user.id,
            username: req.user.username
        };

        const lista = await listaService.createLista({
            titulo,
            descripcion,
            autor,
            tipo_items,
            max_items,
            eliminable
        });

        res.status(201).json(lista);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { deezer_id, titulo, url_miniatura } = req.body;

        if (!deezer_id || !titulo) {
            return res.status(400).json({ message: "Faltan datos del ítem (deezer_id, titulo)" });
        }

        const lista = await listaService.addItemToList(id, { deezer_id, titulo, url_miniatura });

        res.status(200).json({ message: "Ítem agregado correctamente", lista });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const { id, deezerId } = req.params;

        const lista = await listaService.removeItemFromList(id, deezerId);

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
        const { id } = req.params;

        await listaService.deleteLista(id);

        res.status(200).json({ message: "Lista eliminada definitivamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { crearNuevaLista, addItem, removeItem, eliminarLista };
