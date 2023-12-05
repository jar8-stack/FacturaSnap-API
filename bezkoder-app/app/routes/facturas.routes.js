module.exports = (app) => {
    const facturasController = require("../controllers/facturas.controller");
    const auth = require("../middlewares/auth");
  
    const facturasRouter = require("express").Router();
  
    // Define las rutas para el controlador de facturas
    facturasRouter.get("/", auth.requireAuth, facturasController.getAllFacturas);
    facturasRouter.get("/:id", auth.requireAuth, facturasController.getFacturaById);
    facturasRouter.post("/", auth.requireAuth, facturasController.createFactura);
    facturasRouter.put("/:id", auth.requireAuth, facturasController.updateFactura);
    facturasRouter.delete("/:id", auth.requireAuth, facturasController.deleteFactura);
  
    app.use("/api/facturas", facturasRouter);
};
