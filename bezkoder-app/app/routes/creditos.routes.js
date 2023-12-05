module.exports = (app) => {
    const creditosController = require("../controllers/creditos.controller");
  
    const creditosRouter = require("express").Router();
  
    // Define las rutas para el controlador de créditos
    creditosRouter.get("/", creditosController.getAllCreditos);
    creditosRouter.get("/:id", creditosController.getCreditoById);
    creditosRouter.post("/", creditosController.createCredito);
    creditosRouter.put("/:id", creditosController.updateCredito);
    creditosRouter.delete("/:id", creditosController.deleteCredito);
  
    app.use("/api/creditos", creditosRouter);
};
