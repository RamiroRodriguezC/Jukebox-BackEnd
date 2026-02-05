const listaService = require('../services/listaService');

const crearNuevaLista = async (req, res) => {
    try {
        const { titulo, descripcion, tipo_items,max_items, eliminable } = req.body;
        
        // Armamos el objeto autor completo
        const autor = { // usuario que levantamos del token autenticado
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
        
        const { _id, titulo, url_miniatura } = req.body;

        if (!_id || !titulo) {
            return res.status(400).json({ message: "Faltan datos del ítem (_id, titulo)" });
        }

        const lista = await listaService.addItemToList(id, { _id, titulo, url_miniatura });
        
        res.status(200).json({ message: "Ítem agregado correctamente", lista });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const { id, itemId } = req.params;

        const lista = await listaService.removeItemFromList(id, itemId);
        
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
        // CORRECCIÓN: Leemos 'id' de los parámetros
        const { id } = req.params;

        await listaService.deleteLista(id);
        
        res.status(200).json({ message: "Lista eliminada definitivamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { crearNuevaLista, addItem, removeItem, eliminarLista };