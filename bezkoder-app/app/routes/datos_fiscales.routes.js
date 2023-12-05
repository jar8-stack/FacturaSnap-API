module.exports = (app) => {
    const datosFiscalesController = require("../controllers/datos_fiscales.controller");
    const auth = require("../middlewares/auth");
  
    const datosFiscalesRouter = require("express").Router();
  
    // Define las rutas para el controlador de datos fiscales
    datosFiscalesRouter.get("/", auth.requireAuth, datosFiscalesController.getAllDatosFiscales);
    datosFiscalesRouter.get("/:id", auth.requireAuth, datosFiscalesController.getDatosFiscalesById);
    datosFiscalesRouter.post("/", auth.requireAuth, datosFiscalesController.createDatosFiscales);
    datosFiscalesRouter.put("/:id", auth.requireAuth, datosFiscalesController.updateDatosFiscales);
    datosFiscalesRouter.delete("/:id", auth.requireAuth, datosFiscalesController.deleteDatosFiscales);
  
    app.use("/api/datos-fiscales", datosFiscalesRouter);
};
