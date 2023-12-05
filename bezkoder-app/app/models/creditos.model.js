module.exports = (sequelize, Sequelize) => {
    const Credito = sequelize.define("creditos", {
        id_creditos: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidad: {
            type: Sequelize.INTEGER
        },
        id_usuario: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false
    });

    Credito.associate = (models) => {
        Credito.belongsTo(models.usuario, {
            foreignKey: 'id_usuario'
        });
    };

    return Credito;
};
