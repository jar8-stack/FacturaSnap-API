module.exports = (app) => {
  const authenticationController = require("../controllers/autenticacion.controller");

  const authRouter = require("express").Router();

  authRouter.post("/login", authenticationController.login);
  authRouter.post("/register", authenticationController.register);

  app.use("/api/auth", authRouter);
};
