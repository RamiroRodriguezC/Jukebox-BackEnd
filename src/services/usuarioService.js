const Usuario = require("../models/usuarioModel");
const Review = require("../models/reviewModel");
const Cancion = require("../models/cancionModel");
const globalService = require("./globalService");
const listaService = require("./listaService");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


async function getAllUsuarios(options = {}) {
    const usuarios = await globalService.getDocuments(Usuario, options);
    return usuarios;
}
// Devuelve un array con el usuario que tiene el id pasado por parametro
async function getUsuarioById(id) {
  try {
    const usuario = await Usuario.findById(id)
      .populate({
        path: 'lists.favoriteSongs',
        populate: { path: 'items._id' } 
      })
      .populate({
        path: 'lists.favoriteAlbums',
        populate: { path: 'items._id' }
      });
    return usuario;
  } catch (error) {
    throw new Error(error);
  }
}

// Devuelve el usuario que tiene el mail pasado por parametro (al ser unique, solo habra uno o ninguno)
async function getUsuarioByEmail(mail) {
      const usuario = await globalService.getDocument(Usuario, { mail: mail });
      return usuario;
} 

async function validatePassword(password, usuario) {
    // compare toma el password en texto plano, 
    // lo hashea y lo compara con el hash guardado
    console.log(`La contraseña del usuario que se esta logueando es: ` + password);
    console.log(`La contraseña "hasheada" de la bd es: ` + usuario.passwordHash);
    console.log(` testiando: ` + usuario.mail + " || " + usuario.username);
    const isValid = await bcrypt.compare(password, usuario.passwordHash); 
    return isValid;
    //si son iguales devuelve true, sino false.
}

// PASO 3
function generateToken(usuario) {
    const payload = {
        id: usuario._id,
        email: usuario.mail,
        username: usuario.username,
        rol: usuario.rol
    }

    return jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ver .env o variable de entorno en produccion
      { expiresIn: "1h" } // 30 seg. para probar. Para que expire en 1 hora, colocar '1h'
    );
}

async function createUsuario(data){
  const {mail, password, username, rol, url_profile_photo} = data;

  if (!mail || !password || !username || !rol) {
    console.log("campos recibidos:" , mail, password, username, rol);
    const error = new Error("Faltan campos obligatorios...");
    error.statusCode = 400; 
    throw error; 
  }

  // Hashear password
  const saltRounds = 12; 
  const passwordHash = await bcrypt.hash(password, saltRounds);
    
  const userData = {
    mail,           
    passwordHash,   
    username,       
    rol,            
  };

  if (url_profile_photo !== undefined) userData.url_profile_photo = url_profile_photo;

  // Creamos el usuario primero (para obtener su _id)
  const nuevoUsuario = await Usuario.create(userData);

  // CREACIÓN AUTOMÁTICA DE LISTAS
  const autorData = { _id: nuevoUsuario._id, username: nuevoUsuario.username };

  try {
    // Llamamos a la función auxiliar para mantener este bloque limpio
    const defaultListsIds = await createDefaultLists(autorData);

    // Actualizamos el usuario con las referencias
    nuevoUsuario.lists = defaultListsIds;

    await nuevoUsuario.save();

  } catch (err) {
    console.error("Error creando listas por defecto:", err);
  }

  return nuevoUsuario;
}

// --- HELPER FUNCTION: Creación de listas por defecto ---
// Esta función encapsula la lógica de crear las 3 listas iniciales
async function createDefaultLists(autorData) {
    const [listaCanciones, listaAlbums, listaTarde] = await Promise.all([
        listaService.createLista({
            titulo: "Canciones Favoritas",
            descripcion: "Tus canciones preferidas",
            tipo_items: "Cancion",
            autor: autorData,
            eliminable: false,
            max_items: 4
        }),
        listaService.createLista({
            titulo: "Álbumes Favoritos",
            descripcion: "Tus álbumes preferidos",
            tipo_items: "Album",
            autor: autorData,
            eliminable: false,
            max_items: 4
        }),
        listaService.createLista({
            titulo: "Escuchar más tarde",
            descripcion: "Pendientes",
            tipo_items: "Cancion",
            autor: autorData,
            eliminable: false,
            max_items: 50
        })
    ]);

    // Retornamos el objeto estructurado con los IDs
    return {
        favoriteSongs: listaCanciones._id,
        favoriteAlbums: listaAlbums._id,
        listenLater: listaTarde._id
    };
}

async function updateUsuario(id, data){
    return await globalService.update(Usuario, id, data);
  }

async function deleteUsuario(id, options = {}) {
    return await Usuario.delete({ _id: id }, options);
}



module.exports = {
    getAllUsuarios,
    getUsuarioById,
    getUsuarioByEmail,
    validatePassword,
    generateToken,
    createUsuario,
    updateUsuario,
    deleteUsuario,
};