const searchService = require('../services/searchService');

const globalSearch = async (req, res) => {
    try {
        const { q, type } = req.query;

        if (!q) {
            return res.status(200).json([]);
        }

        // Llamamos al servicio pasando el query (lo que esta en la barra de busqueda) y la categoría (ej: 'albums')
        const results = await searchService.searchData(q, type);
        
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error en la búsqueda", error: error.message });
    }
};

module.exports = { globalSearch };