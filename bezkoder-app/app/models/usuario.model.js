module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        id_usuario: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        primer_nombre: {
            type: Sequelize.STRING
        },
        segundo_nombre: {
            type: Sequelize.STRING
        },
        primer_apellido: {
            type: Sequelize.STRING
        },
        segundo_apellido: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        id_planes_pago: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false
    });

    Usuario.associate = (models) => {
        Usuario.belongsTo(models.planes_pago, {
            foreignKey: 'id_planes_pago'
        });
    };

    return Usuario;
};
