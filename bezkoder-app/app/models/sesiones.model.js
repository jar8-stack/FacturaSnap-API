module.exports = (sequelize, Sequelize) => {
    const Sesion = sequelize.define("sesiones", {
        id_sesiones: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_usuario: {
            type: Sequelize.INTEGER
        },
        jwt_token: {
            type: Sequelize.STRING
        },
        expiration_time: {
            type: Sequelize.DATE
        },
        created_at: {
            type: Sequelize.DATE
        }
    }, {
        timestamps: false
    });

    Sesion.associate = (models) => {
        Sesion.belongsTo(models.usuario, {
            foreignKey: 'id_usuario'
        });
    };

    return Sesion;
};
