const { logFile } = require('../helpers/loggers');

const isAdmin = false;

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  }
  else {
    return res.status(403).json({
      error: -1,
      descripcion: `usuario no logueado`
    });
  }
}

const checkAuthorization = (req, res, next) => {
  if (!isAdmin) {
    const { method, baseUrl } = req;
    logFile.warn(`ruta ${baseUrl} metodo ${method} no autorizada`);

    return res.status(500).json({
      error: -1,
      descripcion: `ruta ${baseUrl} metodo ${method} no autorizada`
    });
  }
  next();
}

module.exports = {
  checkAuthorization,
  checkAuthentication,
}