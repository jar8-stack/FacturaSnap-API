const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.planes_pago = require("./planes_pago.model.js")(sequelize, Sequelize);
db.datos_fiscales = require("./datos_fiscales.model.js")(sequelize, Sequelize);
db.facturas = require("./facturas.model.js")(sequelize, Sequelize);
db.creditos = require("./creditos.model.js")(sequelize, Sequelize);
db.sesiones = require("./sesiones.model.js")(sequelize, Sequelize);
db.establecimiento = require("./establecimiento.model.js")(sequelize, Sequelize);
db.establecimiento = require("./establecimiento.model.js")(sequelize, Sequelize);
db.facturas_has_establecimiento = require("./facturas_has_establecimiento.model.js")(sequelize, Sequelize);

// Desactivar la sincronización automática
sequelize.sync({ force: false }); // Puedes poner 'false' para evitar la eliminación de tablas

// Definir asociaciones si es necesario

module.exports = db;
