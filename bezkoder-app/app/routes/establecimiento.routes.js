module.exports = (app) => {
    const establecimientoController = require("../controllers/establecimiento.controller");
  
    const establecimientoRouter = require("express").Router();
  
    // Define las rutas para el controlador de establecimientos
    establecimientoRouter.get("/", establecimientoController.getAllEstablecimientos);
    establecimientoRouter.get("/:id", establecimientoController.getEstablecimientoById);
    establecimientoRouter.post("/", establecimientoController.createEstablecimiento);
    establecimientoRouter.put("/:id", establecimientoController.updateEstablecimiento);
    establecimientoRouter.delete("/:id", establecimientoController.deleteEstablecimiento);
  
    app.use("/api/establecimientos", establecimientoRouter);
  };
  