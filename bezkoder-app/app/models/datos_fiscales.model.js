module.exports = (sequelize, Sequelize) => {
    const DatosFiscales = sequelize.define("datos_fiscales", {
        id_datos_fiscales: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        razon_social: {
            type: Sequelize.STRING
        },
        calle: {
            type: Sequelize.STRING
        },
        numero_exterior: {
            type: Sequelize.STRING
        },
        curzamientos: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.STRING
        },
        municpio_delegracion: {
            type: Sequelize.STRING
        },
        colonia: {
            type: Sequelize.STRING
        },
        email_fiscal: {
            type: Sequelize.STRING
        },
        codigo_postal: {
            type: Sequelize.STRING
        },
        id_usuario: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false
    });

    DatosFiscales.associate = (models) => {
        DatosFiscales.belongsTo(models.usuario, {
            foreignKey: 'id_usuario'
        });
    };

    return DatosFiscales;
};
