module.exports = {
    up: (QueryInterface, Sequelize) =>
        QueryInterface.sequelize.query("ALTER TABLE settings DROP PRIMARY KEY;")
            .then(() =>
                QueryInterface.addColumn("settings", "settingsId", {
                    type: Sequelize.INTEGER(10),
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    first: true
                })
            )
            .catch(error => {
                /* eslint-disable-next-line no-console */
                console.log(error);
            }),

    down: (QueryInterface, Sequelize) =>
        QueryInterface.removeColumn("settings", "settingsId")
            .then(() =>
                QueryInterface.changeColumn("settings", "settingsName", {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    primaryKey: true
                })
            )
};
