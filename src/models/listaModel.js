const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listaSchema = new Schema({
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "" },
    tipo_items: { type: String, enum: ['Cancion', 'Album'], required: true },
    
    // Seguridad:
    eliminable: { type: Boolean, default: true }, 
    
    // NUEVO CAMPO: Límite máximo de ítems
    // Si es null o 0, asumimos que no hay límite (o es infinito)
    max_items: { type: Number, default: null },

    autor: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
        username: { type: String, required: true }
    },
    items: {
        type: [{
            _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
            titulo: { type: String, required: true },
            url_miniatura: { type: String } 
        }],
        // Validador de Mongoose: Actúa como doble seguridad al hacer .save()
        validate: {
            validator: function(v) {
                // Si no hay límite definido, permitimos todo
                if (!this.max_items) return true;
                // Si hay límite, verificamos el largo
                return v.length <= this.max_items;
            },
            //mensaje de error si falla la validacion
            message: 'Esta lista alcanzó su límite máximo de ítems.'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Lista", listaSchema);