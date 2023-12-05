module.exports = (app) => {
    const sesionesController = require("../controllers/sesiones.controller");
  
    const sesionesRouter = require("express").Router();
  
    // Define las rutas para el controlador de sesiones
    sesionesRouter.get("/", sesionesController.getAllSesiones);
    sesionesRouter.get("/:id", sesionesController.getSesionById);
    sesionesRouter.post("/", sesionesController.createSesion);
    sesionesRouter.put("/:id", sesionesController.updateSesion);
    sesionesRouter.delete("/:id", sesionesController.deleteSesion);
  
    app.use("/api/sesiones", sesionesRouter);
};
