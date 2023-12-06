require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const bodyParser = require('body-parser');

const app = express();

// Configurar body-parser
// Configurar body-parser con un límite más alto (por ejemplo, 50 MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FacturaSnap application." });
});

// Include routes for FacturaSnap
require("./app/routes/authentication.routes")(app);
require("./app/routes/creditos.routes")(app);
require("./app/routes/datos_fiscales.routes")(app);
require("./app/routes/facturas.routes")(app);
require("./app/routes/planes_pago.routes")(app);
require("./app/routes/sesiones.routes")(app);
require("./app/routes/establecimiento.routes")(app);
require("./app/routes/facturas_has_establecimiento.routes")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
