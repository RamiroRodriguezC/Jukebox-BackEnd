const usuarioService = require("../services/usuarioService");

async function getAll(req, res) {
  try {
    // 1. Leemos los parámetros de paginación desde la URL (query string)
    // Ej: /reviews?limit=10&cursor=a1b2c3d4
    const options = {
      limit: req.query.limit,
      cursor: req.query.cursor
    };
    const usuarios = await usuarioService.getAllUsuarios(options);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getById(req, res) {
  const id = req.params.id;
  try {
    const usuarios = await usuarioService.getUsuarioById(id);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getByEmail(req, res) {
  const mail = req.params.mail;
  try {
    const usuarios = await usuarioService.getUsuarioByEmail(mail);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

//SI HAY TIEMPO CAMBIAR TODAS LAS DECLARACIONES DE FUNCIONES A ESTA FORMA
/*  Esta forma de declarar es el estandar moderno (segun gemini), 
    pero el async function getById(req, res) 
    { ... } es igualmente valido.
*/ 

const login = async (req, res) => {
  try {
    // PASO 1
    // Extraer email y password del body
    const { mail, password } = req.body;
    // Buscar usuario por email

    // PASO 2 -> VALIDAR CREDENCIALES (MAIL)
    //Service
    const usuario = await usuarioService.getUsuarioByEmail(mail); 
    if (!usuario) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    } 
    //

    // PASO 2 -> Validar credenciales (CONTRASEÑA)
    // Service
    // Verificar contraseña (comparar con hash)
    const isMatch = await usuarioService.validatePassword(password, usuario);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }
    //

    // Generar token JWT
    const token = usuarioService.generateToken(usuario);

    res.json({
      message: "Login exitoso",
      token, //PASO 4
      usuario: {
        id: usuario._id,
        nombre: usuario.username,
        mail: usuario.mail,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

async function addCancionAFavorito(req,res) {
  try{
    const {id, idCancion} = req.params;
    const usuarioActualizado = await usuarioService.addFavorito(id, idCancion);
    res.status(201).json(usuarioActualizado);
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}

async function deleteCancionEnFavorito(req, res) {
  try {
    const { id, idCancion } = req.params;
    const usuarioActualizado = await usuarioService.deleteFavorito(id, idCancion);
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createUsuario(req,res) {
  try {
      const usuario = await usuarioService.createUsuario(req.body);
      res.status(201).json(usuario);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function updateUsuario(req,res){
  const usuarioActualizado = await usuarioService.updateUsuario(req.params.id, req.body);
  res.status(201).json(usuarioActualizado);
}

// Borrado Lógico (Soft Delete)
async function softDelete(req, res) {
  try {
    const id = req.params.id;
    // Llamamos al servicio SIN opciones (por defecto es soft delete)
    const result = await usuarioService.deleteUsuario(id);

    if (result.usuarios === 0) {
        return res.status(404).json({ message: "Usuario no encontrado o ya eliminada." });
    }

    res.status(200).json({
        message: "Usuario eliminada lógicamente.",
        report: result
    });
  } catch (err) {
    console.error("Error en softDelete (Usuario):", err);
    res.status(500).json({ error: "Error interno al eliminar el usuario." });
  }
}

module.exports = {
    getAll,
    getById,
    getByEmail,
    login,
    createUsuario,
    updateUsuario,
    softDelete,
    addCancionAFavorito,
    deleteCancionEnFavorito,
};