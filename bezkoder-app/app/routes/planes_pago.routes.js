module.exports = (app) => {
    const planesPagoController = require("../controllers/planes_pago.controller");
  
    const planesPagoRouter = require("express").Router();
  
    // Define las rutas para el controlador de planes de pago
    planesPagoRouter.get("/", planesPagoController.getAllPlanesPago);
    planesPagoRouter.get("/:id", planesPagoController.getPlanPagoById);
    planesPagoRouter.post("/", planesPagoController.createPlanPago);
    planesPagoRouter.put("/:id", planesPagoController.updatePlanPago);
    planesPagoRouter.delete("/:id", planesPagoController.deletePlanPago);
  
    app.use("/api/planes-pago", planesPagoRouter);
};
