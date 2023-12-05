module.exports = (sequelize, Sequelize) => {
    const PlanPago = sequelize.define("planes_pago", {
        id_planes_pago: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descripcion: {
            type: Sequelize.STRING
        },
        canatidad_creditos: {
            type: Sequelize.INTEGER
        },
        precio: {
            type: Sequelize.FLOAT
        }
    }, {
        timestamps: false
    });

    return PlanPago;
};
