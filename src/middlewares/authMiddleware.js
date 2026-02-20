const jwt = require('jsonwebtoken');
const reviewService = require("../services/reviewService");
const Review = require('../models/reviewModel');

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  // Obtener el token del header Authorization (formato: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer token después de "Bearer "
    console.log("el token que llego aca es: " + token);
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }

    // Agregar la información del usuario decodificada al request
    req.user = user;
    next(); // Continuar con la siguiente función
  });
};

const isAdmin = (req, res, next) => {
  /* Levantamos el user, que la guardo en el request el middle de "authenticateToken" */
  
  if (req.user.rol !== 'admin') {
    console.log(req.user);
    console.log("Intento de acceso a ruta admin por usuario no admin: " + req.user.rol);
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }

  next();
};

// authMiddleware.js

// Mantén tu authenticateToken y isAdmin como están...


// authMiddleware.js - VERSIÓN FINAL Y LIMPIA
const isAuthor = (Model) => {
    return async (req, res, next) => {
      try {
            const id = req.params.id; 
            console.log("ID recibido en isAuthor middleware:", `'${id}'`);
            if (!id) return res.status(400).json({ error: 'ID no proporcionado' });

            const model = await Model.findById(id);
            
            if (!model) {
                return res.status(404).json({ error: 'model no encontrado.' });
            }
            
            const autorIdEnDb = model.autor._id.toString();

            if (req.user.rol !== 'admin' && req.user.id !== autorIdEnDb) {
                return res.status(403).json({ error: 'Acceso denegado. Solo el autor o un administrador pueden realizar esta acción.' });
            }

            // 5. Guardamos el model en req para no buscarlo de nuevo
            req.resource = model;

            next();
        } catch (err) {
            console.error('Error en la validación de autoria:', err);
            res.status(500).json({ error: 'Error en el servidor.' });
        }
    };
};

const isSelf = (req, res, next) => {
  // Comparamos el ID del token con el ID de la URL (req.params.idUser)
  if (req.user.id !== req.params.id && req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo el usuario editado o un adminitrador pueden realizar esta accion' });
  }
  next(); 
};

const isAdminOrReviewOwner = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review no encontrada' });

    if (req.user.id !== review.autor.toString() && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo el autor o un administrador pueden realizar esta acción' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = {
    authenticateToken,
    isAdmin,
    isAuthor,
    isSelf,
    isAdminOrReviewOwner,
};
