module.exports = (app) => {
  const facturasHasEstablecimientoController = require("../controllers/facturas_has_establecimiento.controller");

  const facturasHasEstablecimientoRouter = require("express").Router();

  // Define las rutas para el controlador de relaciones entre facturas y establecimientos
  facturasHasEstablecimientoRouter.get("/", facturasHasEstablecimientoController.getAllFacturasHasEstablecimientos);
  facturasHasEstablecimientoRouter.get("/:id_factura/:id_establecimiento", facturasHasEstablecimientoController.getFacturasHasEstablecimientoByIds);
  facturasHasEstablecimientoRouter.post("/", facturasHasEstablecimientoController.createFacturasHasEstablecimiento);
  facturasHasEstablecimientoRouter.delete("/:id_factura/:id_establecimiento", facturasHasEstablecimientoController.deleteFacturasHasEstablecimientoByIds);
  facturasHasEstablecimientoRouter.put("/:id_factura/:id_establecimiento", facturasHasEstablecimientoController.updateFacturasHasEstablecimiento);

  app.use("/api/facturas-has-establecimiento", facturasHasEstablecimientoRouter);
};
