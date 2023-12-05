// establecimiento.model.js
module.exports = (sequelize, Sequelize) => {
    const Establecimiento = sequelize.define('establecimiento', {
      id_establecimiento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: Sequelize.STRING(250),
      },
      estado_republica: {
        type: Sequelize.STRING(150),
      },
      metodo_factura: {
        type: Sequelize.STRING(150),
      },      
    });
  
    return Establecimiento;
  };
  