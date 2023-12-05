module.exports = (sequelize, Sequelize) => {
    const Factura = sequelize.define("facturas", {
        id_factura: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero_folio: {
            type: Sequelize.STRING
        },
        fecha_transaccion: {
            type: Sequelize.STRING
        },
        subtotal: {
            type: Sequelize.STRING
        },
        total: {
            type: Sequelize.STRING
        },
        id_usuario: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false
    });

    Factura.associate = (models) => {
        Factura.belongsTo(models.usuario, {
            foreignKey: 'id_usuario'
        });
    };

    return Factura;
};
