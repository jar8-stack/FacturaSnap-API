const jwt = require('jsonwebtoken');
exports.requireAuth = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];           
      jwt.verify(token, process.env.SECRET, (error, decoded) => {               
        if (error) {
          return res.status(401).json({ message: "Sesión no válida" });
        }
        req.user = decoded;
        next();
      });
    } catch (error) {
      return res.status(401).json({ message: "Sesión no válida"+error });      
    }
  };
  