// facturas_has_establecimiento.model.js
module.exports = (sequelize, Sequelize) => {
    const FacturasHasEstablecimiento = sequelize.define('facturas_has_establecimiento', {
      id_factura: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      id_establecimiento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
    });
  
    return FacturasHasEstablecimiento;
  };
  